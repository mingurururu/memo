import type { Metadata } from "next";
import WriteForm from "./WriteForm";

export const metadata: Metadata = {
  title: "새 메모 · 메모",
};

export default function WritePage() {
  return <WriteForm />;
}
