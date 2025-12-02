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
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-slate-200">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="businessArea" className="block text-sm font-medium text-slate-700">
            업무 영역
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="businessArea"
              id="businessArea"
              value={formData.businessArea}
              onChange={onChange}
              className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="현재 맡고 있는 업무 영역을 작성해주세요"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="painPoints" className="block text-sm font-medium text-slate-700">
            현행 업무 고충 및 한계점
          </label>
          <div className="mt-1">
            <textarea
              name="painPoints"
              id="painPoints"
              rows={4}
              value={formData.painPoints}
              onChange={onChange}
              className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="현재 업무에서 겪고 있는 어려움을 구체적으로 작성해주세요."
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="expectations" className="block text-sm font-medium text-slate-700">
            AX 도입을 통한 기대 사항
          </label>
          <div className="mt-1">
            <textarea
              name="expectations"
              id="expectations"
              rows={4}
              value={formData.expectations}
              onChange={onChange}
              className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="AI 기술 도입으로 무엇이 개선되기를 기대하는지 작성해주세요."
              required
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                생성 중...
              </>
            ) : (
               <>
                <SparklesIcon className="h-5 w-5"/>
                아이디어 생성
               </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};