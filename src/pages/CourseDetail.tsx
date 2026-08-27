import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";

import { SEO } from "@/components/common/SEO";
import { EyebrowLabel } from "@/components/common/EyebrowLabel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseQuiz } from "@/components/curriculum/CourseQuiz";
import { CURRICULUM_VIDEO_PLACEHOLDER, type Course } from "@/content/curriculum";
import { fetchPublishedCourses, getCompletedCourses, saveCompletedCourses } from "@/lib/courses";
import { setCourseCompletion } from "@/lib/courseCompletions";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

// 강좌 상세 `/curriculum/:courseId` — 6축 개편 §4.4.
// 퀴즈가 있는 강좌는 통과해야 이수 처리되고, 없는 강좌는 '다 들었어요'로 처리합니다.
export default function CourseDetail() {
  const { courseId } = useParams();
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

  const course = useMemo(
    () => courses?.find((item) => item.id === courseId) ?? null,
    [courses, courseId],
  );
  const nextCourse = useMemo(() => {
    if (!courses || !course) return null;
    return courses.find((item) => item.order === course.order + 1) ?? null;
  }, [courses, course]);

  const isDone = course ? completed.has(course.id) : false;
  const hasQuiz = Boolean(course?.quiz && course.quiz.length > 0);

  async function markComplete(done: boolean, quizScore?: number) {
    if (!course) return;
    const next = new Set(completed);
    if (done) next.add(course.id);
    else next.delete(course.id);
    setCompleted(next);
    saveCompletedCourses([...next]);

    if (user) {
      const ok = await setCourseCompletion(user.id, course.id, done, quizScore);
      if (!ok) toast.error("계정에 저장하지 못했어요. 이 브라우저에는 반영되었어요.");
    }
    if (done) toast.success("이수 처리되었어요.");
  }

  if (courses === null) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-24 md:px-8">
        <p className="text-sm text-muted-foreground">강좌를 불러오는 중이에요…</p>
      </section>
    );
  }

  if (!course) {
    return (
      <>
        <SEO path="/curriculum" title="강좌를 찾을 수 없어요 — 사랑의 기술" noindex />
        <section className="mx-auto max-w-3xl px-5 py-24 text-center md:px-8">
          <h1 className="text-2xl font-bold text-foreground">강좌를 찾을 수 없어요</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            주소가 바뀌었거나 아직 공개되지 않은 강좌일 수 있어요.
          </p>
          <Button asChild className="mt-8">
            <Link to="/curriculum">전체 강좌 보기</Link>
          </Button>
        </section>
      </>
    );
  }

  return (
    <>
      <SEO
        path="/curriculum"
        title={`${course.title} — 사랑의 기술`}
        description={course.description}
      />

      <article className="mx-auto max-w-3xl px-5 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
        <Link
          to="/curriculum"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-deep hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          사랑의 기술 전체 강좌
        </Link>

        <EyebrowLabel className="mt-8">{`LESSON ${String(course.order).padStart(2, "0")}`}</EyebrowLabel>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-[26px] font-bold leading-[1.3] text-foreground md:text-[36px]">
            {course.title}
          </h1>
          {isDone ? <Badge variant="success">이수 완료</Badge> : null}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {course.instructor}
          {course.durationMinutes ? ` · 약 ${course.durationMinutes}분` : ""}
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-muted">
          {course.videoUrl ? (
            <div className="aspect-video">
              <iframe
                src={course.videoUrl}
                title={`${course.title} 강의 영상`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : (
            <p className="flex aspect-video items-center justify-center px-6 text-center text-sm text-muted-foreground">
              {CURRICULUM_VIDEO_PLACEHOLDER}
            </p>
          )}
        </div>

        <p className="prose-copy mt-8 text-[15px] md:text-[17px]">{course.description}</p>

        <div className="mt-10">
          {hasQuiz ? (
            <CourseQuiz
              questions={course.quiz ?? []}
              passScore={course.passScore}
              onPass={(score) => void markComplete(true, score)}
            />
          ) : (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-lg font-semibold text-foreground">다 들으셨나요?</h2>
              <p className="mt-2 text-sm leading-[1.75] text-muted-foreground">
                이 강좌에는 확인 퀴즈가 아직 등록되지 않았어요. 강의를 마치셨다면 아래 버튼으로
                이수 처리해주세요.
              </p>
              <button
                type="button"
                onClick={() => void markComplete(!isDone)}
                aria-pressed={isDone}
                className={cn(
                  "mt-5 flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
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
            </div>
          )}
        </div>

        <nav className="mt-12 flex flex-wrap gap-3" aria-label="다음 강좌">
          {nextCourse ? (
            <Button asChild>
              <Link to={`/curriculum/${nextCourse.id}`}>다음 강좌: {nextCourse.title}</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/center/apply?ref=curriculum">축복상담 신청하기</Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link to="/roadmap">축복로드맵에서 내 위치 보기</Link>
          </Button>
        </nav>
      </article>
    </>
  );
}
