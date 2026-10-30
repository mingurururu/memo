"use server";

import { revalidatePath } from "next/cache";
import { deleteMemo, setMemoPinned } from "../../memoDb";

export type ActionResult = { ok: true } | { ok: false; error: string };

const messageOf = (error: unknown) =>
  error instanceof Error ? error.message : "처리하지 못했어요.";

export async function setPinnedAction(
  id: string,
  pinned: boolean,
): Promise<ActionResult> {
  try {
    await setMemoPinned(id, pinned);
    revalidatePath("/");
    revalidatePath(`/memo/${id}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: messageOf(error) };
  }
}

export async function deleteMemoAction(id: string): Promise<ActionResult> {
  try {
    await deleteMemo(id);
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: messageOf(error) };
  }
}
