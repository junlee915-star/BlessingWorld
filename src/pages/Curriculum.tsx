import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, HelpCircle } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CURRICULUM_FINAL_CTA,
  CURRICULUM_HERO,
  CURRICULUM_VIDEO_PLACEHOLDER,
} from "@/content/curriculum";
import type { Course } from "@/content/curriculum";
import { fetchPublishedCourses, getCompletedCourses, saveCompletedCourses } from "@/lib/courses";
import { fetchCompletedCourseIds, setCourseCompletion } from "@/lib/courseCompletions";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

// 사랑의 기술 `/curriculum` — 6축 개편 §4.4.
// 목록은 진입점 역할만 하고, 재생·퀴즈·이수 처리는 강좌 상세(`/curriculum/:courseId`)가 맡습니다.
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

  return (
    <>
      <SEO path="/curriculum" />

      <section className="mx-auto max-w-6xl px-5 pb-8 pt-16 md:px-8 md:pt-24">
        <EyebrowLabel>{CURRICULUM_HERO.eyebrow}</EyebrowLabel>
        <h1 className="mt-4 max-w-2xl whitespace-pre-line text-[28px] font-bold leading-[1.3] text-foreground md:text-[40px]">
          {CURRICULUM_HERO.title}
        </h1>
        <p className="mt-3 text-sm font-medium text-primary-deep">{CURRICULUM_HERO.subtitle}</p>
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
                  계정에 저장되고 있어요.{" "}
                  <Link to="/mypage" className="font-medium text-primary-deep hover:underline">
                    마이페이지
                  </Link>
                  에서도 확인할 수 있어요.
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
          <ol className="grid gap-5 md:grid-cols-2">
            {courses.map((course) => {
              const isDone = completed.has(course.id);
              return (
                <li key={course.id}>
                  <Link
                    to={`/curriculum/${course.id}`}
                    className={cn(
                      "flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isDone ? "border-primary/40 bg-primary-soft/30" : "border-border",
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
                          {isDone ? <Badge variant="success">이수 완료</Badge> : null}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {course.instructor}
                          {course.durationMinutes ? ` · 약 ${course.durationMinutes}분` : ""}
                        </p>
                      </div>
                    </div>

                    <p className="flex-1 text-sm leading-[1.75] text-muted-foreground">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      {!course.videoUrl ? (
                        <span className="flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                          {CURRICULUM_VIDEO_PLACEHOLDER}
                        </span>
                      ) : null}
                      {course.quiz && course.quiz.length > 0 ? (
                        <span className="flex items-center gap-1.5">
                          <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          확인 퀴즈 {course.quiz.length}문항
                        </span>
                      ) : null}
                    </div>

                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-deep">
                      {isDone ? "다시 보기" : "강좌 열기"}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
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
