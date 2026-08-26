// §7.4 개인정보 보존 자동화 (일 1회 cron)
// 1. status = 'closed' 이고 closed_at + 1년 경과한 guidance_requests → 삭제
//    (purge_after는 §0011_guidance_admin.sql 트리거가 status가 'closed'로 바뀌는 시점에
//    자동으로 closed_at + 1년으로 채웁니다 — 관리자 화면에서 상태만 바꾸면 됩니다.)
// 2. status = 'opted_out' → 즉시 삭제(요청 시점 즉시 실행)
// 3. 삭제 이력은 개인식별정보 없이 audit_log 테이블(§0011_guidance_admin.sql)에 건수만 기록
//
// 배포 전 준비물:
//   - supabase/migrations/0011_guidance_admin.sql까지 적용되어 있을 것(purge_after 계산·audit_log)
//   - Supabase 프로젝트에 SUPABASE_SERVICE_ROLE_KEY 환경변수 설정
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

  const purgedClosedCount = purged?.length ?? 0;
  const purgedOptedOutCount = optedOut?.length ?? 0;

  // 개인식별정보 없이 건수만 남깁니다(§7.4). 로그 기록 자체가 실패해도 이미 삭제는
  // 끝난 뒤라 파기 결과는 그대로 응답하고, 로그 실패만 별도로 알립니다.
  const logRows = [];
  if (purgedClosedCount > 0) logRows.push({ action: "purge_closed", count: purgedClosedCount });
  if (purgedOptedOutCount > 0) logRows.push({ action: "purge_opted_out", count: purgedOptedOutCount });
  const { error: logError } = logRows.length > 0 ? await supabase.from("audit_log").insert(logRows) : { error: null };

  return new Response(
    JSON.stringify({
      purged_closed: purgedClosedCount,
      purged_opted_out: purgedOptedOutCount,
      log_error: logError?.message ?? null,
    }),
    { headers: { "content-type": "application/json" } },
  );
});
