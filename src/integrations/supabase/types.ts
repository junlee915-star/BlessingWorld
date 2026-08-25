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
          created_at: string;
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
          | "created_at"
        > &
          Partial<
            Pick<
              Database["public"]["Tables"]["guidance_requests"]["Row"],
              "status" | "source" | "user_id" | "email"
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
        Insert: Omit<Database["public"]["Tables"]["blessing_progress"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["blessing_progress"]["Row"]>;
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
        Insert: Omit<Database["public"]["Tables"]["faqs"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["faqs"]["Row"]>;
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
    };
    // @supabase/supabase-js(최신)의 쿼리 빌더가 스키마 타입에서 요구하는 필드입니다.
    // 이 프로젝트는 뷰/함수를 쓰지 않아 비워둡니다 — 없으면 모든 .from() 호출의 타입이
    // 조용히 `never`로 무너지니 지우지 마세요.
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
