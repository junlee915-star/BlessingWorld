import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, GraduationCap } from "lucide-react";
import { toast } from "sonner";

import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CURRICULUM_FINAL_CTA, CURRICULUM_HERO, CURRICULUM_VIDEO_PLACEHOLDER } from "@/content/curriculum";
import type { Course } from "@/content/curriculum";
import { fetchPublishedCourses, getCompletedCourses, saveCompletedCourses } from "@/lib/courses";
import { fetchCompletedCourseIds, setCourseCompletion } from "@/lib/courseCompletions";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function Curriculum() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(() => new Set(getCompletedCourses()));

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
    // 로그인하면 계정(course_completions)의 이수 기록을 이 브라우저의 localStorage 기록과
    // 합칩니다 — 서버에만 있던 기록은 그대로 반영하고, 이 브라우저에만 있던 기록(로그인 전
    // 진행분)은 계정에 업로드해 다른 기기에서도 이어볼 수 있게 합니다.
    if (!user) return;
    let cancelled = false;
    (async () => {
      const serverIds = await fetchCompletedCourseIds(user.id);
      const localIds = getCompletedCourses();
      const localOnly = localIds.filter((id) => !serverIds.includes(id));
      if (localOnly.length > 0) {
        await Promise.all(localOnly.map((id) => setCourseCompletion(user.id, id, true)));
      }
      if (cancelled) return;
      const merged = [...new Set([...serverIds, ...localIds])];
      saveCompletedCourses(merged);
      setCompleted(new Set(merged));
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const total = courses?.length ?? 0;
  const doneCount = courses?.filter((course) => completed.has(course.id)).length ?? 0;
  const progressPercent = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const allDone = total > 0 && doneCount === total;

  async function toggleComplete(id: string) {
    const willComplete = !completed.has(id);
    const next = new Set(completed);
    if (willComplete) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setCompleted(next);
    saveCompletedCourses([...next]);

    if (user) {
      const ok = await setCourseCompletion(user.id, id, willComplete);
      if (!ok) toast.error("계정에 저장하지 못했어요. 이 브라우저에는 반영되었어요.");
    }
  }

  return (
    <>
      <SEO path="/curriculum" />

      <section className="mx-auto max-w-6xl px-5 pb-8 pt-16 md:px-8 md:pt-24">
        <EyebrowLabel>{CURRICULUM_HERO.eyebrow}</EyebrowLabel>
        <h1 className="mt-4 max-w-2xl text-[28px] font-bold leading-[1.3] text-foreground md:text-[40px]">
          {CURRICULUM_HERO.title}
        </h1>
        <p className="mt-4 max-w-prose text-[15px] leading-[1.8] text-muted-foreground md:text-base">
          {CURRICULUM_HERO.body}
        </p>

        {total > 0 ? (
          <div className="mt-8 max-w-md">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>내 진행 상태</span>
              <span className="font-semibold text-primary-deep">
                {doneCount} / {total}강 완료
              </span>
            </div>
            <div
              className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label="내 진행 상태"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {user ? (
                <>
                  계정에 저장되고 있어요. <Link to="/mypage" className="font-medium text-primary-deep hover:underline">마이페이지</Link>에서도 확인할 수 있어요.
                </>
              ) : (
                <>
                  이 진행 상태는 이 브라우저에만 저장돼요.{" "}
                  <Link to="/login" className="font-medium text-primary-deep hover:underline">
                    로그인
                  </Link>
                  하면 다른 기기에서도 이어볼 수 있어요.
                </>
              )}
            </p>
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
        {courses === null ? (
          <p className="text-sm text-muted-foreground">강좌를 불러오는 중이에요…</p>
        ) : courses.length === 0 ? (
          <p className="text-sm text-muted-foreground">아직 게시된 강좌가 없어요.</p>
        ) : (
          <ol className="space-y-5">
            {courses.map((course) => {
              const isDone = completed.has(course.id);
              return (
                <li
                  key={course.id}
                  className={cn(
                    "flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-card transition-colors sm:flex-row sm:items-start sm:justify-between",
                    isDone && "border-primary/40 bg-primary-soft/30",
                  )}
                >
                  <div className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-lg font-bold text-primary-deep"
                    >
                      {course.order}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-foreground">{course.title}</h2>
                        {isDone ? <Badge variant="success">완료</Badge> : null}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {course.instructor}
                        {course.durationMinutes ? ` · 약 ${course.durationMinutes}분` : ""}
                      </p>
                      <p className="mt-3 max-w-prose text-sm leading-[1.75] text-muted-foreground">
                        {course.description}
                      </p>
                      {!course.videoUrl ? (
                        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                          {CURRICULUM_VIDEO_PLACEHOLDER}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleComplete(course.id)}
                    aria-pressed={isDone}
                    className={cn(
                      "flex shrink-0 items-center gap-2 self-start rounded-full border px-4 py-2 text-sm font-medium transition-colors sm:self-center",
                      isDone
                        ? "border-primary bg-primary text-primary-foreground hover:bg-primary-deep"
                        : "border-border text-muted-foreground hover:border-primary hover:text-primary-deep",
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Circle className="h-4 w-4" aria-hidden="true" />
                    )}
                    {isDone ? "들었어요" : "다 들었어요"}
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {allDone ? (
        <section className="bg-muted/60 py-16 md:py-24">
          <div className="mx-auto flex max-w-2xl flex-col items-center px-5 text-center md:px-8">
            <h2 className="text-2xl font-bold text-foreground">{CURRICULUM_FINAL_CTA.title}</h2>
            <p className="mt-3 max-w-prose text-[15px] leading-[1.8] text-muted-foreground">
              {CURRICULUM_FINAL_CTA.body}
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link to={CURRICULUM_FINAL_CTA.cta.to}>{CURRICULUM_FINAL_CTA.cta.label}</Link>
            </Button>
          </div>
        </section>
      ) : null}
    </>
  );
}
