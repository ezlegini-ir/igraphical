import type { Metadata } from "next";
import "@igraph/ui/globals.css";
import "./fonts.css";
import { Toaster } from "@igraph/ui/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html style={{ fontFamily: "KalamehWeb" }} className={`antialiased`}>
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    default: "Tutor - iGraphical",
    template: "%s - iGraphical",
  },
  icons: {
    icon: "/favicon.svg",
  },
  description: "iGraphical Panel",
};
