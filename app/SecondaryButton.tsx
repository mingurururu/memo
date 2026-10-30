import type { ReactNode } from "react";
import styles from "./SecondaryButton.module.css";
import { textStyle } from "./tokens";

// 보조 버튼. 목록 끝의 더 보기처럼 주 버튼보다 약한 동작에 쓴다.
export default function SecondaryButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.button} ${textStyle("label/md")}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
