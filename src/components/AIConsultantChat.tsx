```tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIConsultantChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

const DEFAULT_SUGGESTIONS = [
  'برای واحد ۱۱۰ متری در قم پکیج ۲۴ بهتر است یا ۲۸؟',
  'فرق رادیاتور پنلی لورچ با پره‌ای ایران رادیاتور در آب سخت چیست؟',
  'باندل ویژه سازندگان برای ساختمان ۵ واحدی شامل چیست؟',
  'بهترین ست هود مخفی و گاز صفحه‌ای برای آشپزخانه مدرن کدام است؟',
];

const SYSTEM_PROMPT = `
شما کارشناس ارشد مهندسی فروش و تأسیسات شرکت بازرگانی مطبوع شهر (TSH) هستید.

به تمام سوالات کاربران درباره موارد زیر پاسخ دهید:

- انواع پکیج دیواری بوتان و ایران رادیاتور
- رادیاتورهای پره‌ای و پنلی
- اسپلیت
- کولر گازی
- تجهیزات آشپزخانه

پاسخ‌ها باید:

- تخصصی
- مودبانه
- دقیق
- قابل فهم
- کاربردی

باشند.

شرایط آب‌وهوایی گرم و خشک و همچنین آب سخت را در پیشنهادهای فنی لحاظ کنید.

اگر اطلاعات کافی برای یک پیشنهاد دقیق ندارید، ابتدا اطلاعات موردنیاز را از کاربر بپرسید.
`;

const getTime = () =>
  new Date().toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  });

const createMessage = (
  role: ChatMessage['role'],
  content: string,
  idPrefix: string,
): ChatMessage => ({
  id: `${idPrefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`,
  role,
  content,
  timestamp: getTime(),
});

export const AIConsultantChat: React.FC<AIConsultantChatProps> = ({
  isOpen,
  onClose,
  initialTopic,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage(
      'assistant',
      'سلام و احترام! من کارشناس ارشد مهندسی فروش و تأسیسات بازرگانی مطبوع شهر (TSH) هستم. چطور می‌توانم در انتخاب پکیج، رادیاتور، کولر گازی یا تجهیزات آشپزخانه به شما کمک کنم؟',
      'welcome',
    ),
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastInitialTopicRef = useRef<string | null>(null);

  /*
   * اسکرول خودکار به آخرین پیام
   */
  useEffect(() => {
    if (!isOpen) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, isOpen]);

  /*
   * ارسال خودکار initialTopic
   *
   * فقط وقتی topic واقعاً تغییر کرده باشد
   * ارسال می‌شود.
   */
  useEffect(() => {
    if (!isOpen || !initialTopic) return;

    const topic = initialTopic.trim();

    if (!topic) return;

    if (lastInitialTopicRef.current === topic) {
      return;
    }

    lastInitialTopicRef.current = topic;

    void handleSendMessage(topic);
  }, [initialTopic, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputMessage).trim();

    if (!text || isLoading) {
      return;
    }

    const userMsg = createMessage(
      'user',
      text,
      'user',
    );

    /*
     * برای جلوگیری از مشکل stale state،
     * پیام را با functional update اضافه می‌کنیم.
     */
    setMessages((prev) => [...prev, userMsg]);

    if (!textToSend) {
      setInputMessage('');
    }

    setIsLoading(true);

    try {
      /*
       * API فقط به backend خودمان درخواست می‌فرستد.
       */
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT,
            },

            /*
             * نکته:
             * اینجا messages فعلی + userMsg ارسال می‌شوند.
             */
            ...messages.map((message) => ({
              role: message.role,
              content: message.content,
            })),

            {
              role: userMsg.role,
              content: userMsg.content,
            },
          ],
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        console.error('Chat API Error:', data);

        if (response.status === 429) {
          throw new Error(
            'سرویس هوش مصنوعی در حال حاضر با محدودیت درخواست مواجه است. لطفاً چند لحظه دیگر دوباره تلاش کنید.',
          );
        }

        if (response.status === 401) {
          throw new Error(
            'خطای احراز هویت سرویس هوش مصنوعی رخ داده است.',
          );
        }

        if (response.status === 500) {
          throw new Error(
            'خطایی در سرور هوش مصنوعی رخ داده است.',
          );
        }

        throw new Error(
          data?.error ||
            'ارتباط با سرویس هوش مصنوعی با خطا مواجه شد.',
        );
      }

      const replyContent =
        data?.reply ||
        data?.choices?.[0]?.message?.content ||
        'پاسخی از سمت هوش مصنوعی دریافت نشد.';

      const assistantReply = createMessage(
        'assistant',
        replyContent,
        'assistant',
      );

      setMessages((prev) => [
        ...prev,
        assistantReply,
      ]);
    } catch (error) {
      console.error('Chat error:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'در برقراری ارتباط با سرویس هوش مصنوعی خطایی رخ داد.';

      const errorMsg = createMessage(
        'assistant',
        errorMessage,
        'error',
      );

      setMessages((prev) => [
        ...prev,
        errorMsg,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      createMessage(
        'assistant',
        'گفتگو بازنشانی شد. چطور می‌توانم در خصوص تأسیسات سرمایش، گرمایش و آشپزخانه راهنمایی‌تان کنم؟',
        'welcome-reset',
      ),
    ]);

    setInputMessage('');

    /*
     * اجازه می‌دهیم initialTopic دوباره ارسال شود.
     */
    lastInitialTopicRef.current = null;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div
        className="relative bg-white w-full sm:max-w-lg h-full sm:h-[88vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#12284C] text-white p-4 flex items-center justify-between border-b border-blue-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm sm:text-base">
                  مشاور مهندسی TSH
                </h3>

                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="text-[11px] text-blue-200">
                هوش مصنوعی تخصصی تأسیسات و آشپزخانه
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleClearHistory}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1 cursor-pointer"
              title="پاکسازی تاریخچه گفتگو"
              aria-label="پاکسازی تاریخچه گفتگو"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
              aria-label="بستن چت"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="p-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="text-[11px] text-slate-500 font-bold ml-1">
              پرسش‌های پرتکرار:
            </span>

            {DEFAULT_SUGGESTIONS.map(
              (suggestion, index) => (
                <button
                  key={`${suggestion}-${index}`}
                  type="button"
                  onClick={() =>
                    void handleSendMessage(suggestion)
                  }
                  disabled={isLoading}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 transition-colors whitespace-nowrap shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {suggestion}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-100/60">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  isUser
                    ? 'flex-row-reverse'
                    : 'flex-row'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                    isUser
                      ? 'bg-blue-700 text-white'
                      : 'bg-[#12284C] text-amber-300'
                  }`}
                >
                  {isUser ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </div>

                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  <div>{msg.content}</div>

                  <div
                    className={`text-[10px] mt-1.5 text-left ${
                      isUser
                        ? 'text-blue-200'
                        : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading */}
          {isLoading && (
            <div className="flex gap-2.5 items-center">
              <div className="w-7 h-7 rounded-lg bg-[#12284C] text-amber-300 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>

              <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />

                <span className="text-[11px]">
                  کارشناس TSH در حال تحلیل و پاسخگویی...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(event) =>
                setInputMessage(event.target.value)
              }
              placeholder="سوال خود در مورد پکیج، کولر گازی، رادیاتور یا قیمت را بنویسید..."
              className="flex-1 p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden text-slate-900"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={
                !inputMessage.trim() || isLoading
              }
              className="p-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white transition-colors shrink-0 shadow-xs cursor-pointer"
              aria-label="ارسال پیام"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="text-[10px] text-slate-700 text-center mt-1.5">
            پشتیبانی شده توسط هوش مصنوعی مهندسی تأسیسات TSH
            (مطبوع شهر)
          </div>
        </div>
      </div>
    </div>
  );
};
```

### یک نکته مهم

مشکل اصلی نسخه قبلی این قسمت بود که `setMessages(newMessages)` انجام می‌شد ولی برای درخواست API از همان `newMessages` استفاده می‌کرد. در نسخه بالا این بخش به شکل مشخصی مدیریت شده و `userMsg` مستقیماً به history ارسالی اضافه می‌شود.

همچنین `id` پیام‌ها را از حالت صرفاً `Date.now()` خارج کردم تا اگر دو پیام تقریباً هم‌زمان ساخته شوند، احتمال تکراری شدن `key` کمتر شود.

اگر خطایی که الان داری **مربوط به `/api/chat` یا OpenRouter و خطای 429** است، این فایل به‌تنهایی مشکل را حل نمی‌کند؛ آن قسمت مربوط به `server.ts`/backend است و باید کد backend را هم اصلاح کنیم.
