import Sidebar from "@/components/Sidebar";
import MobileTopbar from "@/components/MobileTopbar";
import MouseSpotlight from "@/components/MouseSpotlight";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="shell">
      <MouseSpotlight />
      <Sidebar />
      <MobileTopbar />
      <main className="main-content">
        <div className="main-inner">
          <Hero />
          <Footer />
        </div>
      </main>
    </div>
  );
}
