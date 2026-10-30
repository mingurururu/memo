import { Suspense } from "react";
import { fetchMemos } from "./memoDb";
import MemoHome from "./MemoHome";
import Screen from "./Screen";

async function HomeContent() {
  const memos = await fetchMemos();
  return <MemoHome memos={memos} />;
}

export default function Home() {
  return (
    <Suspense fallback={<Screen top={64}>{null}</Screen>}>
      <HomeContent />
    </Suspense>
  );
}
