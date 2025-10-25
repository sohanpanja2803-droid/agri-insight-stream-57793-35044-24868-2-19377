import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Cpu, Radio, Smartphone, BarChart3, Cloud, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import sensorDevice from "@/assets/sensor-device.jpg";
import dashboardPreview from "@/assets/dashboard-preview.jpg";

const TechnologyDetails = () => {
  const navigate = useNavigate();

  const specs = [
    { label: "Sensor Type", value: "FDR (Frequency Domain Reflectometry)" },
    { label: "Measurement Depth", value: "0-60cm (customizable)" },
    { label: "Accuracy", value: "±2% volumetric water content" },
    { label: "Sampling Rate", value: "Every 15 minutes" },
    { label: "Battery Life", value: "2+ years (solar rechargeable)" },
    { label: "Connectivity", value: "LoRaWAN / 4G LTE" },
  ];

  const features = [
    {
      icon: Cpu,
      title: "Advanced FDR Sensors",
      description: "Military-grade sensors measure moisture, temperature, EC, pH, and NPK levels with exceptional accuracy.",
    },
    {
      icon: Radio,
      title: "Real-Time Data Transmission",
      description: "Low-power wireless connectivity ensures continuous monitoring without infrastructure overhead.",
    },
    {
      icon: Smartphone,
      title: "Local Voice Assistant",
      description: "AI-powered voice interface in local language for instant insights and recommendations without internet.",
    },
    {
      icon: BarChart3,
      title: "Predictive Analytics",
      description: "Machine learning algorithms forecast irrigation needs, pest risks, and optimal harvest windows.",
    },
    {
      icon: Cloud,
      title: "Cloud Dashboard",
      description: "Comprehensive web and mobile interface for historical trends, alerts, and farm management.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "End-to-end encryption and secure data storage ensure your farm data stays private.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-6xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Technology Stack
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Combining cutting-edge hardware with intelligent software to revolutionize agricultural monitoring.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div>
              <img
                src={sensorDevice}
                alt="FDR sensor device in field"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Hardware Specifications</h2>
              <div className="space-y-4">
                {specs.map((spec, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b">
                    <span className="font-medium">{spec.label}</span>
                    <span className="text-muted-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index}>
                    <CardHeader>
                      <Icon className="h-12 w-12 text-primary mb-4" />
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Dashboard & Analytics</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our intuitive dashboard provides real-time insights, historical trends, and actionable recommendations. 
                Access from any device, anywhere, anytime.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Interactive charts and visualization</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Custom alerts and notifications</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Multi-field management</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Export reports and data</span>
                </li>
              </ul>
              <Button size="lg" onClick={() => navigate("/free-trial")}>
                Try It Free
              </Button>
            </div>
            <div>
              <img
                src={dashboardPreview}
                alt="Dashboard analytics preview"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TechnologyDetails;
