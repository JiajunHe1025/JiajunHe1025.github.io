import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "何嘉俊 · Jiajun He | Speech & Multimodal AI";
const description =
  "Personal research portfolio of Jiajun He, working across speech recognition, multimodal intelligence, and large language models.";

export const metadata: Metadata = {
  metadataBase: new URL("https://jiajunhe1025.github.io"),
  title,
  description,
  keywords: [
    "Jiajun He",
    "何嘉俊",
    "speech recognition",
    "multimodal AI",
    "ASR",
    "speech emotion recognition",
    "large language models",
  ],
  authors: [{ name: "Jiajun He" }],
  creator: "Jiajun He",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title,
    description,
    siteName: "Jiajun He · Research Portfolio",
    url: "/",
    images: [
        {
          url: "/og.png",
          width: 900,
          height: 473,
          alt: "Jiajun He — Speech, Language, and Multimodal AI",
        },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
