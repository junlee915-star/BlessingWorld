import { SEO } from "@/components/common/SEO";
import { AuthForm } from "@/components/auth/AuthForm";

export default function Login() {
  return (
    <>
      <SEO path="/admin/login" noindex />
      <AuthForm variant="admin" defaultRedirectTo="/admin/curriculum" />
    </>
  );
}
