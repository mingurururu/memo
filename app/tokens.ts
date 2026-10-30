// CLAUDE.md의 디자인 토큰 이름을 그대로 쓰는 헬퍼. 값은 globals.css에 있다.

export type ColorToken =
  | "color/primary"
  | "surface/page"
  | "surface/card"
  | "text/primary"
  | "text/secondary"
  | "text/muted"
  | "text/on-primary"
  | "border/default"
  | "label/blue"
  | "label/blue-soft"
  | "label/green"
  | "label/green-soft"
  | "label/orange"
  | "label/orange-soft"
  | "label/pink"
  | "label/pink-soft";

export type SpaceToken =
  | "space/4"
  | "space/8"
  | "space/12"
  | "space/16"
  | "space/20"
  | "space/24"
  | "space/34"
  | "space/48"
  | "space/64";

export type RadiusToken =
  | "radius/sm"
  | "radius/md"
  | "radius/lg"
  | "radius/xl"
  | "radius/full";

export type TextStyleToken =
  | "heading/xl"
  | "heading/lg"
  | "title/lg"
  | "title/md"
  | "label/md"
  | "body/md"
  | "body/sm"
  | "caption/md"
  | "caption/sm"
  | "button/md";

export type Token = ColorToken | SpaceToken | RadiusToken;

/** token("space/16") -> "var(--space-16)" */
export function token(name: Token): string {
  return `var(--${name.replace("/", "-")})`;
}

/** textStyle("heading/xl") -> "heading-xl" (className으로 쓴다) */
export function textStyle(name: TextStyleToken): string {
  return name.replace("/", "-");
}
