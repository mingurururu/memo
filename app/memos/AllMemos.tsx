"use client";

import { useCallback, useMemo, useState } from "react";
import Card from "../Card";
import Chip from "../Chip";
import Icon from "../Icon";
import IconButton from "../IconButton";
import MemoItem from "../MemoItem";
import {
  blocksText,
  CATEGORIES,
  type Category,
  type Memo,
  type Section,
} from "../memos";
import NavBar from "../NavBar";
import PopMenu, { PopMenuItem } from "../PopMenu";
import Screen from "../Screen";
import SecondaryButton from "../SecondaryButton";
import { textStyle } from "../tokens";
import styles from "./AllMemos.module.css";

// 더 보기는 메모를 20개씩 더 보여준다.
const PAGE_SIZE = 20;

type Sort = "최신순" | "오래된순";
const SORTS: Sort[] = ["최신순", "오래된순"];

type Group = { section: Section; memos: Memo[] };

export default function AllMemos({ memos }: { memos: Memo[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "전체">("전체");
  const [sort, setSort] = useState<Sort>("최신순");
  const [sortOpen, setSortOpen] = useState(false);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const closeSort = useCallback(() => setSortOpen(false), []);

  // 검색, 분류, 정렬이 바뀌면 처음 20개부터 다시 보여준다.
  const change = (apply: () => void) => {
    apply();
    setLimit(PAGE_SIZE);
  };

  const results = useMemo(() => {
    const text = query.trim().toLowerCase();
    const found = memos.filter(
      (memo) =>
        (category === "전체" || memo.category === category) &&
        (!text ||
          memo.title.toLowerCase().includes(text) ||
          blocksText(memo.body, " ").toLowerCase().includes(text)),
    );
    return found.sort((a, b) =>
      sort === "최신순" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt,
    );
  }, [memos, query, category, sort]);

  const shown = results.slice(0, limit);
  const remaining = results.length - shown.length;

  // 날짜가 같은 메모끼리 이어서 묶는다.
  const groups: Group[] = [];
  for (const memo of shown) {
    const last = groups[groups.length - 1];
    if (last?.section === memo.section) last.memos.push(memo);
    else groups.push({ section: memo.section, memos: [memo] });
  }

  return (
    <Screen>
      <NavBar
        left={<IconButton icon="chevron-left" label="뒤로가기" href="/" />}
        center={
          <>
            <h1 className={`${styles.title} ${textStyle("title/lg")}`}>
              전체 메모
            </h1>
            <span className={`${styles.count} ${textStyle("caption/md")}`}>
              {memos.length}
            </span>
          </>
        }
        right={
          <PopMenu
            open={sortOpen}
            onClose={closeSort}
            label="정렬"
            trigger={
              <button
                type="button"
                className={`${styles.sort} ${textStyle("caption/md")}`}
                aria-haspopup="menu"
                aria-expanded={sortOpen}
                onClick={() => setSortOpen((value) => !value)}
              >
                {sort}
                <Icon name="chevron-down" size={16} />
              </button>
            }
          >
            {SORTS.map((name) => (
              <PopMenuItem
                key={name}
                selected={sort === name}
                onClick={() => {
                  change(() => setSort(name));
                  closeSort();
                }}
              >
                {name}
              </PopMenuItem>
            ))}
          </PopMenu>
        }
      />

      <label className={styles.search}>
        <Icon name="search" size={20} />
        <input
          className={`${styles.searchInput} ${textStyle("body/md")}`}
          type="text"
          inputMode="search"
          aria-label="메모 검색"
          placeholder="제목이나 내용으로 찾기"
          value={query}
          onChange={(event) => change(() => setQuery(event.target.value))}
        />
      </label>

      <div className={styles.filter} role="group" aria-label="메모 분류">
        {(["전체", ...CATEGORIES] as const).map((name) => (
          <Chip
            key={name}
            label={name}
            selected={category === name}
            onClick={() => change(() => setCategory(name))}
          />
        ))}
      </div>

      <main className={styles.list}>
        {groups.map((group) => (
          <section key={group.section} className={styles.section}>
            <h2 className={`${styles.sectionLabel} ${textStyle("caption/md")}`}>
              {group.section}
            </h2>
            <Card>
              {group.memos.map((memo) => (
                <MemoItem key={memo.id} memo={memo} />
              ))}
            </Card>
          </section>
        ))}
        {results.length === 0 && (
          <p className={`${styles.empty} ${textStyle("body/md")}`}>
            {memos.length === 0 ? "아직 메모가 없어요." : "찾는 메모가 없어요"}
          </p>
        )}
      </main>

      {remaining > 0 && (
        <SecondaryButton onClick={() => setLimit((value) => value + PAGE_SIZE)}>
          메모 {Math.min(PAGE_SIZE, remaining)}개 더 보기
        </SecondaryButton>
      )}
    </Screen>
  );
}
