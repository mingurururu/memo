import IconButton from "../../IconButton";
import type { Block, Inline, Memo } from "../../memos";
import NavBar from "../../NavBar";
import PrimaryButton from "../../PrimaryButton";
import Screen from "../../Screen";
import { textStyle, token } from "../../tokens";
import MemoActions from "./MemoActions";
import styles from "./MemoDetail.module.css";

function Line({ parts }: { parts: Inline[] }) {
  return parts.map((part, i) =>
    typeof part === "string" ? (
      part
    ) : (
      <strong key={i} className={styles.strong}>
        {part.bold}
      </strong>
    ),
  );
}

function BodyBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className={`${styles.h2} ${textStyle("title/lg")}`}>{block.text}</h2>
      );
    case "h3":
      return (
        <h3 className={`${styles.h3} ${textStyle("title/md")}`}>{block.text}</h3>
      );
    case "p":
      return (
        <p className={`${styles.text} ${textStyle("body/md")}`}>
          {block.lines.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              <Line parts={line} />
            </span>
          ))}
        </p>
      );
    case "list":
      return (
        <ul className={`${styles.list} ${textStyle("body/md")}`}>
          {block.items.map((item, i) => (
            <li key={i} className={styles.listItem}>
              <span aria-hidden="true">•</span>
              <span>
                <Line parts={item} />
              </span>
            </li>
          ))}
        </ul>
      );
  }
}

export default function MemoDetail({ memo }: { memo: Memo }) {
  return (
    <Screen>
      <NavBar
        left={<IconButton icon="chevron-left" label="뒤로가기" href="/" />}
        right={<MemoActions id={memo.id} pinned={memo.pinned} />}
      />

      <main className={styles.main}>
        <article className={styles.card}>
          <div className={styles.meta}>
            <span
              className={`${styles.badge} ${textStyle("caption/sm")}`}
              style={{
                background: token(`label/${memo.label}-soft`),
                color: token(`label/${memo.label}`),
              }}
            >
              {memo.category}
            </span>
            <span className={`${styles.created} ${textStyle("caption/sm")}`}>
              {memo.createdText}
            </span>
          </div>
          <h1 className={`${styles.title} ${textStyle("heading/lg")}`}>
            {memo.title}
          </h1>
          <hr className={styles.divider} />
          <div className={styles.body}>
            {memo.body.map((block, i) => (
              <BodyBlock key={i} block={block} />
            ))}
          </div>
          <p className={`${styles.footer} ${textStyle("caption/sm")}`}>
            {memo.footer}
          </p>
        </article>
      </main>

      <PrimaryButton href={`/memo/${memo.id}/edit`}>수정하기</PrimaryButton>
    </Screen>
  );
}
