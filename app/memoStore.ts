import type { Block, Category, MemoLabel } from "./memos";

// 메모는 Supabase에 저장된다(memoDb.ts). 여기에는 쓰다 만 글만 이 브라우저에 임시로 남긴다.
const DRAFT_KEY = "memo:draft";

export type Draft = {
  title: string;
  category: Category;
  label: MemoLabel;
  body: Block[];
};

export function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    return value && typeof value === "object" ? (value as Draft) : null;
  } catch {
    return null;
  }
}

export function saveDraft(draft: Draft): boolean {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // 지우지 못해도 다음 저장 때 덮어쓴다.
  }
}
