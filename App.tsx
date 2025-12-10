import React, { useState, useRef, useCallback } from 'react';
import type { FormData, IdeaCardData } from './types.ts';
import { InputForm } from './components/InputForm.tsx';
import { IdeaCard } from './components/IdeaCard.tsx';
import { generateIdea } from './services/geminiService.ts';
import { LightbulbIcon, RotateCcwIcon, RocketIcon, SparklesIcon } from './components/icons.tsx';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    businessArea: '',
    painPoints: '',
    expectations: '',
  });
  const [ideaCardData, setIdeaCardData] = useState<IdeaCardData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleLoadExample = () => {
    setFormData({
        businessArea: "생산계획 / MPS",
        painPoints: "장비마다 공급사(SEMI eq.)가 달라 인터페이스가 표준화되어 있지 않고, 데이터 수집이 수작업으로 이루어져 시간이 많이 소요됨. 시스템 간 연결이 미흡하여 재작업이 빈번하게 발생함.",
        expectations: "데이터 수집 자동화, 실시간 모니터링 체계 구축, 업무 효율화 및 오류 감소"
    });
  };

  const handleResetInput = () => {
    setFormData({
      businessArea: '',
      painPoints: '',
      expectations: '',
    });
  };

  const handleResetIdeas = () => {
    setIdeaCardData(null);
    cardRefs.current = [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessArea || !formData.painPoints || !formData.expectations) {
      return;
    }
    setIsLoading(true);
    setIdeaCardData(null);
    cardRefs.current = [];

    try {
      const result = await generateIdea(formData);
      if (Array.isArray(result) && result.length > 0) {
        setIdeaCardData(result);
      } else {
         throw new Error("AI did not return the expected card format.");
      }
    } catch (err) {
      console.error(err);
      // In a real app we might show a toast here
      alert('아이디어 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = async (index: number) => {
    const element = cardRefs.current[index];
    if (!element || !(window as any).html2canvas) return;

    try {
      const canvas = await (window as any).html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const data = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const category = ideaCardData?.[index]?.category.toLowerCase() || 'idea';
      link.href = data;
      link.download = `ax-idea-${category}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('이미지 다운로드 실패:', err);
      alert('이미지 다운로드에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Unified Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-sky-50/50 to-indigo-50/30" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(210_100%_50%/0.08)_0%,transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(200_90%_50%/0.06)_0%,transparent_50%)]" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Header Section */}
        <header className="relative">
            <div className="container mx-auto px-4 py-6 md:py-8">
                <div className="max-w-4xl mx-auto text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {/* Icon Badge */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 mb-4 animate-float">
                        <RocketIcon className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 bg-clip-text text-transparent">
                        삼성전자DS AX 과제 아이디어 생성기
                    </h1>
                    
                    {/* Subtitle */}
                    <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto">
                        업무 프로세스에 적용할 AI Transformation 솔루션 아이디어를 생성해보세요
                    </p>
                </div>
            </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 md:py-10 max-w-7xl flex-grow">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Left: Input Form (Approx 42%) */}
            <div className="lg:col-span-5">
                <InputForm
                    formData={formData}
                    isLoading={isLoading}
                    onChange={handleFormChange}
                    onSubmit={handleSubmit}
                    onLoadExample={handleLoadExample}
                    onReset={handleResetInput}
                />
            </div>

            {/* Right: Results (Approx 58%) */}
            <div className="lg:col-span-7 space-y-8 animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
                {/* Results Header */}
                {ideaCardData && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <LightbulbIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-lg text-slate-800">생성된 아이디어</h2>
                                <p className="text-xs text-slate-500">{ideaCardData.length}개의 AX 솔루션 아이디어가 생성되었습니다</p>
                            </div>
                        </div>
                        <button
                            onClick={handleResetIdeas}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100 hover:text-slate-900 h-8 px-3 text-slate-500"
                        >
                            <RotateCcwIcon className="w-3.5 h-3.5 mr-1" />
                            초기화
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!ideaCardData && !isLoading && (
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl border-dashed border-2 border-blue-200 p-10 md:p-14 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-5">
                            <LightbulbIcon className="w-7 h-7 text-blue-400" />
                        </div>
                        <h3 className="text-base font-medium text-slate-800 mb-2">아이디어를 생성해보세요</h3>
                        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                            왼쪽에 업무 영역과 고충점, 기대 사항을 입력하고<br />아이디어 생성 버튼을 클릭하세요
                        </p>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-blue-200 p-10 md:p-14 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-5 animate-pulse">
                            <SparklesIcon className="w-7 h-7 text-blue-500" />
                        </div>
                        <h3 className="text-base font-medium text-slate-800 mb-2">AI가 아이디어를 생성하고 있습니다</h3>
                        <p className="text-sm text-slate-500">잠시만 기다려주세요...</p>
                    </div>
                )}

                {/* Cards */}
                {ideaCardData && (
                    <div id="printable-cards" className="space-y-7">
                    {ideaCardData.map((data, index) => (
                        <div key={index} className="printable-card-page" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                            <IdeaCard 
                            ref={el => {
                                if (cardRefs.current) {
                                    cardRefs.current[index] = el;
                                }
                            }} 
                            data={data}
                            onDownload={() => handleDownloadImage(index)}
                            />
                        </div>
                    ))}
                    </div>
                )}
            </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;