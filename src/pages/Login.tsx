import { SEO } from "@/components/common/SEO";
import { AuthForm } from "@/components/auth/AuthForm";

// 일반 회원 로그인 `/login` — §/admin/login(관리자용)과 같은 Supabase Auth를 쓰지만,
// 이 화면은 누구나 가입해 §/mypage(내가 수강한 교육 확인)로 들어가는 용도입니다.
export default function Login() {
  return (
    <>
      <SEO path="/login" noindex />
      <AuthForm variant="member" defaultRedirectTo="/mypage" />
    </>
  );
}
