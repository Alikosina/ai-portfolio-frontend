import AuthForm from "../components/AuthForm";
import PageShell from "../components/PageShell";

export const metadata = { title: "Sign up · Alik Sloyan" };

export default function SignupPage() {
  return (
    <PageShell>
      <AuthForm mode="signup" />
    </PageShell>
  );
}
