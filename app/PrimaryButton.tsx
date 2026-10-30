import Link from "next/link";
import type { ReactNode } from "react";
import Icon from "./Icon";
import styles from "./PrimaryButton.module.css";
import { textStyle } from "./tokens";

// 화면의 주 버튼. 화면마다 하나, 아래쪽에 가로로 꽉 차게 붙는다.
// href를 주면 다른 화면으로 가는 링크, onClick을 주면 그 자리에서 실행하는 버튼이 된다.
export default function PrimaryButton({
  children,
  icon = false,
  href,
  onClick,
}: {
  children: ReactNode;
  icon?: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const className = `${styles.button} ${textStyle("button/md")}`;
  const content = (
    <>
      {icon && <Icon name="plus" size={20} />}
      {children}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  );
}
