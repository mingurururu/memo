"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./PopMenu.module.css";
import { textStyle } from "./tokens";

// 버튼 아래에 뜨는 작은 메뉴. 바깥을 누르거나 Esc를 누르면 닫힌다.
export default function PopMenu({
  open,
  onClose,
  trigger,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  trigger: ReactNode;
  label: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div className={styles.wrap} ref={ref}>
      {trigger}
      {open && (
        <div className={styles.menu} role="menu" aria-label={label}>
          {children}
        </div>
      )}
    </div>
  );
}

// selected를 주면 고르는 메뉴(라디오)의 항목이 된다. 고른 항목은 파랗게 보인다.
export function PopMenuItem({
  children,
  onClick,
  selected,
}: {
  children: ReactNode;
  onClick: () => void;
  selected?: boolean;
}) {
  const isChoice = selected !== undefined;
  return (
    <button
      type="button"
      role={isChoice ? "menuitemradio" : "menuitem"}
      aria-checked={isChoice ? selected : undefined}
      className={`${styles.item} ${textStyle("label/md")} ${
        selected ? styles.selected : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
