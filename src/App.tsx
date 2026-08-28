import { lazy, Suspense } from "react";
import { BrowserRouter, HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { PageLayout } from "@/components/layout/PageLayout";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AuthProvider } from "@/lib/auth";

// §9.2 "라우트별 React.lazy 코드 스플리팅" — 전 페이지를 한 번에 묶으면 초기 JS 번들이
// 200KB(gzip) 목표를 넘습니다(실측 216KB). 방문자는 보통 한 번에 한 라우트만 필요하므로
// 라우트 단위로 나눠서 처음 그리는 화면의 다운로드량만 줄입니다.
const Home = lazy(() => import("@/pages/Home"));
const Guide = lazy(() => import("@/pages/Guide"));
const Curriculum = lazy(() => import("@/pages/Curriculum"));
const Stories = lazy(() => import("@/pages/Stories"));
const StoryDetail = lazy(() => import("@/pages/StoryDetail"));
const CourseDetail = lazy(() => import("@/pages/CourseDetail"));
const Roadmap = lazy(() => import("@/pages/Roadmap"));
const Values = lazy(() => import("@/pages/Values"));
const Center = lazy(() => import("@/pages/Center"));
const Churches = lazy(() => import("@/pages/Churches"));
const Documents = lazy(() => import("@/pages/Documents"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Login = lazy(() => import("@/pages/Login"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const MyPage = lazy(() => import("@/pages/MyPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const CourseAdmin = lazy(() => import("@/pages/admin/CourseAdmin"));
const ChurchAdmin = lazy(() => import("@/pages/admin/ChurchAdmin"));
const StoryAdmin = lazy(() => import("@/pages/admin/StoryAdmin"));
const FaqAdmin = lazy(() => import("@/pages/admin/FaqAdmin"));
const GuidanceAdmin = lazy(() => import("@/pages/admin/GuidanceAdmin"));
const MemberAdmin = lazy(() => import("@/pages/admin/MemberAdmin"));
const RoadmapAdmin = lazy(() => import("@/pages/admin/RoadmapAdmin"));
const StatsAdmin = lazy(() => import("@/pages/admin/StatsAdmin"));
const AdminLogin = lazy(() => import("@/pages/admin/Login"));

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
      불러오는 중이에요…
    </div>
  );
}

const queryClient = new QueryClient();

// 정적 호스팅에서 서버가 딥링크를 index.html로 리라이트해주지 않는 환경
// (예: 프리뷰 아티팩트처럼 임의 경로에 서빙되는 경우)을 위해 해시 라우팅으로
// 전환할 수 있게 했습니다. 실제 배포 시에는 기본값(BrowserRouter)을 사용하세요.
const Router = import.meta.env.VITE_USE_HASH_ROUTER === "true" ? HashRouter : BrowserRouter;

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <ScrollToTop />
            <PageLayout>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/guide" element={<Guide />} />
                  <Route path="/curriculum" element={<Curriculum />} />
                  <Route path="/curriculum/:courseId" element={<CourseDetail />} />
                  {/* 이전 경로 북마크 대비 리다이렉트 */}
                  <Route path="/guide/curriculum" element={<Navigate to="/curriculum" replace />} />
                  <Route path="/stories" element={<Stories />} />
                  <Route path="/stories/:slug" element={<StoryDetail />} />
                  <Route path="/roadmap" element={<Roadmap />} />
                  <Route path="/values" element={<Values />} />

                  {/* 축복센터 — 신청·교회찾기·서류를 한 허브 아래로 모았습니다(6축 개편 §3.2) */}
                  <Route path="/center" element={<Center />} />
                  <Route path="/center/apply" element={<Onboarding />} />
                  <Route path="/center/churches" element={<Churches />} />
                  <Route path="/center/documents" element={<Documents />} />

                  {/* 이전 경로 북마크·검색 유입 보존 — 6축 개편 전 URL들 */}
                  <Route path="/churches" element={<Navigate to="/center/churches" replace />} />
                  <Route path="/documents" element={<Navigate to="/center/documents" replace />} />
                  <Route path="/onboarding" element={<Navigate to="/center/apply" replace />} />
                  {/* 가정민원실 폐기(§13.1) — 이전 경로 북마크 대비 리다이렉트 */}
                  <Route path="/civil-affairs" element={<Navigate to="/center/churches" replace />} />
                  <Route
                    path="/civil-affairs/blessing-marriage"
                    element={<Navigate to="/center/churches" replace />}
                  />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/reset-password"
                    element={
                      <RequireAuth>
                        <ResetPassword />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/mypage"
                    element={
                      <RequireAuth>
                        <MyPage />
                      </RequireAuth>
                    }
                  />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin/curriculum"
                    element={
                      <RequireAdmin>
                        <CourseAdmin />
                      </RequireAdmin>
                    }
                  />
                  <Route
                    path="/admin/churches"
                    element={
                      <RequireAdmin>
                        <ChurchAdmin />
                      </RequireAdmin>
                    }
                  />
                  <Route
                    path="/admin/stories"
                    element={
                      <RequireAdmin>
                        <StoryAdmin />
                      </RequireAdmin>
                    }
                  />
                  <Route
                    path="/admin/guidance"
                    element={
                      <RequireAdmin>
                        <GuidanceAdmin />
                      </RequireAdmin>
                    }
                  />
                  <Route
                    path="/admin/faq"
                    element={
                      <RequireAdmin>
                        <FaqAdmin />
                      </RequireAdmin>
                    }
                  />
                  <Route
                    path="/admin/members"
                    element={
                      <RequireAdmin>
                        <MemberAdmin />
                      </RequireAdmin>
                    }
                  />
                  <Route
                    path="/admin/roadmap"
                    element={
                      <RequireAdmin>
                        <RoadmapAdmin />
                      </RequireAdmin>
                    }
                  />
                  <Route
                    path="/admin/stats"
                    element={
                      <RequireAdmin>
                        <StatsAdmin />
                      </RequireAdmin>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </PageLayout>
            <Toaster richColors position="top-center" />
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
