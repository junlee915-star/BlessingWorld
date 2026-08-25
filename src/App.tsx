import { BrowserRouter, HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { PageLayout } from "@/components/layout/PageLayout";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AuthProvider } from "@/lib/auth";

import Home from "@/pages/Home";
import Guide from "@/pages/Guide";
import Curriculum from "@/pages/Curriculum";
import Stories from "@/pages/Stories";
import StoryDetail from "@/pages/StoryDetail";
import Churches from "@/pages/Churches";
import Onboarding from "@/pages/Onboarding";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Login from "@/pages/Login";
import MyPage from "@/pages/MyPage";
import NotFound from "@/pages/NotFound";
import CourseAdmin from "@/pages/admin/CourseAdmin";
import ChurchAdmin from "@/pages/admin/ChurchAdmin";
import MemberAdmin from "@/pages/admin/MemberAdmin";
import AdminLogin from "@/pages/admin/Login";

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
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/curriculum" element={<Curriculum />} />
                {/* 이전 경로 북마크 대비 리다이렉트 */}
                <Route path="/guide/curriculum" element={<Navigate to="/curriculum" replace />} />
                <Route path="/stories" element={<Stories />} />
                <Route path="/stories/:slug" element={<StoryDetail />} />
                <Route path="/churches" element={<Churches />} />
                {/* 가정민원실 폐기(§13.1) — 이전 경로 북마크 대비 리다이렉트 */}
                <Route path="/civil-affairs" element={<Navigate to="/churches" replace />} />
                <Route
                  path="/civil-affairs/blessing-marriage"
                  element={<Navigate to="/churches" replace />}
                />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/login" element={<Login />} />
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
                  path="/admin/members"
                  element={
                    <RequireAdmin>
                      <MemberAdmin />
                    </RequireAdmin>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageLayout>
            <Toaster richColors position="top-center" />
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
