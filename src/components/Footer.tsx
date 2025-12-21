import { Twitter, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                PHOENIX THE WEB3 SENSEI
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Building the future of Web3 communities and empowering traders worldwide.
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="hover:border-primary/50 hover:text-primary"
                asChild
              >
                <a href="https://x.com/intent/follow?screen_name=sensei_phoenixx" target="_blank" rel="noreferrer" aria-label="Follow on Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="hover:border-primary/50 hover:text-primary"
                asChild
              >
                <a href="https://t.me/ph0enix_web" target="_blank" rel="noreferrer" aria-label="Join Telegram">
                  <Send className="w-4 h-4" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="hover:border-primary/50 hover:text-primary"
                asChild
              >
                <a href="mailto:support@senseiphoenix.name.ng" aria-label="Email support">
                  <Mail className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/blog", label: "Blog" },
                { to: "/bitget", label: "Bitget" },
                { to: "/about", label: "About" },
                { to: "/resume", label: "Resume" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <a href="https://t.me/ph0enix_web" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="mailto:support@senseiphoenix.name.ng" className="text-muted-foreground hover:text-primary transition-colors">
                  Support
                </a>
              </li>
              <li>
                <Link to="/resume" className="text-muted-foreground hover:text-primary transition-colors">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@senseiphoenix.name.ng" className="text-muted-foreground hover:text-primary transition-colors">
                  support@senseiphoenix.name.ng
                </a>
              </li>
              <li>
                <a href="mailto:privacy@senseiphoenix.name.ng" className="text-muted-foreground hover:text-primary transition-colors">
                  privacy@senseiphoenix.name.ng
                </a>
              </li>
            </ul>
            <h3 className="font-semibold text-foreground mb-4 mt-6">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} PHOENIX THE WEB3 SENSEI. All rights reserved. Built with passion for Web3.
          </p>
        </div>
      </div>
    </footer>
  );
};