import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getReportBySlug, reports } from "../reports";
import { ReportPage } from "./ReportPage";

type ReportRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return reports.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ReportRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const report = getReportBySlug(slug);

  if (!report) {
    return { title: "技术笔记 · Jiajun He" };
  }

  return {
    title: `${report.title.zh} · Jiajun He`,
    description: report.summary.zh,
    alternates: { canonical: `/notes/${report.slug}/` },
    openGraph: {
      type: "article",
      title: report.title.zh,
      description: report.summary.zh,
      publishedTime: report.published,
      authors: ["Jiajun He"],
      tags: report.tags,
    },
  };
}

export default async function Page({ params }: ReportRouteProps) {
  const { slug } = await params;
  const report = getReportBySlug(slug);

  if (!report) notFound();

  return <ReportPage report={report} />;
}
