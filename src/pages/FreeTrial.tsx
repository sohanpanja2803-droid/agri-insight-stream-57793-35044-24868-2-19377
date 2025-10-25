import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FreeTrial = () => {
  const navigate = useNavigate();

  const benefits = [
    "Unlimited access to all features",
    "Full FDR sensor suite",
    "AI voice assistant included",
    "Real-time dashboard analytics",
    "24/7 customer support",
    "No credit card required",
  ];

  const handleGetStarted = () => {
    navigate("/login");
  };

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

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Start Your{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Free Trial
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

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl">Get Started Today</CardTitle>
                <CardDescription>
                  Create your account and start monitoring your farm's soil health
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Create Account</h3>
                      <p className="text-sm text-muted-foreground">Sign up with your email in seconds</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
                    <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Set Up Your Farm</h3>
                      <p className="text-sm text-muted-foreground">Add your farm details and location</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
                    <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <span className="font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Start Monitoring</h3>
                      <p className="text-sm text-muted-foreground">Access your dashboard and insights</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleGetStarted} 
                  className="w-full" 
                  size="lg"
                >
                  Create Free Account
                </Button>

                <p className="text-sm text-center text-muted-foreground">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium"
                    onClick={() => navigate("/login")}
                  >
                    Sign In
                  </Button>
                </p>
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
