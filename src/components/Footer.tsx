import { Sprout } from "lucide-react";
const Footer = () => {
  return <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-primary rounded-lg p-2">
                <Sprout className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">FieldSense</span>
            </div>
            <p className="text-muted-foreground max-w-md">
              Empowering farmers worldwide with precision agriculture technology. 
              Sustainable farming through intelligent soil monitoring.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="/#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="/technology" className="hover:text-primary transition-colors">Technology</a></li>
              <li><a href="/#crops" className="hover:text-primary transition-colors">Crop Database</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/#technology" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Support</a></li>
              <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 AgriSense Pro. All rights reserved. Transforming agriculture through technology.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;