import React, { useEffect, useState, forwardRef } from 'react';
import type { ScenarioData, ScenarioCut } from '../types.ts';
import { generateScenarioImage } from '../services/scenarioService.ts';
import { BotIcon, BrainIcon, LightbulbIcon, DownloadIcon } from './icons.tsx';

interface ScenarioCardProps {
  data: ScenarioData;
  onDownload?: () => void;
}

const getRoleTheme = (role: string) => {
    switch (role) {
      case 'Assistant':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          badge: 'bg-emerald-500 text-white',
          text: 'text-emerald-700',
          icon: BotIcon
        };
      case 'Advisor':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          badge: 'bg-blue-500 text-white',
          text: 'text-blue-700',
          icon: BrainIcon
        };
      case 'Agent':
        return {
          bg: 'bg-violet-50',
          border: 'border-violet-200',
          badge: 'bg-violet-500 text-white',
          text: 'text-violet-700',
          icon: LightbulbIcon
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          badge: 'bg-slate-500 text-white',
          text: 'text-slate-700',
          icon: LightbulbIcon
        };
    }
  };

const ScenarioCutPanel: React.FC<{ cut: ScenarioCut; index: number }> = ({ cut, index }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchImage = async () => {
            // Stagger requests slightly to avoid hitting rate limits instantly
            await new Promise(r => setTimeout(r, index * 1500)); 
            if (!isMounted) return;
            
            try {
                const url = await generateScenarioImage(cut);
                if (isMounted) setImageUrl(url);
            } catch (e) {
                console.error("Primary image generation failed, trying fallback", e);
                // Fallback attempt
                try {
                     if (isMounted) {
                         // Wait a bit before fallback retry
                         await new Promise(r => setTimeout(r, 1000));
                         const fallbackUrl = await generateScenarioImage(cut, true);
                         if (isMounted) setImageUrl(fallbackUrl);
                     }
                } catch (e2) {
                    if (isMounted) setError(true);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchImage();
        return () => { isMounted = false; };
    }, [cut, index]);

    return (
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="aspect-video bg-slate-100 relative flex items-center justify-center overflow-hidden border-b border-slate-100">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
                        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                        <span className="text-xs">이미지 생성 중...</span>
                    </div>
                )}
                {error && (
                    <div className="text-xs text-slate-400 text-center p-4">
                        이미지 생성 실패<br/>(서버 부하)
                    </div>
                )}
                {imageUrl && (
                    <img src={imageUrl} alt={cut.sceneName} className="w-full h-full object-cover animate-fade-in-up" />
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {index + 1}
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{cut.sceneName}</h4>
                </div>
                <p className="text-sm text-slate-600 mb-3 flex-grow leading-relaxed whitespace-pre-line">
                    {cut.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                    {cut.features.map((feature, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            {feature}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const ScenarioCard = forwardRef<HTMLDivElement, ScenarioCardProps>(({ data, onDownload }, ref) => {
    const theme = getRoleTheme(data.type);
    const cuts = [data.cut1, data.cut2, data.cut3, data.cut4];

    return (
        <div 
            ref={ref}
            className={`scenario-card-component relative rounded-2xl shadow-xl shadow-slate-900/5 overflow-hidden border ${theme.bg} ${theme.border} bg-white animate-fade-in-up`}
        >
            <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${theme.badge}`}>
                                {data.type}
                            </span>
                            <h2 className={`text-2xl font-bold ${theme.text}`}>
                                {data.ideaName}
                            </h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            {data.ideaOverview}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {data.childAgents.map((agent, i) => (
                                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-slate-200 shadow-sm text-slate-600">
                                    🤖 {agent.replace('Agent', '').trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    {onDownload && (
                        <button
                            onClick={onDownload}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-medium border border-slate-200 bg-white hover:bg-slate-100 h-9 px-3 text-slate-700 flex-shrink-0 print:hidden self-start"
                        >
                            <DownloadIcon className="w-3.5 h-3.5 mr-1.5" />
                            이미지 저장
                        </button>
                    )}
                </div>

                {/* Cuts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cuts.map((cut, idx) => (
                        <ScenarioCutPanel key={idx} cut={cut} index={idx} />
                    ))}
                </div>
            </div>
        </div>
    );
});