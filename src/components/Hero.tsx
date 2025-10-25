import { Button } from "@/components/ui/button";
import { ArrowRight, Sprout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroFarm from "@/assets/hero-farm.jpg";
const Hero = () => {
  const navigate = useNavigate();
  
  return <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroFarm} alt="Modern smart farming with technology integration" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/40"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 border border-primary/20">
            <Sprout className="h-5 w-5" />
            <span className="text-sm font-medium">FieldSense</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Transform Your Farm with{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Smart Soil Intelligence
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
            Real-time soil monitoring with FDR sensors, AI-powered insights, and local voice assistance. 
            Optimize irrigation, reduce synthetic inputs, and boost crop yields sustainably.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="lg" className="text-lg" onClick={() => navigate("/free-trial")}>
              Start 45-Day Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg border-2" onClick={() => navigate("/technology")}>
              View Technology
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-xl">
            <div>
              <div className="text-3xl font-bold text-primary mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Ai Voice Assistance</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">3+</div>
              <div className="text-sm text-muted-foreground">Crop Types</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Sustainable</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;