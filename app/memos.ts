export type MemoLabel = "blue" | "green" | "orange" | "pink";
export type Category = "업무" | "개인" | "아이디어";

/** 글자 조각. 문자열은 보통 글씨, { bold }는 굵은 글씨 */
export type Inline = string | { bold: string };

export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; lines: Inline[][] }
  | { type: "list"; items: Inline[][] };

/** 화면에 보여줄 메모. 날짜 글자는 저장된 시각에서 계산해 채운다. */
export type Memo = {
  id: string;
  title: string;
  preview: string;
  date: string;
  label: MemoLabel;
  category: Category;
  pinned: boolean;
  body: Block[];
  createdText: string;
  footer: string;
  /** 만든 시각(ms). 정렬에 쓴다. */
  createdAt: number;
  /** 전체 보기에서 묶는 날짜 이름 */
  section: Section;
};

export type Section = "오늘" | "어제" | "이번 주" | "이전";

export const TODAY_TEXT = "10월 30일 금요일";
export const CATEGORIES: Category[] = ["업무", "개인", "아이디어"];
export const LABELS: MemoLabel[] = ["blue", "green", "orange", "pink"];

const inlineText = (inline: Inline) =>
  typeof inline === "string" ? inline : inline.bold;

export const joinInline = (parts: Inline[]) =>
  parts.map(inlineText).join("");

/** 본문 글자만 이어 붙인다. 글자 수를 세거나 미리보기를 만들 때 쓴다. */
export function blocksText(body: Block[], separator = ""): string {
  return body
    .map((block) => {
      if (block.type === "list") return block.items.map(joinInline).join(separator);
      if (block.type === "p") return block.lines.map(joinInline).join(separator);
      return block.text;
    })
    .join(separator);
}
