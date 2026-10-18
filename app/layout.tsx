import type { Metadata } from "next";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/vazirmatn/wght.css";
import "./globals.css";
import "./appearance.css";
import { AppearancePreference } from "@/components/appearance-preference";
import {LearnerOnboardingGate} from "@/components/learner-onboarding-gate";
import {LearningActivityTracker} from "@/components/learning-activity-tracker";
import {PwaManager} from "@/components/pwa-manager";
import {getChatGPTUser} from "@/app/chatgpt-auth";
import { Header, Footer } from "@/components/chrome";

export const metadata: Metadata = {
  title: "LingoLive — Learn English your way",
  description: "Practical English courses, lessons, stories, and speaking practice for every level.",
  manifest: "/manifest.webmanifest",
  themeColor: "#2563e8",
  appleWebApp: {
    capable: true,
    title: "LingoLive",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const signedIn=!!await getChatGPTUser();
  return (
    <html lang="en">
      <body className="antialiased"><AppearancePreference/><PwaManager/><div className="app-layout"><Header/><div className="app-main"><main><LearnerOnboardingGate>{children}</LearnerOnboardingGate><LearningActivityTracker signedIn={signedIn}/></main><Footer/></div></div></body>
    </html>
  );
}
