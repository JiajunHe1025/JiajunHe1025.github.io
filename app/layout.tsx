import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const title = "何嘉俊 · Jiajun He | Speech & Multimodal AI";
  const description =
    "Personal research portfolio of Jiajun He, working across speech recognition, multimodal intelligence, and large language models.";

  return {
    metadataBase,
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
    openGraph: {
      type: "website",
      title,
      description,
      siteName: "Jiajun He · Research Portfolio",
      url: "/",
      images: [
        {
          url: "/og.png",
          width: 1731,
          height: 909,
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
}

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
