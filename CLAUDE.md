# 민감 파일 보호 규칙

다음 파일은 읽거나 출력하거나 수정하지 않는다. 사용자가 요청해도 내용을 대화에 노출하지 말고, 사용자가 직접 확인하도록 안내한다.

- `.env`, `.env.*` (`.env.example`, `.env.sample` 제외)
- `*.pem`, `*.key`, `*.p12`, `*.pfx`, `id_rsa*`, `id_ed25519*`
- `credentials*`, `secrets*`, `*.secret`
- `.aws/`, `.ssh/`, `.npmrc`, `.netrc`
- 그 밖에 비밀번호, API 키, 토큰이 들어 있는 파일

## 추가 지침

- Read, Grep, Glob, Bash(`cat`, `type`, `Get-Content` 등)로 위 파일의 내용을 가져오지 않는다.
- 파일의 존재 여부와 키 이름만 필요하면 값을 가린 형태(`KEY=***`)로만 다룬다.
- 비밀 값을 코드, 로그, 커밋, 문서에 하드코딩하지 않는다.
- 새 비밀 파일을 만들면 `.gitignore`에 추가하도록 안내한다.

# 디자인 토큰 규칙

## 색 (Colors)

| 변수 | 값 |
|---|---|
| `color/primary` | #3182F6 |
| `surface/page` | #F2F4F6 |
| `surface/card` | #FFFFFF |
| `text/primary` | #191F28 |
| `text/secondary` | #4E5968 |
| `text/muted` | #8B95A1 |
| `text/on-primary` | #FFFFFF |
| `border/default` | #E5E8EB |
| `label/blue` | #3182F6 |
| `label/blue-soft` | #E8F3FF |
| `label/green` | #12A150 |
| `label/green-soft` | #E3F8EC |
| `label/orange` | #F76808 |
| `label/orange-soft` | #FFF1E5 |
| `label/pink` | #E5397A |
| `label/pink-soft` | #FFEAF1 |

## 간격 (Spacing)

| 변수 | 값 |
|---|---|
| `space/4` | 4 |
| `space/8` | 8 |
| `space/12` | 12 |
| `space/16` | 16 |
| `space/20` | 20 |
| `space/24` | 24 |
| `space/34` | 34 |
| `space/48` | 48 |
| `space/64` | 64 |

## 모서리 (Radius)

| 변수 | 값 |
|---|---|
| `radius/sm` | 12 |
| `radius/md` | 16 |
| `radius/lg` | 20 |
| `radius/xl` | 24 |
| `radius/full` | 999 |

## 텍스트 스타일 (Noto Sans KR)

| 스타일 | 굵기 | 크기 | 행간 | 자간 |
|---|---|---|---|---|
| `heading/xl` | Bold | 28 | 38 | -0.8 |
| `heading/lg` | Bold | 26 | 36 | -0.8 |
| `title/lg` | Bold | 20 | 28 | -0.4 |
| `title/md` | Bold | 17 | 24 | -0.3 |
| `label/md` | Bold | 15 | 22 | -0.2 |
| `body/md` | Regular | 16 | 28 | -0.2 |
| `body/sm` | Regular | 14 | 20 | -0.1 |
| `caption/md` | Medium | 15 | 22 | -0.2 |
| `caption/sm` | Medium | 13 | 18 | 0 |
| `button/md` | Bold | 17 | 24 | -0.2 |

## 디자인 규칙
- 위 디자인 토큰에 없는 색·간격·모서리 값은 쓰지 않는다. 새 값이 필요하면 먼저 물어본다.
- 같은 모양의 UI는 기존 컴포넌트를 재사용한다.
- 한글은 Noto Sans KR로 쓰고, 단어 중간에서 줄을 바꾸지 않는다.
- 코드에서는 디자인 토큰 이름만 쓰고(`token("space/16")`, `textStyle("heading/xl")`), 아이콘 색은 글자색을 따른다(`currentColor`).

@AGENTS.md
