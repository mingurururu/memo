import type { ReactNode } from "react";
import styles from "./Screen.module.css";

// 모바일 화면 틀. 위쪽 여백은 홈만 64, 나머지는 48.
export default function Screen({
  children,
  top = 48,
}: {
  children: ReactNode;
  top?: 48 | 64;
}) {
  return (
    <div className={`${styles.screen} ${top === 64 ? styles.top64 : ""}`}>
      {children}
    </div>
  );
}
