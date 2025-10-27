"use client";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/layout/HeroSection";
import TopCompanies from "@/components/layout/TopCompanies";
import FeaturedJobs from "@/components/layout/FeaturedJobs"
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="h-[1000px]">
      <Header />
      <HeroSection/>
      <FeaturedJobs/>
      <TopCompanies/>
      <Footer/>
    </div>
  );
}
