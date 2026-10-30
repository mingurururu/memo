import type { Metadata } from "next";
import { Suspense } from "react";
import { fetchMemos } from "../memoDb";
import Screen from "../Screen";
import AllMemos from "./AllMemos";

export const metadata: Metadata = {
  title: "전체 메모 · 메모",
};

async function AllContent() {
  const memos = await fetchMemos();
  return <AllMemos memos={memos} />;
}

export default function AllPage() {
  return (
    <Suspense fallback={<Screen>{null}</Screen>}>
      <AllContent />
    </Suspense>
  );
}
