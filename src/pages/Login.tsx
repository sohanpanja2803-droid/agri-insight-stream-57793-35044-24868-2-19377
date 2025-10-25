import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Leaf, ArrowLeft, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [locationSet, setLocationSet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [farmLocation, setFarmLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [apiKey, setApiKey] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px'
  };

  const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629 // Center of India
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic phone number validation
    if (phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP send
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      });
    }, 1000);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length < 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      setLocationSet(true);
      toast({
        title: "OTP Verified",
        description: "Please select your farm location",
      });
    }, 1000);
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setFarmLocation({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
    }
  };

  const handleSubmitLocation = async () => {
    if (!farmLocation) {
      toast({
        title: "Location Required",
        description: "Please select your farm location on the map",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate location submission
    setTimeout(() => {
      setIsLoading(false);
      // Mark user as authenticated
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("authTimestamp", new Date().toISOString());
      
      toast({
        title: "Registration Complete",
        description: "Welcome to FieldSense! Redirecting to dashboard...",
      });
      setTimeout(() => navigate("/dashboard"), 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <Card className="shadow-elegant border-primary/10">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              {!otpSent 
                ? "Enter your phone number to receive an OTP"
                : !locationSet
                ? "Enter the OTP sent to your phone"
                : "Select your farm location on the map"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  variant="hero"
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            ) : !locationSet ? (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    variant="hero"
                  >
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                  >
                    Change Phone Number
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">Google Maps API Key</Label>
                  <Input
                    id="apiKey"
                    type="text"
                    placeholder="Enter your Google Maps API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your API key from{" "}
                    <a 
                      href="https://console.cloud.google.com/google/maps-apis" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Google Cloud Console
                    </a>
                  </p>
                </div>
                
                {apiKey && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Farm Location
                    </Label>
                    <LoadScript googleMapsApiKey={apiKey}>
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={farmLocation || defaultCenter}
                        zoom={farmLocation ? 15 : 5}
                        onClick={handleMapClick}
                      >
                        {farmLocation && (
                          <Marker position={farmLocation} />
                        )}
                      </GoogleMap>
                    </LoadScript>
                    {farmLocation && (
                      <p className="text-sm text-muted-foreground">
                        Location: {farmLocation.lat.toFixed(6)}, {farmLocation.lng.toFixed(6)}
                      </p>
                    )}
                  </div>
                )}
                
                <Button 
                  onClick={handleSubmitLocation}
                  className="w-full" 
                  disabled={isLoading || !farmLocation || !apiKey}
                  variant="hero"
                >
                  {isLoading ? "Submitting..." : "Complete Registration"}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setLocationSet(false);
                    setFarmLocation(null);
                  }}
                >
                  Back to OTP
                </Button>
              </div>
            )}
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>New to AgroTech?</p>
              <p className="mt-2">Contact customer care to create an account</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
