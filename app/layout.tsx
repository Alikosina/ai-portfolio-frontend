import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alex Rivera — Software Engineer",
  description:
    "Backend-leaning full-stack engineer specializing in distributed systems, developer tooling, and pragmatic React front ends.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
