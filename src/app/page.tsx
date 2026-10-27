import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import WritingSection from "@/components/WritingSection";
import { getWritingSummaries } from "@/lib/articles";

export default async function Home() {
  const articles = await getWritingSummaries();

  return (
    <div className="shell">
      <Sidebar articleCount={articles.length} />
      <main id="main-content" className="main-content">
        <div className="main-inner">
          <Hero articleCount={articles.length} />
          <WritingSection articles={articles} compact />
          <Footer />
        </div>
      </main>
    </div>
  );
}
