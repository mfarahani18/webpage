import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  MonitorSmartphone, 
  CheckCircle2, 
  ChevronRight, 
  Building2, 
  Flame, 
  Lightbulb,
  Copy,
  Check
} from 'lucide-react';
import { STRATEGY_MODULES } from '../data/mockData';

interface StrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopicForDetails: (topicId: number) => void;
}

export const StrategyModal: React.FC<StrategyModalProps> = ({
  isOpen,
  onClose,
  onSelectTopicForDetails,
}) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentModule = STRATEGY_MODULES.find(m => m.id === activeTab) || STRATEGY_MODULES[0];

  const getIcon = (name: string) => {
    switch (name) {
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-indigo-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-600" />;
      case 'MonitorSmartphone': return <MonitorSmartphone className="w-5 h-5 text-sky-600" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5 text-purple-600" />;
      default: return <Lightbulb className="w-5 h-5 text-blue-600" />;
    }
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative bg-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-slate-200 my-4 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#12284C] text-white p-5 sm:p-6 flex items-center justify-between border-b border-blue-900 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-2 py-0.5 rounded">
                مستند راهبردی
              </span>
              <span className="text-xs text-blue-200">نقشه راه صفر تا صد برندسازی و توسعه بازار بازرگانی TSH</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              برنامه استراتژیک ۶ محوره تأسیسات و تجهیزات خانگی
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal Pillar Tabs */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center gap-2 min-w-max">
            {STRATEGY_MODULES.map((mod) => {
              const isActive = activeTab === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveTab(mod.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-[#12284C] shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[11px] font-extrabold text-slate-700">
                    {mod.id}
                  </span>
                  <span>{mod.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-right">
          
          {/* Active Module Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                {getIcon(currentModule.iconName)}
              </div>
              <div>
                <span className="text-xs font-bold text-blue-700">بخش {currentModule.id} از ۶</span>
                <h3 className="text-xl font-black text-[#12284C]">
                  {currentModule.title}
                </h3>
                <span className="text-xs text-slate-700 font-mono">
                  {currentModule.englishTitle}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`${currentModule.title}\n${currentModule.summary}\n${currentModule.keyPoints.join('\n')}`, currentModule.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors self-start sm:self-auto"
            >
              {copiedId === currentModule.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>کپی متن استراتژی</span>
                </>
              )}
            </button>
          </div>

          {/* Summary Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm leading-relaxed text-slate-800">
            <strong>خلاصه اجرایی:</strong> {currentModule.summary}
          </div>

          {/* Key Strategic Points */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              محورهای عملیاتی و راهبردی کلیدی:
            </h4>
            <div className="space-y-2.5">
              {currentModule.keyPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-2xs">
                  <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {pt}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Concrete Iranian Market Insight & Real Example */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl space-y-1.5">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                تحلیل واقع‌بینانه بازار رقابتی ایران:
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                {currentModule.iranMarketInsight}
              </p>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl space-y-1.5">
              <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                نمونه اجرایی دقیق و ملموس (Case Study):
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed">
                {currentModule.concreteExample}
              </p>
            </div>

          </div>

          {/* Prompt Section for Logo Module (Module 4) */}
          {currentModule.id === 4 && (
            <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="text-amber-400 font-bold font-sans flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                پرامپت تخصصی طراحی لوگوی TSH (ویژه هوش مصنوعی Midjourney / Imagen 3):
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed select-all">
                "Minimalist luxury corporate logo for 'TSH Modern Comfort Solutions', combining an abstract sleek aerodynamic wind airflow swirl, clean architectural geometry representing home comfort & luxury kitchen, and a subtle flame spark. Deep navy blue (#12284C) and crisp ice blue accents, vector, white background, no gradients, timeless architectural emblem, pristine Swiss style typography."
              </div>
            </div>
          )}

        </div>

        {/* Footer with Step Navigation */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">پیمایش محورها:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setActiveTab(num)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    activeTab === num
                      ? 'bg-[#12284C] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab < 6 && (
              <button
                onClick={() => setActiveTab(activeTab + 1)}
                className="px-4 py-2 bg-[#12284C] text-white text-xs font-bold rounded-xl hover:bg-blue-900 transition-colors flex items-center gap-1"
              >
                محور بعدی: {STRATEGY_MODULES[activeTab]?.title}
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
