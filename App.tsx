import React, { useState, useRef, useCallback } from 'react';
import type { FormData, IdeaCardData } from './types.ts';
import { InputForm } from './components/InputForm.tsx';
import { IdeaCard } from './components/IdeaCard.tsx';
import { generateIdea } from './services/geminiService.ts';
import { LightbulbIcon, RefreshIcon } from './components/icons.tsx';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    businessArea: '',
    painPoints: '',
    expectations: '',
  });
  const [ideaCardData, setIdeaCardData] = useState<IdeaCardData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessArea || !formData.painPoints || !formData.expectations) {
      setError("모든 필드를 채워주세요.");
      return;
    }
    setIsLoading(true);
    setError(null);
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
      setError('아이디어 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setIdeaCardData(null);
    setFormData({
      businessArea: '',
      painPoints: '',
      expectations: '',
    });
    setError(null);
    cardRefs.current = [];
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
      link.download = `ax-idea-card-${category}-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('이미지 다운로드 실패:', err);
      setError('이미지 다운로드에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC]">
      {/* Fancy Background Elements - Updated to Blue Tones */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[100px] animate-float" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] bg-sky-200/40 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s', animationDuration: '10s' }}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[100px] animate-float" style={{ animationDelay: '4s', animationDuration: '12s' }}></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Header Section - Updated Branding & Removed Icon */}
        <header className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-center print:hidden">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 mb-6 tracking-tight drop-shadow-sm">
              삼성전자DS AX 과제 아이디어 생성기
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              업무 프로세스에 적용할 <span className="text-blue-600 font-bold">AI Transformation</span> 솔루션 아이디어를 생성해보세요
            </p>
        </header>

        {/* Main Content */}
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            
            {/* Left: Form - Sticky on large screens */}
            <div className="lg:col-span-2 print:hidden lg:sticky lg:top-8 h-fit">
                <InputForm
                formData={formData}
                isLoading={isLoading}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                />
            </div>

            {/* Right: Results */}
            <div className="lg:col-span-3 flex flex-col gap-8">
                {/* Header for Results - Render only when data exists to keep alignment in initial state */}
                {ideaCardData && (
                    <div className="flex justify-between items-end print:hidden animate-fade-in-up">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100/80 flex items-center justify-center backdrop-blur-sm">
                                <LightbulbIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-800 text-lg">생성된 아이디어</h2>
                                <p className="text-sm text-slate-500 font-medium">3개의 맞춤형 솔루션</p>
                            </div>
                        </div>
                    
                        <button
                            onClick={handleReset}
                            className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200/60 text-sm font-semibold rounded-full shadow-sm text-slate-600 bg-white/80 backdrop-blur-sm hover:bg-white hover:text-slate-900 hover:shadow-md transition-all duration-300"
                        >
                            <RefreshIcon className="h-4 w-4"/>
                            다시 시작
                        </button>
                    </div>
                )}

                <div className="relative min-h-[400px]">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-xl z-20 animate-fade-in-up">
                        <div className="w-20 h-20 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center mb-6">
                            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin-slow"></div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">AI가 분석 중입니다</h3>
                        <p className="text-slate-500 font-medium">최적의 AX 솔루션을 설계하고 있어요...</p>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-50/90 backdrop-blur-sm border border-red-100 rounded-2xl p-8 text-center shadow-lg max-w-md">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <h3 className="text-lg font-bold text-red-800 mb-2">오류가 발생했습니다</h3>
                            <p className="text-red-600 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {!ideaCardData && !isLoading && !error && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-blue-200/50 rounded-3xl bg-white/30 backdrop-blur-sm opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-white shadow-inner flex items-center justify-center mb-6">
                            <LightbulbIcon className="w-10 h-10 text-blue-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">아이디어가 이곳에 나타납니다</h3>
                        <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                            왼쪽 양식에 업무 내용을 입력하고<br/>
                            <span className="font-semibold text-blue-600">아이디어 생성</span> 버튼을 눌러주세요.
                        </p>
                    </div>
                )}

                {ideaCardData && (
                    <div id="printable-cards" className="space-y-8">
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
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;