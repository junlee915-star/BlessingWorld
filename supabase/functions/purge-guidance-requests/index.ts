// §7.4 개인정보 보존 자동화 (일 1회 cron)
// 1. status = 'closed' 이고 closed_at + 1년 경과한 guidance_requests → 삭제
// 2. status = 'opted_out' → 즉시 삭제(요청 시점 즉시 실행)
// 3. 삭제 이력은 개인식별정보 없이 audit_log 테이블에 건수만 기록
//
// 배포 전 준비물:
//   - Supabase 프로젝트에 SUPABASE_SERVICE_ROLE_KEY 환경변수 설정
//   - supabase/migrations 에 audit_log 테이블 추가(현재 미포함, M6에서 구현 예정)
//   - `supabase functions deploy purge-guidance-requests --schedule "0 18 * * *"` 로 매일 KST 03:00 실행

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response("Supabase 환경변수가 설정되지 않았습니다.", { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const today = new Date().toISOString().slice(0, 10);

  const { data: purged, error: purgeError } = await supabase
    .from("guidance_requests")
    .delete()
    .lte("purge_after", today)
    .eq("status", "closed")
    .select("id");

  const { data: optedOut, error: optedOutError } = await supabase
    .from("guidance_requests")
    .delete()
    .eq("status", "opted_out")
    .select("id");

  if (purgeError || optedOutError) {
    return new Response(
      JSON.stringify({ purgeError, optedOutError }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify({
      purged_closed: purged?.length ?? 0,
      purged_opted_out: optedOut?.length ?? 0,
    }),
    { headers: { "content-type": "application/json" } },
  );
});
