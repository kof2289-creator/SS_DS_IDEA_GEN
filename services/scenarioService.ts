// services/scenarioService.ts

import type { ScenarioFormData, ScenarioData, ScenarioCut } from "../types.ts";

const WORKER_BASE_URL = "https://ssds-seed.kof2289.workers.dev";

// ✅ 시나리오 텍스트 생성: /scenario 호출
export const generateScenario = async (
  formData: ScenarioFormData
): Promise<ScenarioData> => {
  const response = await fetch(`${WORKER_BASE_URL}/scenario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error("Scenario API Error:", response.status, text);
    throw new Error("시나리오 생성 API 호출에 실패했습니다.");
  }

  const data = await response.json();
  return data as ScenarioData;
};

// ✅ 시나리오 컷 이미지 생성: /scenario-image 호출
export const generateScenarioImage = async (
  cut: ScenarioCut,
  isFallback = false
): Promise<string> => {
  const response = await fetch(`${WORKER_BASE_URL}/scenario-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cut, isFallback }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error("Scenario Image API Error:", response.status, text);
    throw new Error("시나리오 이미지 생성 API 호출에 실패했습니다.");
  }

  const data = await response.json();

  if (!data?.imageDataUrl) {
    throw new Error("이미지 데이터가 응답에 없습니다.");
  }

  return data.imageDataUrl as string;
};