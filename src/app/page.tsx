import TravelingCard from "@/components/motion/TravelingCard";
import Hero from "@/components/home/Hero";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import Manifesto from "@/components/home/Manifesto";
import FeaturedGame from "@/components/home/FeaturedGame";
import Events from "@/components/home/Events";
import HowItWorks from "@/components/home/HowItWorks";
import Community from "@/components/home/Community";
import JoinCTA from "@/components/home/JoinCTA";
import { backs } from "@/data/dharma";

export default function HomePage() {
  return (
    <>
      <TravelingCard
        front={{ src: backs.clan.small, alt: "Order of Dharma clan card back — sun and moon" }}
        back={{ src: backs.phases.small, alt: "Order of Dharma phases card" }}
      />
      <Hero />
      <MarqueeStrip />
      <Manifesto />
      <FeaturedGame />
      <Events />
      <HowItWorks />
      <Community />
      <JoinCTA />
    </>
  );
}
