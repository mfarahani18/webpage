import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Trash2, 
  Building2, 
  RotateCcw,
  Flame,
  Wind
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

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
export const AIConsultantChat: React.FC<AIConsultantChatProps> = ({
  isOpen,
  onClose,
  initialTopic,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: 'سلام و احترام! من کارشناس ارشد مهندسی فروش و تأسیسات بازرگانی مطبوع شهر (TSH) هستم. چطور می‌توانم در انتخاب پکیج، رادیاتور، کولر گازی یا تجهیزات آشپزخانه به شما کمک کنم؟',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle initial topic injection if passed
  useEffect(() => {
    if (initialTopic && isOpen) {
      handleSendMessage(initialTopic);
    }
  }, [initialTopic, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://webpage-6rh8.onrender.com",
          "X-Title": "TSH Comfort Solutions",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-70b-instruct:free",
          messages: [
            {
              role: "system",
              content: "شما مشاور و کارشناس ارشد مهندسی تاسیسات شرکت بازرگانی مطبوع شهر (TSH) هستید. لحن شما حرفه‌ای، مودبانه، فنی و راهنما است. تخصص شما روی پکیج دیواری (بوتان و ایران رادیاتور)، انواع رادیاتور (پنلی و پره‌ای)، کولر گازی و اسپلیت، تصفیه آب و تجهیزات آشپزخانه (هود، گاز، سینک) است. پاسخ‌ها را دقیق، علمی و با در نظر گرفتن اقلیم آب و هوایی گرم و خشک و آب سخت (مانند قم) ارائه دهید."
            },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      const replyContent = data.choices?.[0]?.message?.content || 'پاسخی از سمت هوش مصنوعی دریافت نشد.';

      const assistantReply: ChatMessage = {
        id: 'assistant-' + Date.now(),
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantReply]);
    } catch (err) {
      console.error("OpenRouter API Error:", err);
      const errorMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: 'در برقراری ارتباط با کارشناس هوشمند مشکلی پیش آمد. لطفاً از اتصال اینترنت خود اطمینان حاصل فرمایید یا مجدداً سوال فرمایید.',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: 'گفتگو بازنشانی شد. چطور می‌توانم در خصوص تأسیسات سرمایش، گرمایش و آشپزخانه راهنمایی‌تان کنم؟',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="relative bg-white w-full sm:max-w-lg h-full sm:h-[88vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Header */}
        <div className="bg-[#12284C] text-white p-4 flex items-center justify-between border-b border-blue-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm sm:text-base">مشاور مهندسی TSH</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[11px] text-blue-200">هوش مصنوعی تخصصی تأسیسات و آشپزخانه</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1"
              title="پاکسازی تاریخچه گفتگو"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
              aria-label="بستن چت"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="p-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="text-[11px] text-slate-500 font-bold ml-1">پرسش‌های پرتکرار:</span>
            {DEFAULT_SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sug)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 transition-colors whitespace-nowrap shadow-2xs cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-100/60">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                    isUser
                      ? 'bg-blue-700 text-white'
                      : 'bg-[#12284C] text-amber-300'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
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
                      isUser ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-2.5 items-center">
              <div className="w-7 h-7 rounded-lg bg-[#12284C] text-amber-300 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px]">کارشناس TSH در حال تحلیل و پاسخگویی...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="سوال خود در مورد پکیج، کولر گازی، رادیاتور یا قیمت را بنویسید..."
              className="flex-1 p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden text-slate-900"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white transition-colors shrink-0 shadow-xs cursor-pointer"
              aria-label="ارسال پیام"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-slate-700 text-center mt-1.5">
            پشتیبانی شده توسط هوش مصنوعی مهندسی تأسیسات TSH (مطبوع شهر)
          </div>
        </div>

      </div>
    </div>
  );
};