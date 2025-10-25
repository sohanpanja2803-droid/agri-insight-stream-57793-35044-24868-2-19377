import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Technology from "@/components/Technology";
import Crops from "@/components/Crops";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and redirect to dashboard
    const isAuth = localStorage.getItem("isAuthenticated");
    if (isAuth) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <section id="features">
        <Features />
      </section>
      <section id="technology">
        <Technology />
      </section>
      <section id="crops">
        <Crops />
      </section>
      <section id="pricing">
        <Pricing />
      </section>
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
