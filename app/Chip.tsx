import styles from "./Chip.module.css";
import { textStyle } from "./tokens";

// 분류 칩. 고른 칩은 selected.
export default function Chip({
  label,
  selected = false,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`${styles.chip} ${textStyle("label/md")} ${
        selected ? styles.selected : ""
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
