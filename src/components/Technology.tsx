import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import sensorDevice from "@/assets/sensor-device.jpg";
import dashboardPreview from "@/assets/dashboard-preview.jpg";
import { Monitor, Smartphone, Cpu } from "lucide-react";

const Technology = () => {
  return (
    <section id="technology" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Hardware + Software Integration
          </h2>
          <p className="text-xl text-muted-foreground">
            Professional-grade equipment paired with enterprise analytics
          </p>
        </div>

        <Tabs defaultValue="hardware" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="hardware" className="text-base">Hardware</TabsTrigger>
            <TabsTrigger value="software" className="text-base">Software</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hardware" className="mt-0">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src={sensorDevice} 
                  alt="Advanced soil sensor device with digital display" 
                  className="rounded-lg shadow-strong w-full"
                />
              </div>
              
              <div className="space-y-6">
                <Card className="p-6 border-border/50">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <Cpu className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">FDR Sensor Technology</h3>
                      <p className="text-muted-foreground">
                        Frequency Domain Reflectometry sensors provide real-time measurements of soil moisture, 
                        temperature, and electrical conductivity with research-grade accuracy.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-border/50">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <Monitor className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Weather-Resistant Display</h3>
                      <p className="text-muted-foreground">
                        Field-tested display unit with IP67 rating, readable in direct sunlight, 
                        and operational in extreme temperatures from -20°C to 60°C.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-border/50">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <Smartphone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Voice Assistant Unit</h3>
                      <p className="text-muted-foreground">
                        Built-in speaker system with support for 15+ regional languages and dialects, 
                        providing continuous guidance and alerts in real-time.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="software" className="mt-0">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 order-2 lg:order-1">
                <Card className="p-6 border-border/50">
                  <h3 className="text-xl font-semibold mb-3">Real-Time Dashboard</h3>
                  <p className="text-muted-foreground mb-4">
                    Access comprehensive analytics through web and mobile interfaces. Monitor multiple fields 
                    simultaneously with customizable alerts and notifications.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">Web Portal</span>
                    <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">Mobile App</span>
                    <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">API Access</span>
                  </div>
                </Card>

                <Card className="p-6 border-border/50">
                  <h3 className="text-xl font-semibold mb-3">Predictive Analytics</h3>
                  <p className="text-muted-foreground mb-4">
                    Machine learning models trained on millions of data points predict optimal irrigation 
                    schedules, fertilization timing, and harvest windows specific to your crops.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      Irrigation optimization algorithms
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      Nutrient deficiency detection
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      Yield forecasting models
                    </li>
                  </ul>
                </Card>

                <Card className="p-6 border-border/50">
                  <h3 className="text-xl font-semibold mb-3">Monthly Insights Reports</h3>
                  <p className="text-muted-foreground">
                    Detailed PDF reports delivered monthly showing crop improvement trends, cost savings, 
                    and sustainability metrics with actionable recommendations.
                  </p>
                </Card>
              </div>
              
              <div className="order-1 lg:order-2">
                <img 
                  src={dashboardPreview} 
                  alt="Agricultural analytics dashboard showing soil metrics" 
                  className="rounded-lg shadow-strong w-full"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Technology;
