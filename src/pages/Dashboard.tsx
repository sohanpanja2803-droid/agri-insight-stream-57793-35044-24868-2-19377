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
  MapPin, Calendar, LogOut, User, Activity 
} from "lucide-react";
import Header from "@/components/Header";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      navigate("/login");
      return;
    }

    // Load user data
    const data = localStorage.getItem("trialUserData");
    if (data) {
      const parsedData = JSON.parse(data);
      setUserData(parsedData);
      
      // Try to fetch data from backend
      fetchBackendData(parsedData.email);
    }
  }, [navigate]);

  const fetchBackendData = async (email: string) => {
    try {
      // Import dynamically to avoid issues if backend is not running
      const { getUserData, getRecommendations, healthCheck } = await import('@/services/api');
      
      // Check if backend is available
      const health = await healthCheck();
      if (health.status === 'ok') {
        setBackendConnected(true);
        
        // Try to get user data from backend
        try {
          const backendUser = await getUserData(email);
          if (backendUser && backendUser.soil_data) {
            // Update soil data display with real backend data
            const soil = backendUser.soil_data;
            setSoilData([
              { 
                parameter: "pH Level", 
                value: soil.ph?.toString() || "N/A", 
                optimal: "6.0-7.0", 
                status: (soil.ph >= 6.0 && soil.ph <= 7.0) ? "optimal" : "monitor" 
              },
              { 
                parameter: "Moisture", 
                value: soil.moisture ? `${soil.moisture}%` : "N/A", 
                optimal: "65-75%", 
                status: (soil.moisture >= 65 && soil.moisture <= 75) ? "optimal" : "monitor" 
              },
              { 
                parameter: "Nitrogen (N)", 
                value: soil.nitrogen ? `${soil.nitrogen} mg/kg` : "N/A", 
                optimal: "200-300 mg/kg", 
                status: (soil.nitrogen >= 200 && soil.nitrogen <= 300) ? "optimal" : "monitor" 
              },
              { 
                parameter: "Phosphorus (P)", 
                value: soil.phosphorus ? `${soil.phosphorus} mg/kg` : "N/A", 
                optimal: "30-50 mg/kg", 
                status: (soil.phosphorus >= 30 && soil.phosphorus <= 50) ? "optimal" : "monitor" 
              },
              { 
                parameter: "Potassium (K)", 
                value: soil.potassium ? `${soil.potassium} mg/kg` : "N/A", 
                optimal: "150-200 mg/kg", 
                status: (soil.potassium >= 150 && soil.potassium <= 200) ? "optimal" : "monitor" 
              },
              { 
                parameter: "Organic Matter", 
                value: "3.2%", 
                optimal: "3-5%", 
                status: "optimal" 
              },
            ]);
          }
        } catch (error) {
          console.log("User not found in backend, using default data");
        }
      }
    } catch (error) {
      console.log("Backend not available, using mock data");
      setBackendConnected(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authTimestamp");
    localStorage.removeItem("trialUserData");
    navigate("/login", { replace: true });
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

  const [soilData, setSoilData] = useState([
    { parameter: "pH Level", value: "6.8", optimal: "6.0-7.0", status: "optimal" },
    { parameter: "Moisture", value: "71%", optimal: "65-75%", status: "optimal" },
    { parameter: "Nitrogen (N)", value: "245 mg/kg", optimal: "200-300 mg/kg", status: "optimal" },
    { parameter: "Phosphorus (P)", value: "42 mg/kg", optimal: "30-50 mg/kg", status: "optimal" },
    { parameter: "Potassium (K)", value: "185 mg/kg", optimal: "150-200 mg/kg", status: "optimal" },
    { parameter: "Organic Matter", value: "3.2%", optimal: "3-5%", status: "optimal" },
  ]);
  const [backendConnected, setBackendConnected] = useState(false);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const initials = userData.fullName
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
                <h1 className="text-2xl font-bold">{userData.fullName}</h1>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4" />
                  {userData.location || "Location not specified"}
                </p>
                {backendConnected && (
                  <Badge variant="secondary" className="mt-2">
                    <Activity className="h-3 w-3 mr-1" />
                    Backend Connected
                  </Badge>
                )}
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
              <div className="text-2xl font-bold">{userData.farmSize} acres</div>
              <p className="text-xs text-muted-foreground mt-1">
                {userData.cropType}
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
              {soilData.map((item, index) => (
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="moisture">Soil Moisture</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
            <TabsTrigger value="yield">Yield Forecast</TabsTrigger>
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
                Your {userData.cropType} is growing 15% faster than regional average. 
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
