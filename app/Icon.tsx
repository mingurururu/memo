export type IconName =
  | "plus"
  | "note"
  | "pin"
  | "chevron-right"
  | "chevron-left"
  | "chevron-down"
  | "search"
  | "share"
  | "more";

// 아이콘 색은 글자색을 따른다. 부모의 color가 곧 아이콘 색이다.
export default function Icon({ name, size }: { name: IconName; size: number }) {
  const url = `url(/icons/${name}.svg)`;
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        flexShrink: 0,
        width: size,
        height: size,
        backgroundColor: "currentColor",
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
