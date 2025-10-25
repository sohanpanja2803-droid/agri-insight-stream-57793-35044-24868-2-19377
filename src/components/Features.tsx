import { Card } from "@/components/ui/card";
import { Droplets, Brain, Mic, BarChart3, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: Droplets,
    title: "FDR Soil Sensors",
    description: "Advanced Frequency Domain Reflectometry technology measures humidity, dryness, and nutrient content with laboratory-grade precision.",
  },
  {
    icon: Mic,
    title: "Regional Voice Assistant",
    description: "24/7 access to soil data and crop recommendations in local languages and dialects. No technical expertise required.",
  },
  {
    icon: Brain,
    title: "AI-Powered Analytics",
    description: "Machine learning algorithms analyze soil patterns and provide actionable insights for optimal crop management.",
  },
  {
    icon: BarChart3,
    title: "Monthly Performance Reports",
    description: "Detailed feedback on crop quality improvements, yield trends, and soil health evolution over time.",
  },
  {
    icon: Shield,
    title: "Weather-Resistant Hardware",
    description: "Rugged, field-tested equipment designed to withstand extreme weather conditions and deliver reliable data.",
  },
  {
    icon: Globe,
    title: "Sustainable Practices",
    description: "Reduce reliance on synthetic inputs, improve soil health, and promote long-term agricultural sustainability.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Complete Agricultural Intelligence Platform
          </h2>
          <p className="text-xl text-muted-foreground">
            Integrated hardware and software ecosystem designed for modern precision farming
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 hover:shadow-medium transition-all duration-300 border-border/50 hover:border-primary/30"
            >
              <div className="bg-gradient-primary rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
