import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublishedArticle from "../../../components/report/PublishedArticle";
import { compileResearchReport } from "../../../lib/compile-research-report";
import { getPreviewReport, getPreviewSlugs } from "../../../lib/research-preview";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getPreviewSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const report = getPreviewReport(slug);
  return report ? { title: `${report.title} | 内部试读`, description: report.deck } : {};
}

export default async function PreviewReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = getPreviewReport(slug);
  if (!report) notFound();
  return <PublishedArticle report={compileResearchReport(report)} />;
}
