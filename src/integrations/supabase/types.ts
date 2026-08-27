// 손으로 작성한 타입 정의입니다 (§7.2). 실제 Supabase 프로젝트를 연결한 뒤에는
// `supabase gen types typescript` 로 재생성해 이 파일을 교체하는 것을 권장합니다.

export type Gender = "female" | "male";
export type ProfileRole = "user" | "staff" | "admin";
export type GuidanceStatus =
  | "received"
  | "assigned"
  | "contacted"
  | "in_progress"
  | "closed"
  | "opted_out";
export type StoryCategory = "interview" | "case" | "video";
export type CommunityCategory = "goods" | "talent" | "together" | "chat";
export type CommunityMethod = "direct" | "delivery" | "online";
export type CommunityStatus = "open" | "reserved" | "completed";
export type CommunityRequestStatus = "pending" | "accepted" | "rejected" | "cancelled";
export type VerificationStatus = "pending" | "approved" | "rejected";
export type BlessingStepStatus = "not_started" | "in_progress" | "completed";
/** 축복상담 신청서에서 고르는 상담 방식 — 일정 예약 대신 방식만 받습니다(6축 개편 §4.6). */
export type ConsultMethod = "visit" | "phone" | "video";

/** 사랑의 기술 강좌별 확인 퀴즈 문항. `courses.quiz`(jsonb)에 배열로 저장됩니다. */
export interface QuizQuestion {
  q: string;
  choices: string[];
  /** 정답 보기의 인덱스(0부터). */
  answer: number;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          email: string | null;
          phone: string | null;
          gender: Gender | null;
          birth_year: number | null;
          region_sido: string | null;
          region_sigungu: string | null;
          is_verified_member: boolean;
          role: ProfileRole;
          created_at: string;
        };
        Insert: Partial<Omit<Database["public"]["Tables"]["profiles"]["Row"], "id">> & {
          id: string;
          display_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      guidance_requests: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          phone: string;
          email: string | null;
          gender: Gender;
          birth_year: number;
          region_sido: string;
          region_sigungu: string;
          status: GuidanceStatus;
          assigned_staff_id: string | null;
          assigned_at: string | null;
          contacted_at: string | null;
          memo: string | null;
          privacy_agreed_at: string;
          source: string;
          purge_after: string | null;
          /** status가 'closed'로 바뀐 시각. §0010_guidance_admin.sql 트리거가 자동으로 채우고,
           *  같은 트리거가 이 값 + 1년으로 purge_after도 함께 계산합니다(§7.4). */
          closed_at: string | null;
          created_at: string;
          /** §P-04↔§P-07 연계: 제출 시점에 이 브라우저에서 이수 완료된 강좌 id 목록(§lib/courses.ts). */
          completed_courses: string[] | null;
          /** 희망 상담 방식(6축 개편 §4.6). 개편 이전 신청 건은 null입니다. */
          consult_method: ConsultMethod | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["guidance_requests"]["Row"],
          | "id"
          | "status"
          | "assigned_staff_id"
          | "assigned_at"
          | "contacted_at"
          | "memo"
          | "source"
          | "purge_after"
          | "closed_at"
          | "created_at"
        > &
          Partial<
            Pick<
              Database["public"]["Tables"]["guidance_requests"]["Row"],
              "status" | "source" | "user_id" | "email" | "completed_courses" | "consult_method"
            >
          >;
        Update: Partial<Database["public"]["Tables"]["guidance_requests"]["Row"]>;
      };
      stories: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          body: string | null;
          cover_image_url: string | null;
          category: StoryCategory;
          family_name: string | null;
          region: string | null;
          /** 카드 제목으로 쓰는 가정의 한마디(6축 개편 §4.3). 비어 있으면 title로 폴백합니다. */
          quote: string | null;
          /** 축복 유형 배지(예: 합동축복, 축복자녀). category(콘텐츠 형식)와는 다른 축입니다. */
          blessing_type: string | null;
          view_count: number;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["stories"]["Row"]> & {
          slug: string;
          title: string;
          category: StoryCategory;
        };
        Update: Partial<Database["public"]["Tables"]["stories"]["Row"]>;
      };
      community_posts: {
        Row: {
          id: string;
          author_id: string;
          category: CommunityCategory;
          title: string;
          body: string;
          image_urls: string[] | null;
          region_sido: string;
          region_sigungu: string;
          method: CommunityMethod | null;
          status: CommunityStatus;
          view_count: number;
          like_count: number;
          report_count: number;
          recommend_score: number | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["community_posts"]["Row"],
          | "id"
          | "status"
          | "view_count"
          | "like_count"
          | "report_count"
          | "recommend_score"
          | "completed_at"
          | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["community_posts"]["Row"]>;
      };
      community_requests: {
        Row: {
          id: string;
          post_id: string;
          requester_id: string;
          message: string | null;
          status: CommunityRequestStatus;
          accepted_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["community_requests"]["Row"],
          "id" | "status" | "accepted_at"
        >;
        Update: Partial<Database["public"]["Tables"]["community_requests"]["Row"]>;
      };
      community_comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          body: string;
          parent_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["community_comments"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["community_comments"]["Row"]>;
      };
      member_verifications: {
        Row: {
          id: string;
          user_id: string;
          birth_date: string | null;
          district: string | null;
          church: string | null;
          member_no: string | null;
          status: VerificationStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["member_verifications"]["Row"],
          "id" | "status" | "reviewed_by" | "reviewed_at"
        >;
        Update: Partial<Database["public"]["Tables"]["member_verifications"]["Row"]>;
      };
      blessing_progress: {
        Row: {
          id: string;
          user_id: string;
          step_key: string;
          status: BlessingStepStatus;
          completed_at: string | null;
          updated_by: string | null;
        };
        // Omit<Row,"id"> 형태로 두면 설치된 @supabase/supabase-js의 타입이 select() 결과까지
        // `never`로 좁혀버립니다(courses/course_completions와 같은 사안 — 커밋 dcceb89).
        // `Partial<Row> & {필수 키}` 형태로 맞춰서 피합니다.
        Insert: Partial<Database["public"]["Tables"]["blessing_progress"]["Row"]> & {
          user_id: string;
          step_key: string;
        };
        Update: Partial<Database["public"]["Tables"]["blessing_progress"]["Row"]>;
        Relationships: [];
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          sort_order: number;
          is_default_visible: boolean;
          is_published: boolean;
        };
        // courses/churches와 같은 `Partial<Row> & {필수 키}` 형태 — §src/lib/courses.ts saveCourses()
        // 주석 참고(설치된 @supabase/supabase-js의 upsert() 타입 버그 우회에도 필요).
        Insert: Partial<Database["public"]["Tables"]["faqs"]["Row"]> & {
          id: string;
          question: string;
          answer: string;
        };
        Update: Partial<Database["public"]["Tables"]["faqs"]["Row"]>;
        Relationships: [];
      };
      regions: {
        Row: {
          code: string;
          sido: string;
          sigungu: string;
          staff_id: string | null;
        };
        Insert: Database["public"]["Tables"]["regions"]["Row"];
        Update: Partial<Database["public"]["Tables"]["regions"]["Row"]>;
      };
      courses: {
        Row: {
          id: string;
          order_no: number;
          title: string;
          instructor: string | null;
          duration_minutes: number | null;
          description: string | null;
          video_url: string | null;
          is_published: boolean;
          /** 강좌 확인 퀴즈 문항. 비어 있으면 퀴즈 없이 '시청 완료'로 이수 처리합니다. */
          quiz: QuizQuestion[] | null;
          /** 이수 처리 기준 점수(%). 기본 60. */
          pass_score: number | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["courses"]["Row"]> & {
          id: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["courses"]["Row"]>;
        // @supabase/supabase-js(최신)의 쿼리 빌더 타입이 요구하는 필드입니다.
        // 이 프로젝트는 아직 FK 관계를 타입에 반영하지 않아 빈 배열로 둡니다.
        Relationships: [];
      };
      churches: {
        Row: {
          id: string;
          region_sido: string;
          region_sigungu: string;
          name: string;
          address: string | null;
          phone: string | null;
          contact_name: string | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["churches"]["Row"]> & {
          id: string;
          region_sido: string;
          region_sigungu: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["churches"]["Row"]>;
        Relationships: [];
      };
      /** §7.4 개인정보 자동 파기(purge-guidance-requests 함수)가 남기는 건수 로그. 개인식별정보는 없습니다. */
      audit_log: {
        Row: {
          id: string;
          action: string;
          count: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["audit_log"]["Row"]> & {
          action: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_log"]["Row"]>;
        Relationships: [];
      };
      roadmap_steps: {
        Row: {
          /** 'step_01' ~ 'step_08' — blessing_progress.step_key와 같은 키를 씁니다. */
          key: string;
          order_no: number;
          title: string;
          description: string;
          /** 예: "1~2주". 확정되지 않았으면 null — 화면에서 기간 배지를 생략합니다. */
          duration_label: string | null;
          link_to: string | null;
          link_label: string | null;
          is_published: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["roadmap_steps"]["Row"]> & {
          key: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["roadmap_steps"]["Row"]>;
        Relationships: [];
      };
      site_stats: {
        Row: {
          key: string;
          label: string;
          value: number | null;
          /** 기준일. null이면 홈에서 해당 카드를 렌더하지 않습니다(추정치 노출 금지). */
          basis_date: string | null;
          unit: string | null;
          display_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["site_stats"]["Row"]> & {
          key: string;
          label: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_stats"]["Row"]>;
        Relationships: [];
      };
      course_completions: {
        Row: {
          user_id: string;
          course_id: string;
          completed_at: string;
          /** 확인 퀴즈 점수(%). 퀴즈가 없는 강좌는 null입니다. */
          quiz_score: number | null;
        };
        // Pick<Row, ...> 조합으로 쓰면 설치된 @supabase/supabase-js(2.112.x)의 타입 추론이
        // 이 프로젝트의 손으로 쓴 Database 타입과 맞물려 select() 결과까지 `never`로
        // 좁혀버리는 라이브러리 쪽 버그가 있습니다 — courses/churches와 같은
        // `Partial<Row> & {필수 키}` 형태로 맞춰서 피합니다.
        Insert: Partial<Database["public"]["Tables"]["course_completions"]["Row"]> & {
          user_id: string;
          course_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["course_completions"]["Row"]>;
        Relationships: [];
      };
    };
    // @supabase/supabase-js(최신)의 쿼리 빌더가 스키마 타입에서 요구하는 필드입니다.
    // 이 프로젝트는 뷰/함수를 쓰지 않아 비워둡니다 — 없으면 모든 .from() 호출의 타입이
    // 조용히 `never`로 무너지니 지우지 마세요.
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
