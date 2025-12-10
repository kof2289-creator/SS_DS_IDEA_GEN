// services/geminiService.ts

import type { FormData, IdeaCardData } from "../types.ts";

const WORKER_BASE_URL = "https://ssds-seed.kof2289.workers.dev";

export const generateIdea = async (
  formData: FormData
): Promise<IdeaCardData[]> => {
  const response = await fetch(`${WORKER_BASE_URL}/idea`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
 
  if (!response.ok) {
    const text = await response.text();
    console.error("Worker error:", text);
    throw new Error("아이디어 생성 API 호출에 실패했습니다.");
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    console.error("Unexpected AI response (not an array):", data);
    throw new Error("AI 응답이 카드 배열 형식이 아닙니다.");
  }

  return data as IdeaCardData[]; 
};