import React, { forwardRef } from 'react';
import type { IdeaCardData } from '../types.ts';

interface IdeaCardProps {
  data: IdeaCardData | null;
}

interface PillProps {
    children: React.ReactNode;
}

const Pill: React.FC<PillProps> = ({ children }) => (
    <span className="pill inline-block bg-white border border-slate-300 rounded-full px-3 py-1 text-sm font-medium text-slate-700">
        {children}
    </span>
);

export const IdeaCard = forwardRef<HTMLDivElement, IdeaCardProps>(({ data }, ref) => {
  if (!data) {
    return null;
  }

  return (
    <div ref={ref} className="idea-card-component bg-white p-6 sm:p-8 border border-slate-300 rounded-lg shadow-md font-sans flex flex-col">
      <div>
        <div className="flex justify-between items-start gap-4">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {data.solutionTitle}
            </h2>
            <span className="category-badge inline-block border border-slate-400 rounded-full px-3 py-0.5 text-base font-medium text-slate-600 whitespace-nowrap flex-shrink-0 mt-1">
                {data.category}
            </span>
        </div>
        <p className="process-text mt-2 text-base text-slate-600 font-bold break-words">{data.process}</p>
      </div>

      <hr className="my-4 border-slate-200" />

      <div className="space-y-4 flex flex-col">
        <Section title="AX 솔루션 아이디어 개요">
          <p className="text-slate-600">{data.solutionOverview}</p>
        </Section>
        <Section title="사람의 역할">
          <p className="text-slate-600">{data.humanRole}</p>
        </Section>
        <Section title="기대효과" isPillSection={true}>
            {data.expectedEffects.map((item, i) => <Pill key={`effect-${i}`}>{item}</Pill>)}
        </Section>
        <Section title="키워드" isPillSection={true}>
            {data.keywords.map((item, i) => <Pill key={`keyword-${i}`}>{item}</Pill>)}
        </Section>
        <Section title="기술" isPillSection={true}>
            {data.technologies.map((item, i) => <Pill key={`tech-${i}`}>{item}</Pill>)}
        </Section>
      </div>
    </div>
  );
});

interface SectionProps {
    title: string;
    children: React.ReactNode;
    isPillSection?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, children, isPillSection = false }) => {
    return (
        <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">{title}</h3>
            {isPillSection ? (
                <div className="pill-container flex flex-wrap gap-2">{children}</div>
            ) : (
                children
            )}
        </div>
    );
};