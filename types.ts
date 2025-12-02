export interface FormData {
  businessArea: string;
  painPoints: string;
  expectations: string;
}

export interface IdeaCardData {
  solutionTitle: string;
  process: string;
  category: 'Assistant' | 'Advisor' | 'Agent';
  solutionOverview: string;
  humanRole: string;
  expectedEffects: string[];
  keywords: string[];
  technologies: string[];
}