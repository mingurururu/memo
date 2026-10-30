import type { ReactNode } from "react";
import styles from "./template.module.css";

// 화면을 옮길 때마다 새로 그려져서, 들어오는 화면이 살짝 떠오르며 나타난다.
export default function Template({ children }: { children: ReactNode }) {
  return <div className={styles.enter}>{children}</div>;
}
