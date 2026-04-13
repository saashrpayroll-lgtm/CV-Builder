import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeAI — Smart AI-Powered Resume Builder",
  description:
    "Create stunning, ATS-optimized resumes with AI-powered suggestions. 20+ premium templates, instant PDF/DOCX export, and smart content generation.",
  keywords: [
    "resume builder",
    "AI resume",
    "CV maker",
    "ATS friendly",
    "professional resume",
  ],
  openGraph: {
    title: "ResumeAI — Build Your Perfect Resume with AI",
    description:
      "Create stunning, ATS-optimized resumes in minutes with AI assistance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: "500",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
