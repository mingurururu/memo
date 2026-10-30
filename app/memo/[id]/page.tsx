import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchMemo } from "../../memoDb";
import Screen from "../../Screen";
import MemoDetail from "./MemoDetail";

async function MemoContent({ params }: Pick<PageProps<"/memo/[id]">, "params">) {
  const { id } = await params;
  const memo = await fetchMemo(id);
  if (!memo) notFound();
  return <MemoDetail memo={memo} />;
}

export default function MemoPage({ params }: PageProps<"/memo/[id]">) {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <MemoContent params={params} />
    </Suspense>
  );
}
