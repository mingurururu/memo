import Link from "next/link";
import Icon, { type IconName } from "./Icon";
import styles from "./IconButton.module.css";

// 아이콘 버튼. 40×40 누르는 영역 가운데에 아이콘을 둔다.
// href를 주면 링크, 아니면 버튼이 된다.
export default function IconButton({
  icon,
  label,
  href,
  active = false,
  pressed,
  expanded,
  onClick,
}: {
  icon: IconName;
  label: string;
  href?: string;
  active?: boolean;
  pressed?: boolean;
  expanded?: boolean;
  onClick?: () => void;
}) {
  const className = `${styles.button} ${active ? styles.active : ""}`;
  if (href) {
    return (
      <Link href={href} className={className} aria-label={label}>
        <Icon name={icon} size={24} />
      </Link>
    );
  }
  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      aria-pressed={pressed}
      aria-expanded={expanded}
      aria-haspopup={expanded === undefined ? undefined : "menu"}
      onClick={onClick}
    >
      <Icon name={icon} size={24} />
    </button>
  );
}
