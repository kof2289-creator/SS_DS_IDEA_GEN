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

export interface ScenarioCut {
  sceneName: string;
  description: string;
  features: string[];
}

export interface ScenarioData {
  type: 'Assistant' | 'Advisor' | 'Agent';
  ideaName: string;
  ideaOverview: string;
  childAgents: string[];
  cut1: ScenarioCut;
  cut2: ScenarioCut;
  cut3: ScenarioCut;
  cut4: ScenarioCut;
}

export interface ScenarioFormData {
  ideaName: string;
  ideaOverview: string;
  cut1: string;
  cut2: string;
  cut3: string;
  cut4: string;
}