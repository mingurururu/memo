import Link from "next/link";
import Icon from "./Icon";
import styles from "./MemoItem.module.css";
import type { Memo } from "./memos";
import { textStyle, token } from "./tokens";

// 메모 목록의 한 줄. 왼쪽 칸 색은 메모의 색 라벨이고, 누르면 메모 상세로 간다.
export default function MemoItem({ memo }: { memo: Memo }) {
  return (
    <Link className={styles.item} href={`/memo/${memo.id}`}>
      <span
        className={styles.tile}
        style={{
          background: token(`label/${memo.label}-soft`),
          color: token(`label/${memo.label}`),
        }}
      >
        <Icon name="note" size={22} />
      </span>
      <span className={styles.content}>
        <p className={`${styles.title} ${textStyle("title/md")}`}>{memo.title}</p>
        <p className={`${styles.preview} ${textStyle("body/sm")}`}>
          {memo.preview}
        </p>
      </span>
      <span className={`${styles.date} ${textStyle("caption/sm")}`}>
        {memo.date}
      </span>
    </Link>
  );
}
