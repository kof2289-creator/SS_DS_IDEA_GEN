import React from 'react';
import type { FormData } from '../types.ts';
import { FileTextIcon, SparklesIcon, Loader2Icon, ZapIcon, RotateCcwIcon } from './icons.tsx';

interface InputFormProps {
  formData: FormData;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onLoadExample: () => void;
  onReset: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ 
    formData, 
    isLoading, 
    onChange, 
    onSubmit, 
    onLoadExample, 
    onReset 
}) => {
  const isFormEmpty = !formData.businessArea && !formData.painPoints && !formData.expectations;
  const isFormFilled = formData.businessArea && formData.painPoints && formData.expectations;

  return (
    <div className="bg-white/70 backdrop-blur-md shadow-xl shadow-blue-900/5 rounded-2xl overflow-hidden border border-blue-100 animate-fade-in-left sticky top-6">
      <div className="p-6 md:p-8">
        {/* Form Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <FileTextIcon className="w-5 h-5 text-white" />
            </div>
            <div>
                <h2 className="font-semibold text-lg text-slate-800">정보 입력</h2>
                <p className="text-xs text-slate-500">AX 아이디어 생성을 위한 정보</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
                onClick={onLoadExample}
                disabled={isLoading}
                className="inline-flex items-center justify-center whitespace-nowrap text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-blue-50 hover:text-blue-700 h-8 rounded-lg px-3 text-blue-600"
            >
                <ZapIcon className="w-3.5 h-3.5 mr-1" />
                예시 불러오기
            </button>
            <button
                onClick={onReset}
                disabled={isLoading || isFormEmpty}
                className="inline-flex items-center justify-center whitespace-nowrap text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100 hover:text-slate-900 h-8 rounded-lg px-3 text-slate-500"
            >
                <RotateCcwIcon className="w-3.5 h-3.5 mr-1" />
                초기화
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                업무 정보 입력
            </h3>

            <div className="space-y-5">
                {/* Business Area */}
                <div className="space-y-2">
                    <label htmlFor="businessArea" className="text-sm font-medium text-slate-700">
                        업무 영역
                    </label>
                    <input
                        type="text"
                        name="businessArea"
                        id="businessArea"
                        value={formData.businessArea}
                        onChange={onChange}
                        className="flex h-11 w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/20 focus-visible:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                        placeholder="예: 생산계획, 품질관리, 설비점검, 물류 운영 등"
                        required
                        disabled={isLoading}
                    />
                </div>

                {/* Pain Points */}
                <div className="space-y-2">
                    <label htmlFor="painPoints" className="text-sm font-medium text-slate-700">
                        현행 업무 고충 및 한계점
                    </label>
                    <textarea
                        name="painPoints"
                        id="painPoints"
                        rows={3}
                        value={formData.painPoints}
                        onChange={onChange}
                        className="flex min-h-[100px] w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/20 focus-visible:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-200 leading-relaxed"
                        placeholder="예: 데이터 수집 수작업, 시스템 간 연결 미흡, 재작업 발생 등"
                        required
                        disabled={isLoading}
                    />
                </div>

                {/* Expectations */}
                <div className="space-y-2">
                    <label htmlFor="expectations" className="text-sm font-medium text-slate-700">
                        AX 도입을 통한 기대 사항
                    </label>
                    <textarea
                        name="expectations"
                        id="expectations"
                        rows={3}
                        value={formData.expectations}
                        onChange={onChange}
                        className="flex min-h-[100px] w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/20 focus-visible:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-200 leading-relaxed"
                        placeholder="예: 업무 효율화, 오류 감소, 자동화, 실시간 모니터링 등"
                        required
                        disabled={isLoading}
                    />
                </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-5 border-t border-blue-100">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                아이디어 생성
            </h3>
            
            <button
                type="submit"
                disabled={isLoading || !isFormFilled}
                className="inline-flex items-center justify-center whitespace-nowrap text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full h-12 font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] transition-all duration-200 disabled:shadow-none"
            >
                {isLoading ? (
                  <>
                    <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                    아이디어 생성 중...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="mr-2 h-5 w-5" />
                    아이디어 생성
                  </>
                )}
            </button>
            <p className="text-xs text-slate-500 text-center mt-3">
                AI가 3가지 유형의 AX 솔루션 아이디어를 생성합니다
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};