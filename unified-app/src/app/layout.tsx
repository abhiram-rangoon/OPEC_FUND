import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthWrapper from "@/components/AuthWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OilFund App",
  description: "Clean Energy Investments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F0FBF7]`}>
        <AuthWrapper>
          <div className="max-w-md mx-auto min-h-screen bg-white relative shadow-xl overflow-hidden">
            {children}
          </div>
        </AuthWrapper>
      </body>
    </html>
  );
}
