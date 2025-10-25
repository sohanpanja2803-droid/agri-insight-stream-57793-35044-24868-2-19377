import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle2, MapPin } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FreeTrial = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    farmSize: "",
    cropType: "",
    location: "",
    coordinates: { lat: 20.5937, lng: 78.9629 }, // Default to India center
  });
  const [showMap, setShowMap] = useState(false);
  const [mapApiKey, setMapApiKey] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submitted with data:", formData);
    
    // Store user data in localStorage
    localStorage.setItem("trialUserData", JSON.stringify(formData));
    
    // Try to send data to backend
    try {
      const { signup, storeUserData, healthCheck } = await import('@/services/api');
      
      console.log("Checking backend health...");
      const health = await healthCheck();
      console.log("Health check response:", health);
      
      if (health.status === 'ok') {
        // First, signup the user (or get existing user)
        console.log("Signing up user:", formData.email);
        try {
          const signupResponse = await signup(formData.email);
          console.log("Signup response:", signupResponse);
        } catch (signupError: any) {
          console.log("Signup error:", signupError);
          // User might already exist, that's okay
          if (!signupError?.message?.includes('already registered')) {
            throw signupError;
          }
        }
        
        // Then store additional user data
        console.log("Storing user data...");
        const storeResponse = await storeUserData({
          email: formData.email,
          fullName: formData.fullName,
          location: formData.location,
          farmSize: formData.farmSize,
          cropType: formData.cropType,
          phone: formData.phone
        });
        console.log("Store data response:", storeResponse);
        
        toast({
          title: "Success!",
          description: "Your trial data has been saved to backend successfully.",
        });
      }
    } catch (error: any) {
      console.error("Backend connection error:", error);
      toast({
        title: "Backend Unavailable",
        description: `Data saved locally. Error: ${error.message || 'Connection failed'}`,
        variant: "destructive"
      });
    }
    
    // Navigate to payment page
    navigate("/payment");
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setFormData({
        ...formData,
        coordinates: { lat, lng },
      });
    }
  };

  const benefits = [
    "45 days of unlimited access",
    "Full FDR sensor suite",
    "AI voice assistant included",
    "Real-time dashboard analytics",
    "24/7 customer support",
    "No credit card required",
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Start Your{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  45-Day Free Trial
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Experience the power of smart soil intelligence with no commitment.
                Get started in minutes.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sign Up for Free Trial</CardTitle>
                <CardDescription>
                  Fill in your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size (acres)</Label>
                    <Input
                      id="farmSize"
                      type="number"
                      required
                      value={formData.farmSize}
                      onChange={(e) =>
                        setFormData({ ...formData, farmSize: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cropType">Primary Crop Type</Label>
                    <Input
                      id="cropType"
                      required
                      value={formData.cropType}
                      onChange={(e) =>
                        setFormData({ ...formData, cropType: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Farm Location</Label>
                    <Input
                      id="location"
                      placeholder="Enter farm address"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => setShowMap(!showMap)}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {showMap ? "Hide Map" : "Select on Map"}
                    </Button>
                  </div>

                  {showMap && (
                    <div className="space-y-2">
                      <Label htmlFor="mapApiKey">Google Maps API Key</Label>
                      <Input
                        id="mapApiKey"
                        placeholder="Enter your Google Maps API key"
                        value={mapApiKey}
                        onChange={(e) => setMapApiKey(e.target.value)}
                      />
                      {mapApiKey && (
                        <div className="h-[300px] rounded-md overflow-hidden border">
                          <LoadScript googleMapsApiKey={mapApiKey}>
                            <GoogleMap
                              mapContainerStyle={{ width: "100%", height: "100%" }}
                              center={formData.coordinates}
                              zoom={6}
                              onClick={handleMapClick}
                            >
                              <Marker position={formData.coordinates} />
                            </GoogleMap>
                          </LoadScript>
                        </div>
                      )}
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg">
                    Continue to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default FreeTrial;
