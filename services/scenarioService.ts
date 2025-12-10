// services/scenarioService.ts
import type { ScenarioFormData, ScenarioData } from "../types";

const WORKER_BASE_URL = "https://ssds-seed.kof2289.workers.dev"; // 기존 거 재사용

export const generateScenario = async (
  formData: ScenarioFormData
): Promise<ScenarioData> => {
  const response = await fetch(`${WORKER_BASE_URL}/scenario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("시나리오 생성 API 호출에 실패했습니다.");
  }

  const data = await response.json();
  // worker에서 parsed.scenario만 반환하므로 data는 ScenarioData 형태
  return data as ScenarioData;
};
