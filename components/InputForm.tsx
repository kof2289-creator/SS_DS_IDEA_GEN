import React from 'react';
import type { FormData } from '../types.ts';
import { SparklesIcon } from './icons.tsx';

interface InputFormProps {
  formData: FormData;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ formData, isLoading, onChange, onSubmit }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 animate-fade-in-up transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]" style={{ animationDelay: '0.2s' }}>
      
      {/* Form Header */}
      <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shadow-inner">
            <SparklesIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
            <h2 className="font-bold text-slate-800 text-xl tracking-tight">정보 입력</h2>
            <p className="text-sm text-slate-500 font-medium">AI 분석을 위한 기초 데이터</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-7">
        {/* Business Area */}
        <div className="space-y-2 group">
          <label htmlFor="businessArea" className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform"></span>
            업무 영역
          </label>
          <input
            type="text"
            name="businessArea"
            id="businessArea"
            value={formData.businessArea}
            onChange={onChange}
            className="block w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all duration-300 placeholder-slate-400 font-medium text-slate-800"
            placeholder="예: 생산계획, QA, 공정관리 등"
            required
            disabled={isLoading}
          />
        </div>

        {/* Pain Points */}
        <div className="space-y-2 group">
          <label htmlFor="painPoints" className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
            <span className="w-2 h-2 rounded-full bg-sky-500 group-hover:scale-125 transition-transform"></span>
            현행 업무 고충 및 한계점
          </label>
          <textarea
            name="painPoints"
            id="painPoints"
            rows={4}
            value={formData.painPoints}
            onChange={onChange}
            className="block w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 focus:bg-white transition-all duration-300 placeholder-slate-400 resize-none font-medium text-slate-800"
            placeholder="현재 업무에서 겪고 있는 어려움을 구체적으로 작성해주세요."
            required
            disabled={isLoading}
          />
        </div>

        {/* Expectations */}
        <div className="space-y-2 group">
          <label htmlFor="expectations" className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
            <span className="w-2 h-2 rounded-full bg-cyan-500 group-hover:scale-125 transition-transform"></span>
            AX 도입을 통한 기대 사항
          </label>
          <textarea
            name="expectations"
            id="expectations"
            rows={4}
            value={formData.expectations}
            onChange={onChange}
            className="block w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 focus:bg-white transition-all duration-300 placeholder-slate-400 resize-none font-medium text-slate-800"
            placeholder="AI 기술 도입으로 무엇이 개선되기를 기대하는지 작성해주세요."
            required
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || !formData.businessArea || !formData.painPoints || !formData.expectations}
            className="group relative w-full h-14 flex justify-center items-center gap-2.5 text-base font-bold text-white rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_10px_20px_rgb(37,99,235,0.3)] hover:shadow-[0_15px_30px_rgb(37,99,235,0.4)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed overflow-hidden"
          >
            {/* Button Shine Effect */}
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
            
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>솔루션 설계 중...</span>
              </>
            ) : (
               <>
                <SparklesIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300"/>
                <span>아이디어 생성하기</span>
               </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};