import { SectionHeading } from "@/components/common/SectionHeading";
import { HOME_VIDEO } from "@/content/home";

// 홈 소개 영상(6축 개편 §4.1 감정 블록) — 히어로·인트로 다음에 배치합니다.
// 임베드 방식은 강좌 상세(CourseDetail)와 동일하게 맞춰, 영상 소스를 한 곳에서 관리합니다.
export function HomeVideo() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
      <SectionHeading
        eyebrow={HOME_VIDEO.eyebrow}
        title={HOME_VIDEO.title}
        description={HOME_VIDEO.body}
        align="center"
        className="mx-auto"
      />

      <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-border bg-muted shadow-card">
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${HOME_VIDEO.youtubeId}`}
            title={HOME_VIDEO.iframeTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="h-full w-full"
          />
        </div>
      </div>
    </section>
  );
}
