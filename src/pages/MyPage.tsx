import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, LogOut } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { fetchPublishedCourses } from "@/lib/courses";
import { fetchCompletedCourseIds } from "@/lib/courseCompletions";
import type { Course } from "@/content/curriculum";
import { cn } from "@/lib/utils";

// §마이페이지 `/mypage` — 로그인한 회원이 자신이 수강한 축복교육을 확인하는 화면.
// §RequireAuth.tsx가 이 페이지를 감싸서 로그인 여부를 이미 확인했습니다(역할 무관).
export default function MyPage() {
  const { user, profile, signOut } = useAuth();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [completedIds, setCompletedIds] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPublishedCourses().then((data) => {
      if (!cancelled) setCourses(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetchCompletedCourseIds(user.id).then((ids) => {
      if (!cancelled) setCompletedIds(ids);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const total = courses?.length ?? 0;
  const doneCount = completedIds ? courses?.filter((c) => completedIds.includes(c.id)).length ?? 0 : 0;
  const loadingCompletion = courses === null || completedIds === null;

  return (
    <>
      <SEO path="/mypage" noindex />

      <section className="mx-auto max-w-3xl px-5 pb-8 pt-16 md:px-8 md:pt-24">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <EyebrowLabel>MY PAGE</EyebrowLabel>
            <h1 className="mt-3 text-2xl font-bold text-foreground md:text-[32px]">
              {profile?.displayName ?? "회원"}님, 반가워요
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{profile?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void signOut()}>
            <LogOut className="h-3.5 w-3.5" /> 로그아웃
          </Button>
        </div>

        {!loadingCompletion && total > 0 ? (
          <div className="mt-8 max-w-md rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>내가 수강한 교육</span>
              <span className="font-semibold text-primary-deep">
                {doneCount} / {total}강 완료
              </span>
            </div>
            <div
              className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={total > 0 ? Math.round((doneCount / total) * 100) : 0}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${total > 0 ? Math.round((doneCount / total) * 100) : 0}%` }}
              />
            </div>
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-16 md:px-8 md:pb-24">
        {loadingCompletion ? (
          <p className="text-sm text-muted-foreground">불러오는 중이에요…</p>
        ) : total === 0 ? (
          <p className="text-sm text-muted-foreground">아직 게시된 강좌가 없어요.</p>
        ) : (
          <ol className="space-y-3">
            {courses!.map((course) => {
              const isDone = completedIds!.includes(course.id);
              return (
                <li
                  key={course.id}
                  className={cn(
                    "flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4",
                    isDone && "border-primary/40 bg-primary-soft/30",
                  )}
                >
                  <div className="flex items-center gap-3">
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    )}
                    <span className="text-sm font-medium text-foreground">{course.title}</span>
                  </div>
                  {isDone ? <Badge variant="success">완료</Badge> : null}
                </li>
              );
            })}
          </ol>
        )}

        <Button asChild variant="outline" className="mt-8">
          <Link to="/curriculum">
            {doneCount < total ? "이어서 듣기 →" : "축복교육 다시 보기 →"}
          </Link>
        </Button>
      </section>
    </>
  );
}
