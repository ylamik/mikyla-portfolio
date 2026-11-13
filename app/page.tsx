import IntroScreen from "@/components/intro/IntroScreen";
import ButterflyLayer from "@/components/effects/ButterflyLayer";
import CursorTrail from "@/components/effects/CursorTrail";
import Reveal from "@/components/effects/Reveal";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Skills from "@/components/sections/Skills";
import Beyond from "@/components/sections/Beyond";
import Leadership from "@/components/sections/Leadership";
import Contact from "@/components/sections/Contact";
import Divider from "@/components/ui/Divider";

export default function Home() {
  return (
    <>
      <IntroScreen />
      <ButterflyLayer />
      <CursorTrail />
      <Reveal />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Divider variant="rose" />
        <Work />
        <Skills />
        <Beyond />
        <Leadership />
        <Divider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
