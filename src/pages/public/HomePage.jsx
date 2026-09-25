import HeroSection from "../../components/home/HeroSection";
import StatsSection from "../../components/home/StatsSection";
import InstitutionPartners from "../../components/home/InstitutionPartners";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import LearningPlatformSection from "../../components/home/LearningPlatformSection";
import GuestFacultyServices from "../../components/home/GuestFacultyServices";
import TrainerCategories from "../../components/home/TrainerCategories";
import DeploymentProcess from "../../components/home/DeploymentProcess";
import TrainersSection from "../../components/home/TrainersSection";
import CareersSection from "../../components/home/CareersSection";
import FAQSection from "../../components/home/FAQSection";
import ContactCTA from "../../components/home/ContactCTA";

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-[#08070f]">

      <HeroSection />

      <StatsSection />

      <InstitutionPartners />

      <WhyChooseUs />

      <LearningPlatformSection />

      <GuestFacultyServices />

      <TrainerCategories />

      <DeploymentProcess />

      <TrainersSection />

      <CareersSection />

      <FAQSection />

      <ContactCTA />

    </main>
  );
}
