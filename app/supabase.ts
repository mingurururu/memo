import { createClient } from "@supabase/supabase-js";

// 접속 주소와 공개 키는 .env.local에서 읽는다. 코드에는 값을 넣지 않는다.
export function supabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    const missing = [
      !url && "NEXT_PUBLIC_SUPABASE_URL",
      !key && "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ].filter(Boolean);
    throw new Error(
      `.env.local에 ${missing.join(", ")} 값이 없어요. 넣은 뒤 개발 서버를 다시 켜 주세요.`,
    );
  }

  return createClient(url, key, { auth: { persistSession: false } });
}
