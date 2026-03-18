import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import logoOFH from "@/assets/logo-ofh.png";

const Footer = () => {
  const footerLinks = {
    shop: [
      { name: "All Products", href: "/products" },
      { name: "Jaggery", href: "/products?category=Jaggery" },
      { name: "Rice", href: "/products?category=Rice" },
      { name: "Vegetables", href: "/products?category=Vegetables" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Farms", href: "/farms" },
      { name: "Sustainability", href: "/sustainability" },
      { name: "Careers", href: "/careers" },
      { name: "Admin Panel", href: "/admin/login" },
    ],
    support: [
      { name: "Contact", href: "/contact" },
      { name: "Track Order", href: "/track" },
      { name: "Delivery Info", href: "/delivery" },
      { name: "Returns", href: "/returns" },
      { name: "FAQ", href: "/faq" },
      { name: "Install App", href: "/install" },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Youtube, href: "#", label: "Youtube" },
  ];

  return (
    <footer id="contact" className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <img src={logoOFH} alt="OFH - Organic Foods House" className="h-12 w-auto" />
            </a>
            <p className="font-body text-muted-foreground max-w-xs">
              The Organic Foods House - Bringing fresh, organic produce from local farms to your table. 
              Committed to sustainability and healthy living.
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-body font-bold text-foreground mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body font-bold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body font-bold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-sm text-muted-foreground">
            © 2025 The Organic Foods House. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="/privacy" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;