import AuthForm from "../components/AuthForm";
import PageShell from "../components/PageShell";

export const metadata = { title: "Log in · Alik Sloyan" };

export default function LoginPage() {
  return (
    <PageShell>
      <AuthForm mode="login" />
    </PageShell>
  );
}
