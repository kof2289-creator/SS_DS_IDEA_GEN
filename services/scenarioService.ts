import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { ScenarioFormData, ScenarioData, ScenarioCut } from "../types.ts";

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY
});

const SCENARIO_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    scenario: {
      type: Type.OBJECT,
      description: "생성된 1가지 활용 시나리오",
      properties: {
        type: {
          type: Type.STRING,
          description: "AI 유형. 'Assistant', 'Advisor', 또는 'Agent' 중 하나여야 합니다.",
        },
        ideaName: {
          type: Type.STRING,
          description: "해당 AI 수준에 맞게 재정의된 AX 솔루션의 이름"
        },
        ideaOverview: {
          type: Type.STRING,
          description: "해당 AI 수준에 맞게 재정의된 AX 솔루션의 구체적인 개요"
        },
        childAgents: {
          type: Type.ARRAY,
          description: "해당 AX 솔루션 구현에 필요한 Child Agent 역할 목록 (Agent 단어 제외)",
          items: { type: Type.STRING },
        },
        cut1: {
          type: Type.OBJECT,
          description: "1컷: 실행 지시/목표 설정",
          properties: {
            sceneName: { type: Type.STRING, description: "컷의 제목" },
            description: { type: Type.STRING, description: "컷의 상세 설명" },
            features: { type: Type.ARRAY, description: "필수 기능 목록", items: { type: Type.STRING } },
          },
          required: ["sceneName", "description", "features"],
        },
        cut2: {
          type: Type.OBJECT,
          description: "2컷: AX 솔루션 작동",
          properties: {
            sceneName: { type: Type.STRING, description: "컷의 제목" },
            description: { type: Type.STRING, description: "컷의 상세 설명" },
            features: { type: Type.ARRAY, description: "필수 기능 목록", items: { type: Type.STRING } },
          },
          required: ["sceneName", "description", "features"],
        },
        cut3: {
          type: Type.OBJECT,
          description: "3컷: 결과 활용",
          properties: {
            sceneName: { type: Type.STRING, description: "컷의 제목" },
            description: { type: Type.STRING, description: "컷의 상세 설명" },
            features: { type: Type.ARRAY, description: "필수 기능 목록", items: { type: Type.STRING } },
          },
          required: ["sceneName", "description", "features"],
        },
        cut4: {
          type: Type.OBJECT,
          description: "4컷: 성과 확인/학습",
          properties: {
            sceneName: { type: Type.STRING, description: "컷의 제목" },
            description: { type: Type.STRING, description: "컷의 상세 설명" },
            features: { type: Type.ARRAY, description: "필수 기능 목록", items: { type: Type.STRING } },
          },
          required: ["sceneName", "description", "features"],
        },
      },
      required: ["type", "ideaName", "ideaOverview", "childAgents", "cut1", "cut2", "cut3", "cut4"],
    },
  },
  required: ["scenario"],
} as const;

function cleanJsonString(text: string): string {
    // Remove Markdown code block syntax if present
    return text.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
}

export const generateScenario = async (formData: ScenarioFormData): Promise<ScenarioData> => {
  const { ideaName, ideaOverview, cut1, cut2, cut3, cut4 } = formData;

  const hasAnyUserCuts = cut1 || cut2 || cut3 || cut4;
  const userCutsSection = hasAnyUserCuts
    ? `
  [사용자 제공 4컷 설명 ]
  cut1: <<<${cut1}>>>
  cut2: <<<${cut2}>>>
  cut3: <<<${cut3}>>>
  cut4: <<<${cut4}>>>
  `.trim()
    : '';

  const prompt = `
  당신은 바이오의약품 CDMO 및 GMP 전문가이자 AI 전략 컨설턴트입니다. 주어진 AI Transformation(AX) 아이디어를 바탕으로, CDMO 오퍼레이션 또는 QA/QC 담당자가 실제 업무에서 즉시 활용할 수 있는 가장 적합하고 창의적인 활용 시나리오 1개만 생성해야 합니다.

  [입력 AX 아이디어]
  - 이름: ${ideaName}
  - 개요: ${ideaOverview}

  ${userCutsSection}

  [중요 규칙]
  1) 출력은 **반드시 유효한 JSON** 한 덩어리여야 하며, 스키마에 맞춰 "scenario" 객체를 채우세요.
  2) "type"은 Assistant/Advisor/Agent 중 **가장 적합한 하나만** 선택해 기재하세요.
  3) "ideaName", "ideaOverview"는 선택한 유형의 특성이 드러나도록 구체화하세요.
  4) "childAgents"는 2~4개 생성하되, 각 항목에서 "Agent" 단어는 제외하세요 (예: GMP 문서 분석, 데이터 무결성 검증, 규제 가이드라인 검색).
  5) 4컷(cut1~cut4)은 단계 의미를 지키되, **사용자가 제공한 description을 ‘소재’로 삼아 내용을 보완·수정하여 작성**하세요.
     - 사용자의 **의도·맥락은 유지**하되, 모호한 표현을 **구체화**하세요(행위자, 시스템, 입력/출력 데이터, GMP 규정, 성공 지표 등).
     - **기술적으로 실행 가능**하고 **데이터 무결성(Data Integrity) 원칙**을 고려하여 단계·데이터 흐름·제약을 명확히 하고, 필요 시 합리적인 세부를 **적절히 추가**하세요.
     - 컷당 **1~3개의 짧은 개조식 문장**으로 작성하고, 과장이나 근거 없는 수치 남발은 금지하세요(필요 시 보수적 범위 제시).
     - 사용자가 남긴 **명령문/프롬프트 문구는 ‘요구사항’으로 해석하여 요약 반영**하세요(그대로 복사/붙여넣기 금지).
     - 사용자가 **비워둔 컷은 처음부터 생성**하세요.
     - 아이디어의 **범위를 벗어나는 새로운 기능·도메인**은 추가하지 마세요.

  6) 각 cut에는 반드시 다음을 포함하세요:
     - sceneName: 단계에 맞는 짧은 제목 (예: 실행 지시/목표 설정, AX 솔루션 작동, 결과 활용, 성과 확인/학습 등과 조합).
     - description: 위 규칙에 따라 **보완·수정된 최종 설명**.
     - features: 3~6개의 한국어 키워드(핵심 기능) 목록(설명과 정합성 유지).
  7) 모든 텍스트는 **한국어**, **간결한 개조식**, **문장 끝 마침표 없음**으로 작성하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: SCENARIO_SCHEMA,
      },
    });

    const cleanedText = cleanJsonString(response.text);
    const parsedResponse = JSON.parse(cleanedText);
    
    if (!parsedResponse?.scenario) {
      throw new Error("AI output missing 'scenario' field");
    }
    return parsedResponse.scenario as ScenarioData;
  } catch (error) {
    console.error("Scenario Generation Error:", error);
    throw new Error("시나리오 생성 중 오류가 발생했습니다.");
  }
};

export const generateScenarioImage = async (cut: ScenarioCut, isFallback = false): Promise<string> => {
    const desc = cut.description;
    const features = cut.features.join(', ');

    let prompt: string;
    if (isFallback) {
        prompt = `A simple, abstract vector icon for a business technology concept. Main ideas: ${features || desc}. Use a minimalist style with a blue and gray color palette on a clean white background. No complex details. IMPORTANT: Any text MUST be in simple English. Do not generate Korean text.`;
    } else {
        prompt = `A minimalist vector illustration for a business/pharmaceutical technology scenario.
Subject: ${desc}
Key concepts to visualize: ${features}
Style guide: Use clean, bold lines on a solid white background. The color palette must be simple, primarily using shades of blue and gray. Represent people and objects with abstract, symbolic icons. Do not include complex details, logos, or shadows. IMPORTANT: If any text is included, it MUST be in simple English (e.g., 'Data', 'AI', 'Report'). Absolutely no Korean text should be generated. The final image should be professional, clear, and symbolic.`;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: { responseModalities: [Modality.IMAGE] },
        });
        
        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (!imagePart?.inlineData?.data) {
            throw new Error('No image bytes returned');
        }
        
        return `data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`;
    } catch (error) {
        console.error("Image Generation Error:", error);
        throw error;
    }
};