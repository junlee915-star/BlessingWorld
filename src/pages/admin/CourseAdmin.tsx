import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import type { Course } from "@/content/curriculum";
import { fetchAllCourses, saveCourses } from "@/lib/courses";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function makeEmptyCourse(order: number): Course {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `course-${Date.now()}`,
    order,
    title: "",
    instructor: "",
    durationMinutes: 20,
    description: "",
    videoUrl: "",
    isPublished: true,
  };
}

function withReindexedOrder(courses: Course[]): Course[] {
  return courses.map((course, index) => ({ ...course, order: index + 1 }));
}

// §RequireAdmin.tsx가 이 페이지를 감싸서 staff/admin 로그인을 이미 확인했습니다.
export default function CourseAdmin() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAllCourses().then((data) => {
      if (!cancelled) setCourses(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function updateCourse(id: string, patch: Partial<Course>) {
    setCourses((prev) => (prev ? prev.map((c) => (c.id === id ? { ...c, ...patch } : c)) : prev));
  }

  function moveCourse(id: string, direction: -1 | 1) {
    setCourses((prev) => {
      if (!prev) return prev;
      const index = prev.findIndex((c) => c.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return withReindexedOrder(next);
    });
  }

  function addCourse() {
    setCourses((prev) => withReindexedOrder([...(prev ?? []), makeEmptyCourse((prev?.length ?? 0) + 1)]));
  }

  function removeCourse(id: string) {
    setCourses((prev) => (prev ? withReindexedOrder(prev.filter((c) => c.id !== id)) : prev));
  }

  async function handleSave() {
    if (!courses) return;
    const emptyTitle = courses.find((c) => c.title.trim().length === 0);
    if (emptyTitle) {
      toast.error("제목이 비어 있는 강좌가 있어요. 제목을 입력해주세요.");
      return;
    }
    setSaving(true);
    try {
      const target = await saveCourses(courses);
      if (target === "supabase") {
        toast.success("저장했어요. Supabase에 반영되어 모든 방문자에게 보여요.");
      } else {
        toast.success("이 브라우저에 저장했어요.", {
          description: "Supabase가 연결되면 모든 방문자에게 반영되는 저장으로 자동 전환돼요.",
        });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SEO path="/admin/curriculum" noindex />

      <AdminHeader
        title="교육과정 관리 — 축복교육 강좌"
        description={
          <>
            /curriculum 페이지에 노출되는 강좌 목록을 추가·수정·삭제·순서 변경할 수 있어요.
            {isSupabaseConfigured
              ? " 저장하면 Supabase에 반영되어 모든 방문자에게 보여요."
              : " 현재 Supabase가 연결되어 있지 않아 저장하면 이 브라우저에만 임시로 보관돼요."}
          </>
        }
      />

      <section className="mx-auto max-w-4xl px-5 pb-24 md:px-8">
        {courses === null ? (
          <p className="text-sm text-muted-foreground">불러오는 중이에요…</p>
        ) : (
          <div className="space-y-5">
            {courses.map((course, index) => (
              <div key={course.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary-deep">
                    {course.order}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveCourse(course.id, -1)}
                      disabled={index === 0}
                      aria-label="위로 이동"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted disabled:pointer-events-none disabled:opacity-30"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCourse(course.id, 1)}
                      disabled={index === courses.length - 1}
                      aria-label="아래로 이동"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted disabled:pointer-events-none disabled:opacity-30"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCourse(course.id)}
                      aria-label="강좌 삭제"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">제목</span>
                    <input
                      className={inputClass}
                      value={course.title}
                      onChange={(e) => updateCourse(course.id, { title: e.target.value })}
                      placeholder="예: 1강. 축복결혼이란 무엇인가"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">강사 / 담당</span>
                    <input
                      className={inputClass}
                      value={course.instructor}
                      onChange={(e) => updateCourse(course.id, { instructor: e.target.value })}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-foreground">재생 시간(분)</span>
                    <input
                      type="number"
                      min={0}
                      className={inputClass}
                      value={course.durationMinutes}
                      onChange={(e) =>
                        updateCourse(course.id, { durationMinutes: Number(e.target.value) || 0 })
                      }
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">소개</span>
                    <textarea
                      className={inputClass}
                      rows={2}
                      value={course.description}
                      onChange={(e) => updateCourse(course.id, { description: e.target.value })}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                    <span className="font-medium text-foreground">영상 URL (선택)</span>
                    <input
                      className={inputClass}
                      value={course.videoUrl}
                      onChange={(e) => updateCourse(course.id, { videoUrl: e.target.value })}
                      placeholder="비워두면 '영상 준비 중'으로 표시돼요"
                    />
                  </label>

                  <label className="flex items-center gap-2 text-sm sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={course.isPublished}
                      onChange={(e) => updateCourse(course.id, { isPublished: e.target.checked })}
                      className="h-4 w-4 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <span>공개 (체크 해제하면 방문자에게 보이지 않아요)</span>
                  </label>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addCourse}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary-deep"
            >
              <Plus className="h-4 w-4" /> 강좌 추가
            </button>

            <div className="flex justify-end gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving} size="lg">
                {saving ? "저장 중…" : "저장하기"}
              </Button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
