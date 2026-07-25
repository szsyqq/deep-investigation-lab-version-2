import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublishedArticle from "../../../components/report/PublishedArticle";
import reports from "../../../content/published-reports.json";
import { publishedReportContent } from "../../../content/published";

export const dynamic = "force-static";
export const dynamicParams = false;

type Slug = keyof typeof publishedReportContent;

export function generateStaticParams() {
  return reports.map((report) => ({ slug: report.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const report = reports.find((item) => item.slug === slug);
  return report ? { title: `${report.title} | 深度调查档案室`, description: report.desc } : {};
}

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const metadata = reports.find((item) => item.slug === slug);
  const content = publishedReportContent[slug as Slug];
  if (!metadata || !content) notFound();
  return <PublishedArticle report={{ ...metadata, ...content }} />;
}
