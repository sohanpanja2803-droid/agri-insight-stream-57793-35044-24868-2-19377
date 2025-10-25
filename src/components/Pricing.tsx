import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const pricingTiers = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Perfect for small to medium farms",
    features: [
      "Up to 10 hectares coverage",
      "Basic soil monitoring (moisture, temperature)",
      "Weekly data reports",
      "Email support",
      "Mobile app access",
      "Customer care",
      "basic features",
      "Limited Access",
      "Less Units"
    ],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$149",
    period: "/month",
    description: "For progressive farmers",
    features: [
      "Up to 50 hectares coverage",
      "Advanced analytics (nutrients, pH, EC)",
      "Daily data reports with insights",
      "Priority support + voice assistant",
      "Multi-field management",
      "Predictive recommendations",
      "API access",
      "Customer care",
      "Pro features",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Multinational agribusiness solution",
    features: [
      "Unlimited coverage",
      "Laboratory-grade precision analytics",
      "Real-time monitoring and alerts",
      "Dedicated account manager",
      "Custom integration support",
      "Unlimited sensor units",
      "White-label options",
      "Advanced data science models",
      "SLA guarantee",
    ],
    highlighted: false,
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  
  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Subscription Plans
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
            All plans include a 45-day free trial. No credit card required.
          </p>
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-6 py-3 rounded-lg border border-accent/30">
            <span className="font-semibold">Special Launch Offer:</span>
            <span>First 100 customers get 20% off first year</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <Card 
              key={index}
              className={`p-8 relative ${
                tier.highlighted 
                  ? 'border-primary border-2 shadow-strong scale-105' 
                  : 'border-border/50'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-muted-foreground text-sm">{tier.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={tier.highlighted ? "hero" : "outline"} 
                className="w-full"
                size="lg"
                onClick={() => navigate(tier.price === "Custom" ? "/contact" : "/free-trial")}
              >
                {tier.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-muted-foreground">
          <p>All prices in USD. Hardware costs not included. Payment plans available.</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
