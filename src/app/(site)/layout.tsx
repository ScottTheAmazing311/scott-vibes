import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div id="top" />
      <Header />
      {children}
      <Footer />
    </>
  );
}
