import type { ReactNode } from "react";
import styles from "./NavBar.module.css";

// 화면 위쪽 바. center를 주면 왼쪽 버튼과 오른쪽 사이에 제목이 들어간다.
export default function NavBar({
  left,
  center,
  right,
}: {
  left: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <nav className={styles.navBar}>
      {left}
      {center && <div className={styles.center}>{center}</div>}
      <div className={styles.right}>{right}</div>
    </nav>
  );
}
