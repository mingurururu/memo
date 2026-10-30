import {
  blocksText,
  CATEGORIES,
  LABELS,
  type Block,
  type Category,
  type Memo,
  type MemoLabel,
  type Section,
} from "./memos";
import { supabase } from "./supabase";

// Supabase `memos` 표의 한 행
type MemoRow = {
  id: string;
  title: string;
  body: Block[];
  category: Category;
  label: MemoLabel;
  pinned: boolean;
  created_at: string;
  updated_at: string;
};

export type NewMemo = {
  title: string;
  body: Block[];
  category: Category;
  label: MemoLabel;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// 날짜 글자는 서버 시간대와 상관없이 한국 시간 기준으로 만든다.
const KST_OFFSET = 9 * 60 * 60 * 1000;
const DAY = 24 * 60 * 60 * 1000;
const kst = (date: Date) => new Date(date.getTime() + KST_OFFSET);
const dayNumber = (date: Date) => Math.floor(kst(date).getTime() / DAY);

function timeText(date: Date): string {
  const k = kst(date);
  const h = k.getUTCHours();
  const m = String(k.getUTCMinutes()).padStart(2, "0");
  return `${h < 12 ? "오전" : "오후"} ${h % 12 || 12}:${m}`;
}

function monthDay(date: Date): string {
  const k = kst(date);
  return `${k.getUTCMonth() + 1}월 ${k.getUTCDate()}일`;
}

function dateLabel(date: Date, now: Date): string {
  const diff = dayNumber(now) - dayNumber(date);
  if (diff === 0) return "오늘";
  if (diff === 1) return "어제";
  return monthDay(date);
}

// 전체 보기에서 날짜별로 묶는 이름. 한 주는 월요일에 시작한다.
function sectionOf(date: Date, now: Date): Section {
  const today = dayNumber(now);
  const day = dayNumber(date);
  if (day === today) return "오늘";
  if (day === today - 1) return "어제";
  // 1970-01-01은 목요일이라 (일 수 + 3) % 7이 월요일 0 기준 요일이다.
  const weekStart = today - ((today + 3) % 7);
  return day >= weekStart ? "이번 주" : "이전";
}

// 미리보기는 제목 줄을 빼고 본문 글자부터 보여준다. 본문이 없으면 제목 줄을 쓴다.
function previewOf(body: Block[]): string {
  const text = body.filter((b) => b.type === "p" || b.type === "list");
  return blocksText(text.length ? text : body, " ");
}

function rowToMemo(row: MemoRow, now: Date): Memo {
  const created = new Date(row.created_at);
  const updated = new Date(row.updated_at);
  const count = blocksText(row.body).replace(/\s/g, "").length;
  return {
    id: row.id,
    title: row.title,
    preview: previewOf(row.body),
    date: dateLabel(created, now),
    label: row.label,
    category: row.category,
    pinned: row.pinned,
    body: row.body,
    createdText: `${monthDay(created)} ${timeText(created)}`,
    footer: `${count}자 · ${dateLabel(updated, now)} ${timeText(updated)} 수정`,
    createdAt: created.getTime(),
    section: sectionOf(created, now),
  };
}

/** 모든 메모. 새로 쓴 순서. */
export async function fetchMemos(): Promise<Memo[]> {
  const { data, error } = await supabase()
    .from("memos")
    .select("*")
    .order("created_at", { ascending: false })
    .overrideTypes<MemoRow[], { merge: false }>();
  if (error) throw new Error(`메모를 불러오지 못했어요: ${error.message}`);
  const now = new Date();
  return data.map((row) => rowToMemo(row, now));
}

/** 메모 하나. 없으면 null. */
export async function fetchMemo(id: string): Promise<Memo | null> {
  if (!UUID.test(id)) return null;
  const { data, error } = await supabase()
    .from("memos")
    .select("*")
    .eq("id", id)
    .maybeSingle<MemoRow>();
  if (error) throw new Error(`메모를 불러오지 못했어요: ${error.message}`);
  return data ? rowToMemo(data, new Date()) : null;
}

/** 저장하기 전에 값을 확인하고, 다듬은 값을 돌려준다. 올바르지 않으면 오류를 던진다. */
function checked(memo: NewMemo): NewMemo {
  const title = memo.title.trim();
  if (!title) throw new Error("제목을 입력해 주세요.");
  if (!CATEGORIES.includes(memo.category)) throw new Error("분류가 올바르지 않아요.");
  if (!LABELS.includes(memo.label)) throw new Error("색이 올바르지 않아요.");
  if (!Array.isArray(memo.body)) throw new Error("본문이 올바르지 않아요.");
  return { ...memo, title };
}

/** 새 메모를 저장한다. 값이 올바르지 않으면 오류를 던진다. */
export async function createMemo(memo: NewMemo): Promise<string> {
  const { data, error } = await supabase()
    .from("memos")
    .insert(checked(memo))
    .select("id")
    .single<{ id: string }>();
  if (error) throw new Error(`저장하지 못했어요: ${error.message}`);
  return data.id;
}

/** 메모를 고정하거나 고정을 푼다. 수정한 시각은 바뀌지 않는다. */
export async function setMemoPinned(id: string, pinned: boolean): Promise<void> {
  if (!UUID.test(id)) throw new Error("메모를 찾을 수 없어요.");
  const { data, error } = await supabase()
    .from("memos")
    .update({ pinned })
    .eq("id", id)
    .select("id")
    .maybeSingle<{ id: string }>();
  if (error) throw new Error(`바꾸지 못했어요: ${error.message}`);
  if (!data) throw new Error("메모를 찾을 수 없어요. 이미 지워졌을 수 있어요.");
}

/** 메모를 지운다. 되돌릴 수 없다. */
export async function deleteMemo(id: string): Promise<void> {
  if (!UUID.test(id)) throw new Error("메모를 찾을 수 없어요.");
  const { data, error } = await supabase()
    .from("memos")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle<{ id: string }>();
  if (error) throw new Error(`지우지 못했어요: ${error.message}`);
  if (!data) throw new Error("메모를 찾을 수 없어요. 이미 지워졌을 수 있어요.");
}

/** 있는 메모의 제목, 본문, 분류, 색을 고치고 수정한 시각을 갱신한다. */
export async function updateMemo(id: string, memo: NewMemo): Promise<void> {
  if (!UUID.test(id)) throw new Error("메모를 찾을 수 없어요.");
  const { data, error } = await supabase()
    .from("memos")
    .update({ ...checked(memo), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")
    .maybeSingle<{ id: string }>();
  if (error) throw new Error(`저장하지 못했어요: ${error.message}`);
  if (!data) throw new Error("메모를 찾을 수 없어요. 이미 지워졌을 수 있어요.");
}
