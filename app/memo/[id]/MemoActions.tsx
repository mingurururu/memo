"use client";

import { useRouter } from "next/navigation";
import { useCallback, useOptimistic, useState, useTransition } from "react";
import IconButton from "../../IconButton";
import PopMenu, { PopMenuItem } from "../../PopMenu";
import { deleteMemoAction, setPinnedAction } from "./actions";

// 상세 화면 위쪽의 고정, 공유, 더보기. 고정은 핀 버튼으로, 삭제는 더보기 메뉴에서 한다.
export default function MemoActions({
  id,
  pinned,
}: {
  id: string;
  pinned: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [working, startWork] = useTransition();
  const [isPinned, setIsPinned] = useOptimistic(pinned);
  const close = useCallback(() => setOpen(false), []);

  const togglePinned = () => {
    if (working) return;
    startWork(async () => {
      setIsPinned(!pinned);
      const result = await setPinnedAction(id, !pinned);
      if (!result.ok) window.alert(result.error);
    });
  };

  const remove = () => {
    close();
    if (working) return;
    if (!window.confirm("이 메모를 지울까요? 지운 메모는 되돌릴 수 없어요.")) return;
    startWork(async () => {
      const result = await deleteMemoAction(id);
      if (!result.ok) {
        window.alert(result.error);
        return;
      }
      router.push("/");
    });
  };

  return (
    <>
      <IconButton
        icon="pin"
        label={isPinned ? "고정 해제" : "고정"}
        active={isPinned}
        pressed={isPinned}
        onClick={togglePinned}
      />
      <IconButton icon="share" label="공유" />
      <PopMenu
        open={open}
        onClose={close}
        label="더보기 메뉴"
        trigger={
          <IconButton
            icon="more"
            label="더보기"
            expanded={open}
            onClick={() => setOpen((value) => !value)}
          />
        }
      >
        <PopMenuItem onClick={remove}>삭제</PopMenuItem>
      </PopMenu>
    </>
  );
}
