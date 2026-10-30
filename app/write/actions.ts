"use server";

import { revalidatePath } from "next/cache";
import { createMemo, updateMemo, type NewMemo } from "../memoDb";

export type SaveResult = { ok: true; id: string } | { ok: false; error: string };

const messageOf = (error: unknown) =>
  error instanceof Error ? error.message : "저장하지 못했어요.";

export async function createMemoAction(memo: NewMemo): Promise<SaveResult> {
  try {
    const id = await createMemo(memo);
    revalidatePath("/");
    return { ok: true, id };
  } catch (error) {
    return { ok: false, error: messageOf(error) };
  }
}

export async function updateMemoAction(
  id: string,
  memo: NewMemo,
): Promise<SaveResult> {
  try {
    await updateMemo(id, memo);
    revalidatePath("/");
    revalidatePath(`/memo/${id}`);
    return { ok: true, id };
  } catch (error) {
    return { ok: false, error: messageOf(error) };
  }
}
