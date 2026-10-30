"use client";

import Link from "next/link";
import { useState } from "react";
import Card from "./Card";
import Chip from "./Chip";
import Icon from "./Icon";
import MemoItem from "./MemoItem";
import { CATEGORIES, TODAY_TEXT, type Category, type Memo } from "./memos";
import styles from "./MemoHome.module.css";
import PrimaryButton from "./PrimaryButton";
import Screen from "./Screen";
import { textStyle } from "./tokens";

// 홈의 "최근 메모"에는 가장 최근 메모만 보이고, 나머지는 전체 보기에서 본다.
const RECENT_LIMIT = 3;

function MemoCard({
  title,
  memos,
  pin = false,
  action = false,
}: {
  title: string;
  memos: Memo[];
  pin?: boolean;
  action?: boolean;
}) {
  if (memos.length === 0) return null;
  return (
    <Card>
      <div className={styles.cardHeader}>
        {pin && (
          <span className={styles.pin}>
            <Icon name="pin" size={16} />
          </span>
        )}
        <h2 className={`${styles.cardTitle} ${textStyle("label/md")}`}>
          {title}
        </h2>
        {action && (
          <Link
            href="/memos"
            className={`${styles.action} ${textStyle("caption/md")}`}
          >
            전체 보기
            <Icon name="chevron-right" size={16} />
          </Link>
        )}
      </div>
      {memos.map((memo) => (
        <MemoItem key={memo.id} memo={memo} />
      ))}
    </Card>
  );
}

export default function MemoHome({ memos }: { memos: Memo[] }) {
  const [selected, setSelected] = useState<Category | "전체">("전체");

  const visible = memos.filter(
    (memo) => selected === "전체" || memo.category === selected,
  );
  const pinned = visible.filter((memo) => memo.pinned);
  const recent = visible.filter((memo) => !memo.pinned).slice(0, RECENT_LIMIT);

  return (
    <Screen top={64}>
      <main className={styles.main}>
        <header className={styles.header}>
          <p className={`${styles.date} ${textStyle("caption/md")}`}>
            {TODAY_TEXT}
          </p>
          <h1 className={`${styles.headline} ${textStyle("heading/xl")}`}>
            오늘까지 메모를
            <br />
            <span className={styles.count}>{memos.length}개</span> 남겼어요
          </h1>
        </header>

        <div className={styles.filter} role="group" aria-label="메모 분류">
          {(["전체", ...CATEGORIES] as const).map((name) => (
            <Chip
              key={name}
              label={name}
              selected={selected === name}
              onClick={() => setSelected(name)}
            />
          ))}
        </div>

        <MemoCard title="고정한 메모" memos={pinned} pin />
        <MemoCard title="최근 메모" memos={recent} action />
        {visible.length === 0 && (
          <p className={`${styles.empty} ${textStyle("body/md")}`}>
            이 분류에는 아직 메모가 없어요.
          </p>
        )}
      </main>

      <PrimaryButton icon href="/write">
        새 메모 쓰기
      </PrimaryButton>
    </Screen>
  );
}
