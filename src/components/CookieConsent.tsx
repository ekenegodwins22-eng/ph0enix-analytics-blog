import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import { Link } from "react-router-dom";

const GA_ID = "G-2KF0JFRY2J";
const ADSENSE_ID = "ca-pub-3167199119695111";

// Load Google Analytics
const loadGoogleAnalytics = () => {
  if (document.getElementById('ga-script')) return;
  
  const script = document.createElement('script');
  script.id = 'ga-script';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    (window as any).gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  };
};

// Load Google AdSense
const loadGoogleAdSense = () => {
  if (document.getElementById('adsense-script')) return;
  
  const script = document.createElement('script');
  script.id = 'adsense-script';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`;
  script.async = true;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
};

// Load all tracking scripts
const loadTrackingScripts = () => {
  loadGoogleAnalytics();
  loadGoogleAdSense();
};

// Remove tracking scripts and cookies
const removeTrackingScripts = () => {
  // Remove scripts
  const gaScript = document.getElementById('ga-script');
  const adsenseScript = document.getElementById('adsense-script');
  if (gaScript) gaScript.remove();
  if (adsenseScript) adsenseScript.remove();
  
  // Clear GA cookies
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const name = cookie.split('=')[0].trim();
    if (name.startsWith('_ga') || name.startsWith('_gid')) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }
};

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    
    if (consent === "accepted") {
      // User previously accepted - load scripts
      loadTrackingScripts();
    } else if (consent === "declined") {
      // User previously declined - ensure scripts are not loaded
      removeTrackingScripts();
    } else {
      // No consent yet - show banner
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    loadTrackingScripts();
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    removeTrackingScripts();
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-foreground font-medium">
                  We use cookies to enhance your experience
                </p>
                <p className="text-xs text-muted-foreground">
                  This site uses cookies and similar technologies for analytics and to provide you with a better experience. 
                  By continuing to use our site, you consent to our use of cookies. 
                  Read our{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>{" "}
                  for more information.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                className="flex-1 md:flex-none"
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="flex-1 md:flex-none bg-gradient-to-r from-primary to-accent hover:shadow-glow"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};