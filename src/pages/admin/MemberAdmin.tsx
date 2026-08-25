import { useEffect, useState } from "react";

import { SEO } from "@/components/common/SEO";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/badge";
import { fetchPublishedCourses } from "@/lib/courses";
import { fetchMembersWithCompletion, type MemberRow } from "@/lib/members";
import type { Course } from "@/content/curriculum";

const ROLE_LABEL: Record<MemberRow["role"], string> = {
  user: "회원",
  staff: "운영자",
  admin: "관리자",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

// §RequireAdmin.tsx가 이 페이지를 감싸서 staff/admin 로그인을 이미 확인했습니다.
export default function MemberAdmin() {
  const [members, setMembers] = useState<MemberRow[] | null>(null);
  const [courses, setCourses] = useState<Course[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchMembersWithCompletion(), fetchPublishedCourses()]).then(([memberRows, courseRows]) => {
      if (cancelled) return;
      setMembers(memberRows);
      setCourses(courseRows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const total = courses?.length ?? 0;

  return (
    <>
      <SEO path="/admin/members" noindex />

      <AdminHeader
        title="회원관리"
        description="가입한 전체 회원과 각자의 축복교육(§/curriculum) 이수 현황을 확인해요. 회원이 로그인한 상태에서 강좌를 '다 들었어요'로 표시해야 여기 반영됩니다 — 비로그인 방문자의 진행 상태는 그 브라우저에만 남아 여기서는 보이지 않아요."
      />

      <section className="mx-auto max-w-5xl px-5 pb-24 md:px-8">
        {members === null || courses === null ? (
          <p className="text-sm text-muted-foreground">불러오는 중이에요…</p>
        ) : members.length === 0 ? (
          <p className="text-sm text-muted-foreground">아직 가입한 회원이 없어요.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border bg-muted/60 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">이름</th>
                  <th className="px-5 py-3">이메일</th>
                  <th className="px-5 py-3">권한</th>
                  <th className="px-5 py-3">가입일</th>
                  <th className="px-5 py-3">이수한 교육</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const doneCount = courses.filter((c) => member.completedCourseIds.includes(c.id)).length;
                  return (
                    <tr key={member.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-4 font-medium text-foreground">{member.displayName}</td>
                      <td className="px-5 py-4 text-muted-foreground">{member.email ?? "—"}</td>
                      <td className="px-5 py-4">
                        <Badge variant={member.role === "user" ? "muted" : "default"}>
                          {ROLE_LABEL[member.role]}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{formatDate(member.createdAt)}</td>
                      <td className="px-5 py-4">
                        {doneCount === 0 ? (
                          <span className="text-muted-foreground">아직 없음</span>
                        ) : (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge variant={doneCount === total ? "success" : "default"}>
                              {doneCount} / {total}강
                            </Badge>
                            {courses
                              .filter((c) => member.completedCourseIds.includes(c.id))
                              .map((c) => (
                                <span
                                  key={c.id}
                                  className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                                >
                                  {c.order}강
                                </span>
                              ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
