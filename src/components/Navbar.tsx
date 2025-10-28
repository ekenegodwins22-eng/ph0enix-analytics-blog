import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/blog", label: "Blog" },
    { to: "/bitget", label: "Bitget" },
    { to: "/resume", label: "Resume" },
    { to: "/about", label: "About" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PH0ENIX_WEB3
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <Button
                  variant="ghost"
                  className={`relative ${
                    isActive(link.to)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
                  )}
                </Button>
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button
              className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'click', {
                    event_category: 'button',
                    event_label: 'Navbar Contact',
                  });
                }
              }}
            >
              Contact Me
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur-lg">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      isActive(link.to)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
              <Button
                className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'click', {
                      event_category: 'button',
                      event_label: 'Mobile Navbar Contact',
                    });
                  }
                }}
              >
                Contact Me
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
