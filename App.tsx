import React, { useState, useRef, useCallback } from 'react';
import type { FormData, IdeaCardData } from './types.ts';
import { InputForm } from './components/InputForm.tsx';
import { IdeaCard } from './components/IdeaCard.tsx';
import { generateIdea } from './services/geminiService.ts';
import { DownloadIcon, SparklesIcon, RefreshIcon } from './components/icons.tsx';

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
      // Ensure we get 3 cards, or handle gracefully if not.
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
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <header className="bg-white border-b border-slate-200 print:hidden">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3">
                <SparklesIcon className="h-8 w-8 text-indigo-600"/>
                <h1 className="text-2xl font-bold text-slate-900">SS_DS AX 과제 아이디어 생성기</h1>
            </div>
            <p className="text-slate-500 mt-1">업무 프로세스에 적용할 AI Transformation 솔루션 아이디어를 생성해보세요</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          <div className="print:hidden">
            <InputForm
              formData={formData}
              isLoading={isLoading}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
            />
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="flex justify-between items-center mb-4 print:hidden">
              <h2 className="text-xl font-semibold text-slate-900">생성된 아이디어 카드</h2>
              {ideaCardData && (
                 <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <RefreshIcon className="h-5 w-5"/>
                    새로 작성
                  </button>
              )}
            </div>
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10 min-h-[24rem] print:hidden">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="mt-4 font-semibold text-indigo-700">AI가 3가지 유형의 아이디어를 생성 중입니다...</p>
                </div>
              )}
               {error && (
                <div className="absolute inset-0 bg-red-50 border border-red-200 flex flex-col items-center justify-center rounded-lg p-4 z-10 min-h-[24rem] print:hidden">
                   <p className="font-semibold text-red-700 text-center">{error}</p>
                </div>
              )}
              {!ideaCardData && !isLoading && !error && (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg h-96 flex flex-col items-center justify-center text-center p-4 print:hidden">
                      <SparklesIcon className="h-12 w-12 text-slate-400 mb-2"/>
                      <p className="font-semibold text-slate-600">3가지 유형의 아이디어가 여기에 표시됩니다.</p>
                      <p className="text-sm text-slate-500">위 양식을 작성하고 '아이디어 생성' 버튼을 클릭하세요.</p>
                  </div>
              )}

              {ideaCardData && (
                <div id="printable-cards" className="space-y-8">
                  {ideaCardData.map((data, index) => (
                     <div key={index} className="printable-card-page">
                        <IdeaCard 
                          ref={el => {
                            if (cardRefs.current) {
                                cardRefs.current[index] = el;
                            }
                           }} 
                          data={data} 
                        />
                        <div className="mt-4 flex justify-end print:hidden">
                          <button
                            onClick={() => handleDownloadImage(index)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                          >
                            <DownloadIcon className="h-5 w-5"/>
                            PNG로 저장
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;