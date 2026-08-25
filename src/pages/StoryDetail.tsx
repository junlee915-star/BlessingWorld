import { useParams } from "react-router-dom";
import { BookOpen } from "lucide-react";

import { SEO } from "@/components/common/SEO";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function StoryDetail() {
  const { slug } = useParams();

  return (
    <>
      <SEO path="/stories" />
      <ComingSoon
        icon={BookOpen}
        title="이야기를 준비하고 있어요"
        description={`아직 게시된 이야기가 없어요${slug ? ` (요청하신 글: ${slug})` : ""}. 콘텐츠가 등록되면 이 페이지에서 만나보실 수 있습니다.`}
        backTo={{ label: "행복의 꽃으로 돌아가기", to: "/stories" }}
      />
    </>
  );
}
