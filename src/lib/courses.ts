// 축복교육 강좌 데이터 접근 계층.
// Supabase가 연결되어 있으면 `courses` 테이블을 쓰고, 연결되지 않았거나(§client.ts의
// isSupabaseConfigured) 요청이 실패하면 이 브라우저의 localStorage → content/curriculum.ts
// 기본값 순으로 내려갑니다. 이 프로젝트에는 아직 관리자 로그인 화면이 없어서, Supabase
// 미연결 상태의 "관리"는 이 브라우저에만 반영되는 임시 저장이라는 점을 UI에서 알려주세요.
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { DEFAULT_COURSES, type Course } from "@/content/curriculum";

const LOCAL_STORAGE_KEY = "blessingworld:courses";

export type CoursePersistTarget = "supabase" | "local";

function readLocalOverride(): Course[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Course[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeLocalOverride(courses: Course[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(courses));
  } catch {
    // 프라이빗 모드 등으로 저장 공간을 쓸 수 없는 경우 조용히 무시합니다.
  }
}

function rowToCourse(row: {
  id: string;
  order_no: number;
  title: string;
  instructor: string | null;
  duration_minutes: number | null;
  description: string | null;
  video_url: string | null;
  is_published: boolean;
}): Course {
  return {
    id: row.id,
    order: row.order_no,
    title: row.title,
    instructor: row.instructor ?? "",
    durationMinutes: row.duration_minutes ?? 0,
    description: row.description ?? "",
    videoUrl: row.video_url ?? "",
    isPublished: row.is_published,
  };
}

function courseToRow(course: Course) {
  return {
    id: course.id,
    order_no: course.order,
    title: course.title,
    instructor: course.instructor,
    duration_minutes: course.durationMinutes,
    description: course.description,
    video_url: course.videoUrl,
    is_published: course.isPublished,
  };
}

function sortByOrder(courses: Course[]): Course[] {
  return [...courses].sort((a, b) => a.order - b.order);
}

/** 공개 페이지(/guide/curriculum)에서 씁니다 — 게시된 강좌만 정렬해 돌려줍니다. */
export async function fetchPublishedCourses(): Promise<Course[]> {
  const all = await fetchAllCourses();
  return sortByOrder(all.filter((course) => course.isPublished));
}

/** 관리 화면(/admin/curriculum)에서 씁니다 — 비공개 강좌도 함께 돌려줍니다. */
export async function fetchAllCourses(): Promise<Course[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("order_no", { ascending: true });
    if (!error && data) {
      return data.map(rowToCourse);
    }
  }
  return sortByOrder(readLocalOverride() ?? DEFAULT_COURSES);
}

/**
 * 강좌 목록 전체를 저장합니다. Supabase가 연결돼 있으면 upsert하고(및 로컬에서 지운 강좌는
 * 삭제), 아니면 이 브라우저의 localStorage에만 저장합니다. 반환값으로 실제 어디에
 * 저장됐는지 알려주므로, 관리 화면에서 "이 브라우저에만 저장됨" 안내에 사용하세요.
 */
export async function saveCourses(courses: Course[]): Promise<CoursePersistTarget> {
  if (isSupabaseConfigured && supabase) {
    const rows = courses.map(courseToRow);
    // 설치된 @supabase/supabase-js(2.112.x)의 upsert() 타입이 이 프로젝트의 손으로 쓴
    // Database 타입과 맞물리면 Insert 타입을 `never`로 좁혀버리는 라이브러리 쪽 타입 버그가
    // 있습니다(select/delete는 영향 없음). 실제 요청은 정상 동작하므로 이 한 줄만 우회합니다.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 라이브러리 타입 버그 우회, 위 주석 참고
    const { error: upsertError } = await (supabase.from("courses") as any).upsert(rows);
    const ids = courses.map((course) => course.id);
    const { error: deleteError } =
      ids.length > 0
        ? await supabase.from("courses").delete().not("id", "in", `(${ids.join(",")})`)
        : { error: null };
    if (!upsertError && !deleteError) {
      return "supabase";
    }
  }
  writeLocalOverride(courses);
  return "local";
}

const PROGRESS_STORAGE_KEY = "blessingworld:course-progress";

/**
 * 이 브라우저에서 "다 들었어요"로 표시한 강좌 id 목록. 로그인 없이 localStorage에만
 * 저장됩니다(§P-04②). /curriculum이 진행률 표시에, /onboarding이 §P-07 연계(교육 이수
 * 여부를 안내 신청 페이로드에 포함)에 각각 이 값을 읽습니다.
 */
export function getCompletedCourses(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** getCompletedCourses()가 읽는 것과 같은 localStorage 키에 완료한 강좌 id 목록을 저장합니다. */
export function saveCompletedCourses(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // 프라이빗 모드 등으로 저장 공간을 쓸 수 없는 경우 조용히 무시합니다.
  }
}

/**
 * courseIds가 비어있지 않고 전부 완료 목록에 있으면 true. completed를 생략하면
 * getCompletedCourses()로 이 브라우저의 현재 값을 읽습니다.
 */
export function isAllCompleted(
  courseIds: string[],
  completed: string[] = getCompletedCourses(),
): boolean {
  if (courseIds.length === 0) return false;
  const done = new Set(completed);
  return courseIds.every((id) => done.has(id));
}
