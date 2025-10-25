import { Card } from "@/components/ui/card";
import { Wheat, Droplets, Leaf } from "lucide-react";

const crops = [
  {
    icon: Wheat,
    name: "Wheat",
    description: "Comprehensive monitoring for optimal grain quality and yield maximization",
    optimalConditions: [
      "Soil moisture: 60-80% field capacity",
      "pH range: 6.0-7.5",
      "NPK optimization for grain protein",
    ],
  },
  {
    icon: Droplets,
    name: "Rice",
    description: "Precision water management and nutrient tracking for paddy cultivation",
    optimalConditions: [
      "Water depth: 5-10cm during growth",
      "pH range: 5.5-6.5",
      "Nitrogen timing for tillering",
    ],
  },
  {
    icon: Leaf,
    name: "Tea",
    description: "Soil health monitoring for premium tea leaf production",
    optimalConditions: [
      "Soil moisture: 70-80% consistency",
      "pH range: 4.5-5.5 (acidic)",
      "Organic matter management",
    ],
  },
];

const Crops = () => {
  return (
    <section id="crops" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Supported Crop Database
          </h2>
          <p className="text-xl text-muted-foreground">
            Currently supporting 45+ staple and cash crops with optimized recommendations based on scientific research
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {crops.map((crop, index) => (
            <Card 
              key={index}
              className="p-6 border-border/50 hover:border-primary/30 hover:shadow-medium transition-all duration-300"
            >
              <div className="bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <crop.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3">{crop.name}</h3>
              <p className="text-muted-foreground mb-6">{crop.description}</p>
              
              <div className="space-y-2">
                <p className="text-sm font-semibold text-primary mb-2">Optimal Conditions:</p>
                {crop.optimalConditions.map((condition, condIndex) => (
                  <div key={condIndex} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">{condition}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Additional crops: Corn, Soybean, Cotton, Sugarcane, Coffee, Potatoes, Tomatoes, and more
          </p>
          <p className="text-sm text-muted-foreground">
            Database continuously expanding with new crops and regional varieties
          </p>
        </div>
      </div>
    </section>
  );
};

export default Crops;
