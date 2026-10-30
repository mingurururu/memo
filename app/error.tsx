"use client";

import IconButton from "./IconButton";
import NavBar from "./NavBar";
import PrimaryButton from "./PrimaryButton";
import Screen from "./Screen";
import { textStyle, token } from "./tokens";

// 메모를 불러오거나 저장하다 막혔을 때 보이는 화면
export default function ErrorScreen({ reset }: { error: Error; reset: () => void }) {
  return (
    <Screen>
      <NavBar left={<IconButton icon="chevron-left" label="뒤로가기" href="/" />} />
      <main style={{ flex: 1 }}>
        <p
          className={textStyle("body/md")}
          style={{ margin: 0, color: token("text/secondary") }}
        >
          메모를 불러오지 못했어요. 잠시 뒤에 다시 시도해 주세요.
        </p>
      </main>
      <PrimaryButton onClick={reset}>다시 시도</PrimaryButton>
    </Screen>
  );
}
