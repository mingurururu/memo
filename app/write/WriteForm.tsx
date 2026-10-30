"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import Chip from "../Chip";
import IconButton from "../IconButton";
import { CATEGORIES, type Block, type Category, type MemoLabel } from "../memos";
import { clearDraft, loadDraft, saveDraft } from "../memoStore";
import NavBar from "../NavBar";
import PrimaryButton from "../PrimaryButton";
import { blocksToHtml, htmlToBlocks } from "../richText";
import Screen from "../Screen";
import { textStyle, token } from "../tokens";
import { createMemoAction, updateMemoAction } from "./actions";
import styles from "./WriteForm.module.css";

const LABELS: { label: MemoLabel; name: string }[] = [
  { label: "blue", name: "파랑" },
  { label: "green", name: "초록" },
  { label: "orange", name: "주황" },
  { label: "pink", name: "분홍" },
];

type FormatKey = "bold" | "h2" | "h3" | "list";

const FORMATS: { key: FormatKey; text: string }[] = [
  { key: "bold", text: "B" },
  { key: "h2", text: "제목" },
  { key: "h3", text: "소제목" },
  { key: "list", text: "목록" },
];

const NO_FORMAT: Record<FormatKey, boolean> = {
  bold: false,
  h2: false,
  h3: false,
  list: false,
};

/** 고칠 메모. 없으면 새 메모를 쓰는 화면이 된다. */
export type EditingMemo = {
  id: string;
  title: string;
  body: Block[];
  category: Category;
  label: MemoLabel;
};

export default function WriteForm({ memo: initialMemo }: { memo?: EditingMemo }) {
  const router = useRouter();
  // 처음 받은 메모만 쓴다. 화면이 새로고침돼도 고치던 글이 덮어써지지 않게 한다.
  const [memo] = useState(initialMemo);
  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRef = useRef(false);

  const [title, setTitle] = useState(memo?.title ?? "");
  const [category, setCategory] = useState<Category>(memo?.category ?? "개인");
  const [label, setLabel] = useState<MemoLabel>(memo?.label ?? "blue");
  const [revision, setRevision] = useState(0);
  const [autosaved, setAutosaved] = useState(false);
  const [empty, setEmpty] = useState(true);
  const [saving, startSaving] = useTransition();
  const [active, setActive] = useState(NO_FORMAT);

  // 고치는 중이면 그 메모의 본문을, 새로 쓰는 중이면 쓰다 만 글을 불러온다.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (memo) {
      editor.innerHTML = blocksToHtml(memo.body);
      setEmpty(!editor.textContent);
      return;
    }
    const draft = loadDraft();
    if (!draft) return;
    setTitle(draft.title ?? "");
    setCategory(draft.category ?? "개인");
    setLabel(draft.label ?? "blue");
    editor.innerHTML = blocksToHtml(draft.body ?? []);
    setEmpty(!editor.textContent);
    setAutosaved(true);
  }, [memo]);

  // 새로 쓰는 중에만, 바뀐 뒤 잠깐 있다가 쓰던 글을 임시 저장한다.
  useEffect(() => {
    if (revision === 0 || memo) return;
    const timer = setTimeout(() => {
      const editor = editorRef.current;
      if (!editor || savedRef.current) return;
      setAutosaved(
        saveDraft({ title, category, label, body: htmlToBlocks(editor) }),
      );
    }, 600);
    return () => clearTimeout(timer);
  }, [revision, title, category, label, memo]);

  // 커서가 있는 글자의 서식을 서식 막대에 보여준다.
  useEffect(() => {
    const update = () => {
      const selection = document.getSelection();
      if (!editorRef.current?.contains(selection?.anchorNode ?? null)) return;
      const block = String(document.queryCommandValue("formatBlock")).toLowerCase();
      setActive({
        bold: document.queryCommandState("bold"),
        h2: block === "h2",
        h3: block === "h3",
        list: document.queryCommandState("insertUnorderedList"),
      });
    };
    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, []);

  const touch = () => setRevision((n) => n + 1);

  const applyFormat = (key: FormatKey) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    // 아무것도 없는 상태에서는 서식이 먹지 않아서 빈 줄을 하나 깐다.
    if (!editor.firstChild) {
      editor.innerHTML = "<div><br></div>";
      const line = editor.firstChild;
      if (line) {
        const range = document.createRange();
        range.setStart(line, 0);
        range.collapse(true);
        document.getSelection()?.removeAllRanges();
        document.getSelection()?.addRange(range);
      }
    }
    if (key === "bold") document.execCommand("bold");
    else if (key === "list") document.execCommand("insertUnorderedList");
    else document.execCommand("formatBlock", false, active[key] ? "div" : `<${key}>`);
    touch();
  };

  const handleInput = () => {
    setEmpty(!editorRef.current?.textContent);
    touch();
  };

  const handleSave = () => {
    const editor = editorRef.current;
    const text = title.trim();
    if (!editor || saving) return;
    if (!text) {
      titleRef.current?.focus();
      return;
    }
    const body = htmlToBlocks(editor);
    const next = { title: text, label, category, body };
    startSaving(async () => {
      const result = memo
        ? await updateMemoAction(memo.id, next)
        : await createMemoAction(next);
      if (!result.ok) {
        window.alert(result.error);
        return;
      }
      savedRef.current = true;
      if (memo) {
        router.push(`/memo/${memo.id}`);
      } else {
        clearDraft();
        router.push("/");
      }
    });
  };

  return (
    <Screen>
      <NavBar
        left={
          <IconButton
            icon="chevron-left"
            label="뒤로가기"
            href={memo ? `/memo/${memo.id}` : "/"}
          />
        }
        right={
          autosaved && (
            <span className={`${styles.autosave} ${textStyle("caption/sm")}`}>
              자동 저장됨
            </span>
          )
        }
      />

      <main className={styles.main}>
        <label className={styles.field}>
          <span className={`${styles.fieldLabel} ${textStyle("caption/sm")}`}>
            제목
          </span>
          <input
            ref={titleRef}
            className={`${styles.input} ${textStyle("title/md")}`}
            value={title}
            placeholder="제목을 입력하세요"
            onChange={(event) => {
              setTitle(event.target.value);
              touch();
            }}
          />
        </label>

        <div className={styles.options}>
          <div className={styles.row}>
            <span className={`${styles.rowLabel} ${textStyle("caption/sm")}`}>
              분류
            </span>
            {CATEGORIES.map((name) => (
              <Chip
                key={name}
                label={name}
                selected={category === name}
                onClick={() => {
                  setCategory(name);
                  touch();
                }}
              />
            ))}
          </div>
          <div className={styles.row} role="group" aria-label="색 라벨">
            <span className={`${styles.rowLabel} ${textStyle("caption/sm")}`}>
              색
            </span>
            {LABELS.map((item) => (
              <button
                key={item.label}
                type="button"
                aria-label={item.name}
                aria-pressed={label === item.label}
                className={`${styles.dot} ${
                  label === item.label ? styles.dotSelected : ""
                }`}
                onClick={() => {
                  setLabel(item.label);
                  touch();
                }}
              >
                <span
                  className={styles.dotColor}
                  style={{ background: token(`label/${item.label}`) }}
                />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.editor}>
          <div className={styles.toolbar} role="toolbar" aria-label="서식">
            {FORMATS.map((format) => (
              <button
                key={format.key}
                type="button"
                aria-pressed={active[format.key]}
                className={`${styles.format} ${textStyle("label/md")} ${
                  active[format.key] ? styles.formatActive : ""
                }`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => applyFormat(format.key)}
              >
                {format.text}
              </button>
            ))}
          </div>
          <hr className={styles.divider} />
          <div
            ref={editorRef}
            className={`${styles.body} rich-text ${textStyle("body/md")}`}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            aria-label="본문"
            data-placeholder="본문을 입력하세요"
            data-empty={empty}
            onInput={handleInput}
          />
        </div>
      </main>

      <PrimaryButton onClick={handleSave}>
        {saving ? "저장하는 중" : "저장하기"}
      </PrimaryButton>
    </Screen>
  );
}
