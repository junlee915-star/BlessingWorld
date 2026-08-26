import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { REGIONS } from "@/content/regions";
import {
  fetchGuidanceRequests,
  fetchStaffOptions,
  updateGuidanceRequest,
  type GuidanceRequestRow,
  type StaffOption,
} from "@/lib/guidanceAdmin";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import type { GuidanceStatus } from "@/integrations/supabase/types";

const STATUS_OPTIONS: GuidanceStatus[] = [
  "received",
  "assigned",
  "contacted",
  "in_progress",
  "closed",
  "opted_out",
];

const STATUS_LABEL: Record<GuidanceStatus, string> = {
  received: "접수됨",
  assigned: "담당자 배정",
  contacted: "연락함",
  in_progress: "진행 중",
  closed: "종료",
  opted_out: "수신 거부",
};

const STATUS_BADGE_VARIANT: Record<GuidanceStatus, BadgeProps["variant"]> = {
  received: "muted",
  assigned: "default",
  contacted: "accent",
  in_progress: "warning",
  closed: "success",
  opted_out: "muted",
};

const inputClass =
  "rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function toCsvValue(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function downloadCsv(rows: GuidanceRequestRow[], staffById: Map<string, string>) {
  const header = ["이름", "연락처", "이메일", "성별", "출생연도", "지역", "유입경로", "이수강좌수", "상태", "담당자", "신청일"];
  const lines = rows.map((row) =>
    [
      row.name,
      row.phone,
      row.email ?? "",
      row.gender === "female" ? "여성" : "남성",
      String(row.birthYear),
      `${row.regionSido} ${row.regionSigungu}`,
      row.source,
      String(row.completedCourses?.length ?? 0),
      STATUS_LABEL[row.status],
      row.assignedStaffId ? staffById.get(row.assignedStaffId) ?? row.assignedStaffId : "",
      formatDate(row.createdAt),
    ]
      .map(toCsvValue)
      .join(","),
  );
  const csv = [header.join(","), ...lines].join("\n");
  // 엑셀에서 한글이 깨지지 않도록 UTF-8 BOM을 붙입니다.
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `guidance-requests-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// §RequireAdmin.tsx가 이 페이지를 감싸서 staff/admin 로그인을 이미 확인했습니다.
// 이 화면은 이름·연락처 등 개인정보를 그대로 보여주므로, staff/admin이 아니면 절대
// 도달할 수 없어야 합니다 — RequireAdmin과 RLS("owner or staff can read guidance
// request", §0001_init.sql/§0004) 둘 다 이 전제에 의존합니다.
export default function GuidanceAdmin() {
  const [rows, setRows] = useState<GuidanceRequestRow[] | null>(null);
  const [staff, setStaff] = useState<StaffOption[]>([]);
  const [sidoFilter, setSidoFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<GuidanceStatus | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [memoDrafts, setMemoDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchGuidanceRequests(), fetchStaffOptions()]).then(([requestRows, staffRows]) => {
      if (cancelled) return;
      setRows(requestRows);
      setStaff(staffRows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const staffById = useMemo(() => new Map(staff.map((s) => [s.id, s.displayName])), [staff]);

  const filteredRows = useMemo(() => {
    if (!rows) return [];
    return rows.filter((row) => {
      if (sidoFilter && row.regionSido !== sidoFilter) return false;
      if (statusFilter && row.status !== statusFilter) return false;
      if (dateFrom && row.createdAt.slice(0, 10) < dateFrom) return false;
      if (dateTo && row.createdAt.slice(0, 10) > dateTo) return false;
      return true;
    });
  }, [rows, sidoFilter, statusFilter, dateFrom, dateTo]);

  function applyUpdate(id: string, updated: GuidanceRequestRow | null, failureMessage: string) {
    if (!updated) {
      toast.error(failureMessage);
      return;
    }
    setRows((prev) => (prev ? prev.map((r) => (r.id === id ? updated : r)) : prev));
  }

  async function handleStatusChange(row: GuidanceRequestRow, status: GuidanceStatus) {
    const updated = await updateGuidanceRequest(row.id, { status });
    applyUpdate(row.id, updated, "상태 변경에 실패했어요.");
    if (updated && status === "closed") {
      toast.success("종료 처리했어요. 1년 뒤 자동으로 파기됩니다.");
    }
  }

  async function handleAssigneeChange(row: GuidanceRequestRow, assignedStaffId: string) {
    const updated = await updateGuidanceRequest(row.id, { assignedStaffId: assignedStaffId || null });
    applyUpdate(row.id, updated, "담당자 배정에 실패했어요.");
  }

  async function handleMemoBlur(row: GuidanceRequestRow) {
    const draft = memoDrafts[row.id];
    if (draft === undefined || draft === (row.memo ?? "")) return;
    const updated = await updateGuidanceRequest(row.id, { memo: draft });
    applyUpdate(row.id, updated, "메모 저장에 실패했어요.");
  }

  return (
    <>
      <SEO path="/admin/guidance" noindex />

      <AdminHeader
        title="신청 관리"
        description="/onboarding으로 들어온 안내 신청을 확인하고, 지역 담당자를 배정하고, 진행 상태를 관리해요. 상태를 '종료'로 바꾸면 1년 뒤 개인정보가 자동으로 파기됩니다(§7.4)."
      />

      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        {!isSupabaseConfigured ? (
          <p className="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
            Supabase가 연결되어 있지 않아 신청 목록을 불러올 수 없어요. .env를 채운 뒤 다시
            시도해주세요.
          </p>
        ) : rows === null ? (
          <p className="text-sm text-muted-foreground">불러오는 중이에요…</p>
        ) : (
          <>
            <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
              <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
                지역
                <select className={inputClass} value={sidoFilter} onChange={(e) => setSidoFilter(e.target.value)}>
                  <option value="">전체</option>
                  {REGIONS.map((group) => (
                    <option key={group.sido} value={group.sido}>
                      {group.sido}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
                상태
                <select
                  className={inputClass}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as GuidanceStatus | "")}
                >
                  <option value="">전체</option>
                  {STATUS_OPTIONS.map((value) => (
                    <option key={value} value={value}>
                      {STATUS_LABEL[value]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
                신청일(부터)
                <input
                  type="date"
                  className={inputClass}
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
                신청일(까지)
                <input
                  type="date"
                  className={inputClass}
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </label>

              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => downloadCsv(filteredRows, staffById)}
                disabled={filteredRows.length === 0}
              >
                <Download className="h-3.5 w-3.5" /> CSV 내보내기 ({filteredRows.length}건)
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              총 {rows.length}건 중 {filteredRows.length}건 표시 중. 개인정보가 포함된 화면이니
              캡처·공유 시 주의해주세요.
            </p>

            {filteredRows.length === 0 ? (
              <p className="mt-8 text-sm text-muted-foreground">조건에 맞는 신청이 없어요.</p>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
                <table className="w-full min-w-[1100px] text-left text-sm">
                  <thead className="border-b border-border bg-muted/60 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">신청자</th>
                      <th className="px-4 py-3">연락처</th>
                      <th className="px-4 py-3">지역</th>
                      <th className="px-4 py-3">유입경로</th>
                      <th className="px-4 py-3">신청일</th>
                      <th className="px-4 py-3">상태</th>
                      <th className="px-4 py-3">담당자</th>
                      <th className="px-4 py-3">메모</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row) => (
                      <tr key={row.id} className="border-b border-border align-top last:border-0">
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{row.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {row.gender === "female" ? "여성" : "남성"} · {row.birthYear}년생
                          </p>
                          {row.completedCourses && row.completedCourses.length > 0 ? (
                            <Badge variant="success" className="mt-1">
                              교육 {row.completedCourses.length}강 이수
                            </Badge>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          <a href={`tel:${row.phone.replace(/-/g, "")}`} className="font-medium text-primary-deep hover:underline">
                            {row.phone}
                          </a>
                          {row.email ? <p className="mt-0.5 text-xs">{row.email}</p> : null}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {row.regionSido} {row.regionSigungu}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{row.source}</td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(row.createdAt)}</td>
                        <td className="px-4 py-3">
                          <select
                            className={inputClass}
                            value={row.status}
                            onChange={(e) => void handleStatusChange(row, e.target.value as GuidanceStatus)}
                          >
                            {STATUS_OPTIONS.map((value) => (
                              <option key={value} value={value}>
                                {STATUS_LABEL[value]}
                              </option>
                            ))}
                          </select>
                          <Badge variant={STATUS_BADGE_VARIANT[row.status]} className="mt-1.5">
                            {STATUS_LABEL[row.status]}
                          </Badge>
                          {row.status === "closed" && row.purgeAfter ? (
                            <p className="mt-1 text-xs text-muted-foreground">{row.purgeAfter} 파기 예정</p>
                          ) : null}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            className={inputClass}
                            value={row.assignedStaffId ?? ""}
                            onChange={(e) => void handleAssigneeChange(row, e.target.value)}
                          >
                            <option value="">미배정</option>
                            {staff.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.displayName}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <textarea
                            className={`${inputClass} w-56`}
                            rows={2}
                            value={memoDrafts[row.id] ?? row.memo ?? ""}
                            onChange={(e) => setMemoDrafts((prev) => ({ ...prev, [row.id]: e.target.value }))}
                            onBlur={() => void handleMemoBlur(row)}
                            placeholder="상담 메모"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
