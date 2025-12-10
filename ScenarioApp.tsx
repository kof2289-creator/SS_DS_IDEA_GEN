import React, { useState, useRef } from 'react';
import { ScenarioCard } from './components/ScenarioCard.tsx';
import { generateScenario } from './services/scenarioService.ts';
import type { ScenarioFormData, ScenarioData } from './types.ts';
import { FileTextIcon, Loader2Icon, SparklesIcon, RocketIcon } from './components/icons.tsx';

const ScenarioApp: React.FC = () => {
    const [formData, setFormData] = useState<ScenarioFormData>({
        ideaName: '',
        ideaOverview: '',
        cut1: '',
        cut2: '',
        cut3: '',
        cut4: ''
    });
    const [scenario, setScenario] = useState<ScenarioData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.ideaName || !formData.ideaOverview) return;

        setIsLoading(true);
        setScenario(null);

        try {
            const result = await generateScenario(formData);
            setScenario(result);
        } catch (error) {
            console.error(error);
            alert('시나리오 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!cardRef.current || !(window as any).html2canvas) return;
        
        try {
            const canvas = await (window as any).html2canvas(cardRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                allowTaint: true,
            });
            const data = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = data;
            link.download = `${scenario?.type}_scenario.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Download failed:', err);
            alert('이미지 저장에 실패했습니다.');
        }
    };

    return (
        <div className="min-h-screen relative font-sans text-slate-900">
             {/* Unified Gradient Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-purple-50/50 to-blue-50/30" />
            
            <div className="relative z-10 flex flex-col min-h-screen">
                <header className="relative pt-16 pb-8 px-4">
                    <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25 mb-4 animate-float">
                            <RocketIcon className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-500 bg-clip-text text-transparent">
                            삼성전자DS AX 시나리오 생성기
                        </h1>
                        <p className="text-slate-600 max-w-xl mx-auto">
                            AX 아이디어를 구체적인 4컷 시나리오로 발전시켜보세요
                        </p>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-6 md:py-10 max-w-6xl flex-grow">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Input Form */}
                        <div className="lg:col-span-4">
                            <div className="bg-white/70 backdrop-blur-md shadow-xl shadow-indigo-900/5 rounded-2xl border border-indigo-100 sticky top-6 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-indigo-50">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                                            <FileTextIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <h2 className="font-semibold text-lg text-slate-800">시나리오 설정</h2>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">AX 아이디어 이름</label>
                                            <input
                                                name="ideaName"
                                                value={formData.ideaName}
                                                onChange={handleInputChange}
                                                className="w-full h-11 rounded-xl border border-indigo-200 px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                                placeholder="예: 공정 설비 예지보전 AI"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">아이디어 개요</label>
                                            <textarea
                                                name="ideaOverview"
                                                value={formData.ideaOverview}
                                                onChange={handleInputChange}
                                                className="w-full min-h-[100px] rounded-xl border border-indigo-200 p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-none transition-all"
                                                placeholder="아이디어의 핵심 내용과 목표를 입력하세요"
                                                required
                                            />
                                        </div>

                                        <div className="pt-4 border-t border-indigo-50">
                                            <h3 className="text-sm font-semibold text-slate-700 mb-3">4컷 구성 (선택사항)</h3>
                                            <p className="text-xs text-slate-500 mb-4">비워두시면 AI가 자동으로 생성합니다.</p>
                                            
                                            <div className="space-y-3">
                                                {['1컷: 실행 지시/목표 설정', '2컷: AX 솔루션 작동', '3컷: 결과 활용', '4컷: 성과 확인/학습'].map((label, idx) => (
                                                    <div key={idx}>
                                                        <label className="text-xs font-medium text-slate-600 mb-1 block">{label}</label>
                                                        <textarea
                                                            name={`cut${idx + 1}`}
                                                            value={(formData as any)[`cut${idx + 1}`]}
                                                            onChange={handleInputChange}
                                                            className="w-full h-16 rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                                                            placeholder={`${idx + 1}컷 내용을 입력하세요`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full h-12 mt-4 font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />
                                                    시나리오 생성 중...
                                                </>
                                            ) : (
                                                <>
                                                    <SparklesIcon className="w-5 h-5 mr-2" />
                                                    시나리오 생성하기
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="lg:col-span-8">
                             {isLoading && (
                                <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-indigo-200 p-14 text-center animate-pulse h-full flex flex-col items-center justify-center min-h-[400px]">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6">
                                        <SparklesIcon className="w-8 h-8 text-indigo-500" />
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-800 mb-2">최적의 시나리오를 설계하고 있습니다</h3>
                                    <p className="text-slate-500">잠시만 기다려주세요...</p>
                                </div>
                            )}

                            {!isLoading && !scenario && (
                                <div className="bg-white/50 backdrop-blur-sm rounded-2xl border-dashed border-2 border-indigo-200 p-14 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
                                        <FileTextIcon className="w-8 h-8 text-indigo-300" />
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-800 mb-2">시나리오를 생성해보세요</h3>
                                    <p className="text-slate-500">왼쪽 폼에 내용을 입력하고 생성 버튼을 눌러주세요</p>
                                </div>
                            )}

                            {scenario && (
                                <div className="animate-fade-in-right">
                                    <ScenarioCard ref={cardRef} data={scenario} onDownload={handleDownload} />
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ScenarioApp;