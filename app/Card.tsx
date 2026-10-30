import type { ReactNode } from "react";
import styles from "./Card.module.css";

// 흰 바탕의 둥근 카드. 메모 줄을 담는다.
export default function Card({ children }: { children: ReactNode }) {
  return <section className={styles.card}>{children}</section>;
}
