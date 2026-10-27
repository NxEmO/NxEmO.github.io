import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import WritingSection from "@/components/WritingSection";
import { getWritingSummaries } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Writing | NxEmO",
  description: "NxEmO 的文章、开发笔记与知乎文章索引。",
};

export default async function WritingPage() {
  const articles = await getWritingSummaries();

  return (
    <div className="shell">
      <Sidebar articleCount={articles.length} />
      <main id="main-content" className="main-content">
        <div className="main-inner">
          <WritingSection articles={articles} />
          <Footer />
        </div>
      </main>
    </div>
  );
}

