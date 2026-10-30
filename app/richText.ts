import type { Block, Inline } from "./memos";

// 작성 화면의 편집 영역(HTML)과 저장용 Block 목록을 서로 바꾼다.

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const inlineHtml = (parts: Inline[]) =>
  parts
    .map((part) =>
      typeof part === "string"
        ? escapeHtml(part)
        : `<b>${escapeHtml(part.bold)}</b>`,
    )
    .join("");

export function blocksToHtml(blocks: Block[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "h2":
          return `<h2>${escapeHtml(block.text)}</h2>`;
        case "h3":
          return `<h3>${escapeHtml(block.text)}</h3>`;
        case "p":
          return block.lines
            .map((line) => `<div>${inlineHtml(line)}</div>`)
            .join("");
        case "list":
          return `<ul>${block.items
            .map((item) => `<li>${inlineHtml(item)}</li>`)
            .join("")}</ul>`;
      }
    })
    .join("");
}

const BLOCK_CHILD = /^(H[1-3]|UL|OL|DIV|P)$/;
const clean = (text: string) => text.replace(/ /g, " ");

export function htmlToBlocks(root: HTMLElement): Block[] {
  const blocks: Block[] = [];
  let lines: Inline[][] = [];
  let current: Inline[] = [];

  const addText = (text: string, bold: boolean) => {
    if (!text) return;
    const last = current[current.length - 1];
    if (bold) {
      if (last && typeof last !== "string") last.bold += text;
      else current.push({ bold: text });
    } else if (typeof last === "string") {
      current[current.length - 1] = last + text;
    } else {
      current.push(text);
    }
  };

  const endLine = () => {
    if (current.length) lines.push(current);
    current = [];
  };

  const endParagraph = () => {
    endLine();
    if (lines.length) blocks.push({ type: "p", lines });
    lines = [];
  };

  const isBold = (el: HTMLElement) =>
    el.tagName === "B" ||
    el.tagName === "STRONG" ||
    el.style.fontWeight === "bold" ||
    Number.parseInt(el.style.fontWeight, 10) >= 600;

  const inline = (node: Node, bold: boolean) => {
    if (node.nodeType === Node.TEXT_NODE) {
      addText(clean(node.textContent ?? ""), bold);
    } else if (node instanceof HTMLElement) {
      if (node.tagName === "BR") endLine();
      else node.childNodes.forEach((child) => inline(child, bold || isBold(node)));
    }
  };

  const textOf = (el: HTMLElement) => clean(el.textContent ?? "").trim();

  const inlineOf = (el: HTMLElement): Inline[] => {
    const savedLines = lines;
    const savedCurrent = current;
    lines = [];
    current = [];
    inline(el, false);
    endLine();
    const result = lines.flat();
    lines = savedLines;
    current = savedCurrent;
    return result;
  };

  const visit = (node: Node) => {
    if (!(node instanceof HTMLElement)) {
      inline(node, false);
      return;
    }
    switch (node.tagName) {
      case "H1":
      case "H2":
      case "H3": {
        endParagraph();
        const text = textOf(node);
        if (text) blocks.push({ type: node.tagName === "H3" ? "h3" : "h2", text });
        return;
      }
      case "UL":
      case "OL": {
        endParagraph();
        const items = Array.from(node.children)
          .map((li) => inlineOf(li as HTMLElement))
          .filter((item) => item.length > 0);
        if (items.length) blocks.push({ type: "list", items });
        return;
      }
      case "DIV":
      case "P": {
        if (Array.from(node.children).some((c) => BLOCK_CHILD.test(c.tagName))) {
          endParagraph();
          node.childNodes.forEach(visit);
          endParagraph();
        } else if (!textOf(node)) {
          endParagraph();
        } else {
          node.childNodes.forEach((child) => inline(child, false));
          endLine();
        }
        return;
      }
      default:
        inline(node, false);
    }
  };

  root.childNodes.forEach(visit);
  endParagraph();
  return blocks;
}
