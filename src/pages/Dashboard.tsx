import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { 
  Droplets, Thermometer, Sprout, TrendingUp, 
  MapPin, Calendar, LogOut, Activity 
} from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | undefined>();
  const [user, setUser] = useState<any>(null);
  const { profile, soilData, cropSuggestions, temperatureReadings, growthMetrics, yieldPredictions } = useDashboardData(userId);

  useEffect(() => {
    // Check authentication and set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/login");
      } else if (session?.user) {
        setUser(session.user);
        setUserId(session.user.id);
      }
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
        setUserId(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate("/login", { replace: true });
    }
  };

  // Mock data for charts
  const moistureData = [
    { date: "Mon", value: 65, optimal: 70 },
    { date: "Tue", value: 68, optimal: 70 },
    { date: "Wed", value: 72, optimal: 70 },
    { date: "Thu", value: 70, optimal: 70 },
    { date: "Fri", value: 67, optimal: 70 },
    { date: "Sat", value: 69, optimal: 70 },
    { date: "Sun", value: 71, optimal: 70 },
  ];

  const temperatureData = [
    { time: "6am", temp: 18 },
    { time: "9am", temp: 22 },
    { time: "12pm", temp: 28 },
    { time: "3pm", temp: 32 },
    { time: "6pm", temp: 26 },
    { time: "9pm", temp: 21 },
  ];

  const growthData = [
    { week: "Week 1", height: 5, health: 85 },
    { week: "Week 2", height: 12, health: 88 },
    { week: "Week 3", height: 20, health: 90 },
    { week: "Week 4", height: 28, health: 92 },
  ];

  const yieldPrediction = [
    { month: "Jan", predicted: 450, actual: 420 },
    { month: "Feb", predicted: 480, actual: 465 },
    { month: "Mar", predicted: 520, actual: 0 },
    { month: "Apr", predicted: 550, actual: 0 },
  ];

  // Transform soil data for display
  const soilDataDisplay = soilData ? [
    { 
      parameter: "pH Level", 
      value: soilData.ph?.toString() || "N/A", 
      optimal: "6.0-7.0", 
      status: (soilData.ph && soilData.ph >= 6.0 && soilData.ph <= 7.0) ? "optimal" : "monitor" 
    },
    { 
      parameter: "Moisture", 
      value: soilData.moisture ? `${soilData.moisture}%` : "N/A", 
      optimal: "65-75%", 
      status: (soilData.moisture && soilData.moisture >= 65 && soilData.moisture <= 75) ? "optimal" : "monitor" 
    },
    { 
      parameter: "Nitrogen (N)", 
      value: soilData.nitrogen ? `${soilData.nitrogen} mg/kg` : "N/A", 
      optimal: "200-300 mg/kg", 
      status: (soilData.nitrogen && soilData.nitrogen >= 200 && soilData.nitrogen <= 300) ? "optimal" : "monitor" 
    },
    { 
      parameter: "Phosphorus (P)", 
      value: soilData.phosphorus ? `${soilData.phosphorus} mg/kg` : "N/A", 
      optimal: "30-50 mg/kg", 
      status: (soilData.phosphorus && soilData.phosphorus >= 30 && soilData.phosphorus <= 50) ? "optimal" : "monitor" 
    },
    { 
      parameter: "Potassium (K)", 
      value: soilData.potassium ? `${soilData.potassium} mg/kg` : "N/A", 
      optimal: "150-200 mg/kg", 
      status: (soilData.potassium && soilData.potassium >= 150 && soilData.potassium <= 200) ? "optimal" : "monitor" 
    },
    { 
      parameter: "Organic Matter", 
      value: soilData.organic_matter ? `${soilData.organic_matter}%` : "N/A", 
      optimal: "3-5%", 
      status: (soilData.organic_matter && soilData.organic_matter >= 3 && soilData.organic_matter <= 5) ? "optimal" : "monitor" 
    },
  ] : [
    { parameter: "pH Level", value: "6.8", optimal: "6.0-7.0", status: "optimal" },
    { parameter: "Moisture", value: "71%", optimal: "65-75%", status: "optimal" },
    { parameter: "Nitrogen (N)", value: "245 mg/kg", optimal: "200-300 mg/kg", status: "optimal" },
    { parameter: "Phosphorus (P)", value: "42 mg/kg", optimal: "30-50 mg/kg", status: "optimal" },
    { parameter: "Potassium (K)", value: "185 mg/kg", optimal: "150-200 mg/kg", status: "optimal" },
    { parameter: "Organic Matter", value: "3.2%", optimal: "3-5%", status: "optimal" },
  ];

  if (!user || !profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const initials = profile.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Dashboard Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4" />
                  {profile.location || "Location not specified"}
                </p>
                <Badge variant="secondary" className="mt-2">
                  <Activity className="h-3 w-3 mr-1" />
                  Cloud Connected
                </Badge>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Farm Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Farm Size</CardTitle>
              <Sprout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.farm_size || 'N/A'} acres</div>
              <p className="text-xs text-muted-foreground mt-1">
                {profile.crop_type || 'Not specified'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">71%</div>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Optimal range
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">26°C</div>
              <p className="text-xs text-muted-foreground mt-1">
                Perfect conditions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Trial Days Left</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45 days</div>
              <Badge variant="secondary" className="mt-1">Active Trial</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Soil Details Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5" />
              Soil Analysis Details
            </CardTitle>
            <CardDescription>Real-time soil composition and nutrient levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {soilDataDisplay.map((item, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-muted-foreground">{item.parameter}</h4>
                    <Badge 
                      variant={item.status === "optimal" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {item.status === "optimal" ? "Optimal" : "Monitor"}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold mb-1">{item.value}</div>
                  <div className="text-xs text-muted-foreground">
                    Optimal: {item.optimal}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <Tabs defaultValue="moisture" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="moisture">Soil Moisture</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
            <TabsTrigger value="yield">Yield Forecast</TabsTrigger>
            <TabsTrigger value="suggestions">Crop Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="moisture">
            <Card>
              <CardHeader>
                <CardTitle>Soil Moisture Levels</CardTitle>
                <CardDescription>Past 7 days moisture tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={moistureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.2}
                      name="Current"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="optimal" 
                      stroke="hsl(var(--muted-foreground))" 
                      fill="transparent"
                      strokeDasharray="5 5"
                      name="Optimal"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="temperature">
            <Card>
              <CardHeader>
                <CardTitle>Temperature Monitoring</CardTitle>
                <CardDescription>Today's temperature variations</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={temperatureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="temp" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Temperature (°C)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth">
            <Card>
              <CardHeader>
                <CardTitle>Crop Growth Analytics</CardTitle>
                <CardDescription>Weekly growth and health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="height" fill="hsl(var(--primary))" name="Height (cm)" />
                    <Bar dataKey="health" fill="hsl(var(--chart-2))" name="Health Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="yield">
            <Card>
              <CardHeader>
                <CardTitle>Yield Prediction</CardTitle>
                <CardDescription>AI-powered yield forecasting (kg/acre)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={yieldPrediction}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Predicted Yield"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      name="Actual Yield"
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions">
            <Card>
              <CardHeader>
                <CardTitle>Crop Value Suggestions</CardTitle>
                <CardDescription>Found 6 suitable crops for your soil conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(cropSuggestions && cropSuggestions.length > 0 ? cropSuggestions : [
                    {
                      crop_name: "Groundnut",
                      suitability_score: 75,
                      price_range_min: 64.54,
                      price_range_max: 71.33,
                      trend: "increasing"
                    },
                    {
                      crop_name: "Wheat",
                      suitability_score: 60,
                      price_range_min: 23.41,
                      price_range_max: 25.87,
                      trend: "increasing"
                    },
                    {
                      crop_name: "Maize",
                      suitability_score: 60,
                      price_range_min: 13.15,
                      price_range_max: 14.53,
                      trend: "decreasing"
                    },
                    {
                      crop_name: "Soybeans",
                      suitability_score: 60,
                      price_range_min: 34.27,
                      price_range_max: 37.87,
                      trend: "increasing"
                    },
                    {
                      crop_name: "Tea",
                      suitability_score: 60,
                      price_range_min: 246.31,
                      price_range_max: 272.24,
                      trend: "stable"
                    },
                    {
                      crop_name: "Tomatoes",
                      suitability_score: 60,
                      price_range_min: 25.86,
                      price_range_max: 28.58,
                      trend: "stable"
                    }
                  ]).map((crop, index) => (
                    <div key={index} className="p-5 rounded-lg border bg-card hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold mb-3">{crop.crop_name}</h3>
                      <div className="space-y-2.5">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Suitability Score:</p>
                          <p className="font-semibold text-base">{crop.suitability_score}/100</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Price Range:</p>
                          <p className="font-semibold text-base">
                            Rs.{crop.price_range_min} - Rs.{crop.price_range_max}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Trend:</p>
                          <Badge 
                            variant={
                              crop.trend === "increasing" ? "default" : 
                              crop.trend === "decreasing" ? "destructive" : 
                              "secondary"
                            }
                            className="font-medium"
                          >
                            {crop.trend}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h3 className="font-semibold mb-2">🌱 Optimal Irrigation Time</h3>
              <p className="text-sm text-muted-foreground">
                Based on current moisture levels and weather forecast, the best time to irrigate 
                is tomorrow morning between 6-8 AM. This will maximize water efficiency.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-chart-2/5 border border-chart-2/20">
              <h3 className="font-semibold mb-2">📈 Growth Rate Above Average</h3>
              <p className="text-sm text-muted-foreground">
                Your {profile.crop_type || 'crops'} {profile.crop_type ? 'are' : 'is'} growing 15% faster than regional average. 
                Current practices are highly effective!
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted border">
              <h3 className="font-semibold mb-2">🌡️ Temperature Alert</h3>
              <p className="text-sm text-muted-foreground">
                Heat wave predicted in 3 days. Consider increasing irrigation frequency 
                and monitoring soil moisture more closely.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
