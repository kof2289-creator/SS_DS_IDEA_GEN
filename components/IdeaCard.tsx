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
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        badge: 'bg-emerald-500 text-white',
        badgeLight: 'bg-emerald-100 text-emerald-700',
        text: 'text-emerald-700',
        iconBg: 'bg-emerald-500',
        icon: BotIcon
      };
    case 'Advisor':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        badge: 'bg-blue-500 text-white',
        badgeLight: 'bg-blue-100 text-blue-700',
        text: 'text-blue-700',
        iconBg: 'bg-blue-500',
        icon: BrainIcon
      };
    case 'Agent':
      return {
        bg: 'bg-violet-50',
        border: 'border-violet-200',
        badge: 'bg-violet-500 text-white',
        badgeLight: 'bg-violet-100 text-violet-700',
        text: 'text-violet-700',
        iconBg: 'bg-violet-500',
        icon: LightbulbIcon
      };
    default:
      return {
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        badge: 'bg-slate-500 text-white',
        badgeLight: 'bg-slate-100 text-slate-700',
        text: 'text-slate-700',
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
        className={`idea-card-component relative rounded-2xl shadow-xl shadow-slate-900/5 overflow-hidden border ${theme.bg} ${theme.border} animate-fade-in-up bg-white`}
    >
      <div className="p-6 md:p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl ${theme.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <RoleIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${theme.badge} mb-2`}>
                        {data.category}
                    </span>
                    <h3 className={`text-lg md:text-xl font-bold ${theme.text} leading-tight`}>
                        {data.solutionTitle}
                    </h3>
                </div>
            </div>
            
            {onDownload && (
                <button
                    onClick={onDownload}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-9 px-3 opacity-70 hover:opacity-100 hover:shadow-sm flex-shrink-0 print:hidden"
                >
                    <DownloadIcon className="w-3.5 h-3.5 mr-1.5" />
                    PNG 다운로드
                </button>
            )}
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
                <div className="bg-white/50 rounded-xl p-4 border border-slate-100/50">
                    <h4 className="font-bold text-slate-700 text-sm mb-2">업무 프로세스:</h4>
                    <p className="text-slate-600 text-sm leading-[1.65]">
                        {data.process}
                    </p>
                </div>
                <div className="bg-white/50 rounded-xl p-4 border border-slate-100/50">
                    <h4 className="font-bold text-slate-700 text-sm mb-2">AX 솔루션 개요:</h4>
                    <p className="text-slate-600 text-sm leading-[1.65]">
                        {data.solutionOverview}
                    </p>
                </div>
                <div className="bg-white/50 rounded-xl p-4 border border-slate-100/50">
                    <h4 className="font-bold text-slate-700 text-sm mb-2">사람의 역할:</h4>
                    <p className="text-slate-600 text-sm leading-[1.65]">
                        {data.humanRole}
                    </p>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
                <div className="bg-white/50 rounded-xl p-4 border border-slate-100/50">
                    <h4 className="font-bold text-slate-700 text-sm mb-2">기대효과:</h4>
                    <ul className="space-y-1.5">
                        {data.expectedEffects.map((effect, i) => (
                            <li key={i} className="text-slate-600 text-sm flex items-start gap-2 leading-[1.65]">
                                <span className={`w-1.5 h-1.5 rounded-full ${theme.iconBg} mt-2 flex-shrink-0`}></span>
                                {effect}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white/50 rounded-xl p-4 border border-slate-100/50">
                    <h4 className="font-bold text-slate-700 text-sm mb-2.5">키워드:</h4>
                    <div className="flex flex-wrap gap-2">
                        {data.keywords.map((keyword, i) => (
                            <span key={i} className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${theme.badgeLight}`}>
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-white/50 rounded-xl p-4 border border-slate-100/50">
                    <h4 className="font-bold text-slate-700 text-sm mb-2.5">기술:</h4>
                    <div className="flex flex-wrap gap-2">
                        {data.technologies.map((tech, i) => (
                            <span key={i} className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 bg-white">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
});