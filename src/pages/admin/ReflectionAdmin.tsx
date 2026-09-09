import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { fetchAllReflections, type ReflectionRow } from "@/lib/courseReflections";
import { fetchAllCourses } from "@/lib/courses";
import { fetchMembersWithCompletion, type MemberRow } from "@/lib/members";

const inputClass =
  "rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function toCsvValue(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function downloadCsv(
  rows: ReflectionRow[],
  courseTitleById: Map<string, string>,
  memberById: Map<string, MemberRow>,
) {
  const header = ["회원", "이메일", "강좌", "느낀 점", "작성일"];
  const lines = rows.map((row) => {
    const member = memberById.get(row.userId);
    return [
      member?.displayName ?? row.userId,
      member?.email ?? "",
      courseTitleById.get(row.courseId) ?? row.courseId,
      row.body,
      formatDate(row.updatedAt),
    ]
      .map(toCsvValue)
      .join(",");
  });
  const csv = [header.join(","), ...lines].join("\n");
  // 엑셀에서 한글이 깨지지 않도록 UTF-8 BOM을 붙입니다.
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `course-reflections-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// §RequireAdmin.tsx가 이 페이지를 감싸서 staff/admin 로그인을 이미 확인했습니다.
// 사랑의 기술 강좌를 들은 회원이 남긴 "느낀 점"(course_reflections)을 강좌별로 모아 봅니다.
// 비로그인 방문자의 소감은 각자 브라우저의 localStorage에만 남아 여기 나타나지 않습니다.
export default function ReflectionAdmin() {
  const [rows, setRows] = useState<ReflectionRow[] | null>(null);
  const [courseTitleById, setCourseTitleById] = useState<Map<string, string>>(new Map());
  const [memberById, setMemberById] = useState<Map<string, MemberRow>>(new Map());
  const [courseFilter, setCourseFilter] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchAllReflections(), fetchAllCourses(), fetchMembersWithCompletion()]).then(
      ([reflectionRows, courses, members]) => {
        if (cancelled) return;
        setRows(reflectionRows);
        setCourseTitleById(new Map(courses.map((c) => [c.id, c.title])));
        setMemberById(new Map(members.map((m) => [m.id, m])));
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const courseOptions = useMemo(() => {
    if (!rows) return [];
    const ids = [...new Set(rows.map((row) => row.courseId))];
    return ids.map((id) => ({ id, title: courseTitleById.get(id) ?? id }));
  }, [rows, courseTitleById]);

  const filteredRows = useMemo(() => {
    if (!rows) return [];
    return rows.filter((row) => !courseFilter || row.courseId === courseFilter);
  }, [rows, courseFilter]);

  return (
    <>
      <SEO path="/admin/reflections" noindex />

      <AdminHeader
        title="느낀 점 관리"
        description="사랑의 기술 강좌를 들은 회원이 강좌 상세 페이지에서 남긴 '느낀 점'을 강좌별로 모아 봅니다. 로그인한 회원의 소감만 계정에 저장되어 여기 나타나고, 비로그인 방문자의 소감은 각자 브라우저에만 남습니다."
      />

      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        {!isSupabaseConfigured ? (
          <p className="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
            Supabase가 연결되어 있지 않아 느낀 점을 불러올 수 없어요. .env를 채운 뒤 다시
            시도해주세요.
          </p>
        ) : rows === null ? (
          <p className="text-sm text-muted-foreground">불러오는 중이에요…</p>
        ) : (
          <>
            <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
              <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
                강좌
                <select
                  className={inputClass}
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <option value="">전체</option>
                  {courseOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.title}
                    </option>
                  ))}
                </select>
              </label>

              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => downloadCsv(filteredRows, courseTitleById, memberById)}
                disabled={filteredRows.length === 0}
              >
                <Download className="h-3.5 w-3.5" /> CSV 내보내기 ({filteredRows.length}건)
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              총 {rows.length}건 중 {filteredRows.length}건 표시 중.
            </p>

            {filteredRows.length === 0 ? (
              <p className="mt-8 text-sm text-muted-foreground">아직 남겨진 느낀 점이 없어요.</p>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-border bg-muted/60 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">회원</th>
                      <th className="px-4 py-3">강좌</th>
                      <th className="px-4 py-3">느낀 점</th>
                      <th className="px-4 py-3 whitespace-nowrap">작성일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row) => {
                      const member = memberById.get(row.userId);
                      return (
                        <tr
                          key={`${row.userId}-${row.courseId}`}
                          className="border-b border-border align-top last:border-0"
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-foreground">
                              {member?.displayName ?? "알 수 없음"}
                            </p>
                            {member?.email ? (
                              <p className="mt-0.5 text-xs text-muted-foreground">{member.email}</p>
                            ) : null}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {courseTitleById.get(row.courseId) ?? row.courseId}
                          </td>
                          <td className="px-4 py-3">
                            <p className="max-w-md whitespace-pre-wrap leading-[1.7] text-foreground/90">
                              {row.body}
                            </p>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                            {formatDate(row.updatedAt)}
                          </td>
                        </tr>
                      );
                    })}
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
