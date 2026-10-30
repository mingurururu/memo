import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchMemo } from "../../../memoDb";
import Screen from "../../../Screen";
import WriteForm from "../../../write/WriteForm";

export const metadata: Metadata = {
  title: "메모 수정 · 메모",
};

async function EditContent({ params }: Pick<PageProps<"/memo/[id]/edit">, "params">) {
  const { id } = await params;
  const memo = await fetchMemo(id);
  if (!memo) notFound();
  return (
    <WriteForm
      memo={{
        id: memo.id,
        title: memo.title,
        body: memo.body,
        category: memo.category,
        label: memo.label,
      }}
    />
  );
}

export default function EditPage({ params }: PageProps<"/memo/[id]/edit">) {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <EditContent params={params} />
    </Suspense>
  );
}
