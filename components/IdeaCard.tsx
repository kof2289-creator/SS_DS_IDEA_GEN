import React, { forwardRef } from 'react';
import type { IdeaCardData } from '../types.ts';
import { BotIcon, BrainIcon, LightbulbIcon, DownloadIcon } from './icons.tsx';

interface IdeaCardProps {
  data: IdeaCardData | null;
  onDownload?: () => void;
}

const getRoleTheme = (role: string) => {
  switch (role) {
    case 'Assistant':
      return {
        bg: 'bg-emerald-50/50',
        border: 'border-emerald-200/60',
        text: 'text-emerald-800',
        badge: 'bg-emerald-500 text-white shadow-emerald-200',
        keyword: 'bg-emerald-100 text-emerald-800',
        iconBg: 'bg-emerald-500',
        icon: BotIcon
      };
    case 'Advisor':
      return {
        bg: 'bg-blue-50/50',
        border: 'border-blue-200/60',
        text: 'text-blue-800',
        badge: 'bg-blue-500 text-white shadow-blue-200',
        keyword: 'bg-blue-100 text-blue-800',
        iconBg: 'bg-blue-500',
        icon: BrainIcon
      };
    case 'Agent':
      return {
        bg: 'bg-amber-50/50',
        border: 'border-amber-200/60',
        text: 'text-amber-800',
        badge: 'bg-amber-500 text-white shadow-amber-200',
        keyword: 'bg-amber-100 text-amber-800',
        iconBg: 'bg-amber-500',
        icon: LightbulbIcon
      };
    default:
      return {
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        text: 'text-slate-700',
        badge: 'bg-slate-500 text-white',
        keyword: 'bg-slate-100 text-slate-700',
        iconBg: 'bg-slate-500',
        icon: LightbulbIcon
      };
  }
};

export const IdeaCard = forwardRef<HTMLDivElement, IdeaCardProps>(({ data, onDownload }, ref) => {
  if (!data) {
    return null;
  }

  const theme = getRoleTheme(data.category);
  const RoleIcon = theme.icon;

  return (
    <div 
        ref={ref} 
        className={`idea-card-component relative p-6 sm:p-8 rounded-3xl border-2 ${theme.bg} ${theme.border} shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] animate-fade-in-up transition-all duration-300 bg-white/60 backdrop-blur-sm`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex gap-5 items-start pr-12">
            <div className={`w-14 h-14 rounded-2xl ${theme.iconBg} flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/5 text-white transform transition-transform group-hover:scale-105`}>
                <RoleIcon className="w-7 h-7" />
            </div>
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold shadow-sm ${theme.badge}`}>
                        {data.category}
                    </span>
                </div>
                <h2 className={`text-2xl sm:text-3xl font-extrabold ${theme.text} leading-tight tracking-tight`}>
                    {data.solutionTitle}
                </h2>
            </div>
        </div>
        
        {/* Download Button */}
        {onDownload && (
            <button 
                onClick={onDownload}
                className="absolute top-6 right-6 p-2.5 rounded-xl bg-white/80 border border-slate-200/60 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-300 print:hidden"
                title="PNG로 저장"
            >
                <DownloadIcon className="w-5 h-5" />
            </button>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8">
        {/* Left Column */}
        <div className="space-y-8">
            <div className="group">
                <h4 className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3 uppercase tracking-wider opacity-70">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    업무 프로세스
                </h4>
                <div className="relative">
                    <div className="absolute inset-0 bg-white/40 rounded-xl transform rotate-1 group-hover:rotate-0 transition-transform"></div>
                    <p className="relative bg-white/80 p-4 rounded-xl border border-slate-100/80 text-slate-800 text-base font-semibold leading-relaxed shadow-sm break-words">
                        {data.process}
                    </p>
                </div>
            </div>
            <div>
                <h4 className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3 uppercase tracking-wider opacity-70">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    AX 솔루션 개요
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed font-medium bg-transparent pl-1">
                    {data.solutionOverview}
                </p>
            </div>
            <div>
                <h4 className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3 uppercase tracking-wider opacity-70">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    사람의 역할
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed font-medium bg-transparent pl-1">
                    {data.humanRole}
                </p>
            </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
            <div>
                <h4 className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3 uppercase tracking-wider opacity-70">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    기대효과
                </h4>
                <ul className="space-y-3">
                    {data.expectedEffects.map((effect, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium bg-white/30 p-2 rounded-lg hover:bg-white/50 transition-colors">
                            <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${theme.iconBg}`}></span>
                            {effect}
                        </li>
                    ))}
                </ul>
            </div>
            
            <div>
                <h4 className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3 uppercase tracking-wider opacity-70">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    키워드
                </h4>
                <div className="flex flex-wrap gap-2.5">
                    {data.keywords.map((keyword, i) => (
                        <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-transform hover:scale-105 cursor-default ${theme.keyword}`}>
                            #{keyword}
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3 uppercase tracking-wider opacity-70">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    기술
                </h4>
                <div className="flex flex-wrap gap-2">
                    {data.technologies.map((tech, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
});