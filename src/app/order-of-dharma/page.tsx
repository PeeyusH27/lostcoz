import type { Metadata } from "next";
import TravelingCard from "@/components/motion/TravelingCard";
import DharmaHero from "@/components/dharma/DharmaHero";
import ClansSection from "@/components/dharma/ClansSection";
import PhasesSection from "@/components/dharma/PhasesSection";
import RulesSection from "@/components/dharma/RulesSection";
import CardsGallery from "@/components/dharma/CardsGallery";
import BacksSection from "@/components/dharma/BacksSection";
import DharmaCTA from "@/components/dharma/DharmaCTA";
import { backs } from "@/data/dharma";

export const metadata: Metadata = {
  title: "Order of Dharma",
  description: "A Lostcoz original for 4–11 players. Two Clans, one Dharma, six phases, and you don't know your allies from your enemies. Rules, phases and every card explained.",
  openGraph: { images: ["/cards/backs/clan-back.jpg"] },
};

export default function OrderOfDharmaPage() {
  return (
    <div className="theme-dharma">
      <TravelingCard
        front={{ src: backs.ability.small, alt: "Order of Dharma ability card back — sword and shield" }}
        back={{ src: backs.clan.small, alt: "Order of Dharma clan card back — sun and moon" }}
      />
      <DharmaHero />
      <ClansSection />
      <PhasesSection />
      <RulesSection />
      <CardsGallery />
      <BacksSection />
      <DharmaCTA />
    </div>
  );
}
