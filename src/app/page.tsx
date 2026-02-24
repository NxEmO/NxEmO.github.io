import Sidebar from "@/components/Sidebar";
import MobileTopbar from "@/components/MobileTopbar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Articles from "@/components/Articles";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="shell">
      <Sidebar />
      <MobileTopbar />
      <main className="main-content">
        <div className="main-inner">
          <Hero />
          <Experience />
          <Skills />
          <Articles />
          <Footer />
        </div>
      </main>
    </div>
  );
}
