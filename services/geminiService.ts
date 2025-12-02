import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, IdeaCardData } from '../types.ts';

// API Key is securely loaded from environment variables (process.env.API_KEY)
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cardSchema = {
  type: Type.OBJECT,
  properties: {
    solutionTitle: { type: Type.STRING, description: "솔루션에 대한 짧고 눈길을 끄는 제목. 예: 'AI 기반 실시간 품질 이상 감지 시스템'" },
    process: { type: Type.STRING, description: "이 솔루션이 적용될 간단한 업무 프로세스. 예: '데이터 입력 > AI 분석 > 결과 검토'"},
    category: { type: Type.STRING, enum: ['Assistant', 'Advisor', 'Agent'], description: "솔루션의 역할 유형: Assistant, Advisor, 또는 Agent 중 하나." },
    solutionOverview: { type: Type.STRING, description: "AX 솔루션 아이디어에 대한 간결한 1-3문장 요약." },
    humanRole: { type: Type.STRING, description: "이 새로운 프로세스에서 사람의 역할에 대한 간결한 설명. 예: 'AI가 감지한 이상 징후 검토 및 조치 승인'" },
    expectedEffects: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5가지 주요 이점 목록. 짧은 구(2-4 단어)여야 합니다. 예: '품질 일관성 향상', '오류 감소', '업무 신속성 향상'"
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5개의 관련 키워드 목록. 짧은 구여야 합니다. 예: '예측 분석', '실시간 모니터링', '의사결정 지원'"
    },
    technologies: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5개의 관련 기술 목록. 예: '머신러닝 기반 예측 모델', '데이터 마이닝', '시뮬레이션'"
    },
  },
  required: ['solutionTitle', 'process', 'category', 'solutionOverview', 'humanRole', 'expectedEffects', 'keywords', 'technologies']
};

const schema = {
  type: Type.ARRAY,
  items: cardSchema,
  description: "Assistant, Advisor, Agent 역할에 대한 3개의 고유한 아이디어 카드 객체 배열. 각 객체는 cardSchema를 따라야 합니다."
};


export const generateIdea = async (formData: FormData): Promise<IdeaCardData[]> => {
  const model = 'gemini-2.5-flash';

  const systemInstruction = `당신은 바이오의약품 CDMO 산업, 특히 GMP(우수 의약품 제조 및 품질 관리 기준) 및 QA/QC(품질 보증/품질 관리) 프로세스에 대한 깊은 지식을 갖춘 전문 AI 전환(AX) 컨설턴트입니다. 당신의 임무는 사용자의 입력을 기반으로 세 가지 뚜렷한 AI 솔루션 아이디어를 생성하는 것입니다. 각 아이디어는 다음 역할 중 하나에 해당해야 합니다:
- Assistant: 업무 생산성 향상에 중점을 둔 업무 수행 보조.
- Advisor: 업무 지식을 기반으로 한 분석 및 의사결정 자문.
- Agent: 목표 지향적인 자율적 의사결정 및 실행.
응답은 반드시 3개의 아이디어 객체를 포함하는 JSON 배열이어야 합니다. 제공된 스키마를 엄격히 준수하고 모든 텍스트는 한국어로 작성해야 합니다.`;
  
  const prompt = `
    다음 사용자 정보를 기반으로 AX 과제 아이디어 카드 3개를 생성해 주세요. 각 카드는 Assistant, Advisor, Agent 역할에 대해 하나씩 만들어야 합니다.

    - 업무 영역: ${formData.businessArea}
    - 현행 업무 고충 및 한계점: ${formData.painPoints}
    - AX 도입을 통한 기대 사항: ${formData.expectations}
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 0.7,
    },
  });

  const jsonText = response.text.trim();
  
  try {
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as IdeaCardData[];
  } catch (error) {
    console.error("Failed to parse Gemini response:", jsonText);
    throw new Error("AI 응답이 유효한 JSON 형식이 아닙니다.");
  }
};