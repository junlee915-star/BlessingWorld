// 지역가정교회 `/churches` — §src/pages/Churches.tsx
// Supabase의 `churches` 테이블이 연결되지 않은 환경에서는 아래 기본값을 그대로 쓰고,
// 연결되면 실제 테이블 값으로 대체됩니다. §src/lib/churches.ts 참고.

export interface Church {
  id: string;
  regionSido: string;
  regionSigungu: string;
  name: string;
  address: string;
  phone: string;
  contactName: string;
  isPublished: boolean;
}

export const CHURCH_FINDER_COPY = {
  eyebrow: "지역가정교회",
  title: "가까운 지역가정교회를 찾아보세요",
  body: "지역을 선택하면 담당 지역가정교회의 연락처를 안내해드려요. 목록에 없는 지역은 대표 연락처로 문의해주세요.",
  sidoLabel: "시·도",
  sigunguLabel: "시·군·구",
  placeholder: "지역을 선택해주세요",
  emptyResult: "이 지역에는 아직 등록된 지역가정교회 정보가 없어요. 대표 연락처로 문의해주세요.",
};

// ⚠️ 아래 항목은 실제 지역교회 정보가 아닌 예시(placeholder) 데이터입니다.
// 운영자가 /admin/churches에서 실제 지역교회 명단으로 교체해주세요.
export const DEFAULT_CHURCHES: Church[] = [
  {
    id: "seoul-gangnam",
    regionSido: "서울",
    regionSigungu: "강남구",
    name: "서울강남교회",
    address: "서울특별시 강남구 (주소 입력 필요)",
    phone: "02-000-0001",
    contactName: "담당자 미지정",
    isPublished: true,
  },
  {
    id: "gyeonggi-suwon",
    regionSido: "경기",
    regionSigungu: "수원시",
    name: "수원교회",
    address: "경기도 수원시 (주소 입력 필요)",
    phone: "031-000-0002",
    contactName: "담당자 미지정",
    isPublished: true,
  },
  {
    id: "busan-haeundae",
    regionSido: "부산",
    regionSigungu: "해운대구",
    name: "부산해운대교회",
    address: "부산광역시 해운대구 (주소 입력 필요)",
    phone: "051-000-0003",
    contactName: "담당자 미지정",
    isPublished: true,
  },
];
