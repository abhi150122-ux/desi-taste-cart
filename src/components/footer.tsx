import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MessageCircle, Phone, Youtube } from "lucide-react";

const pageLinks = [
  "About Us",
  "Contact Us",
  "Privacy Policy",
  "Terms & Conditions",
  "Shipping Policy",
  "Refund Policy",
  "FAQs",
];

export function Footer() {
  return (
    <footer className="mt-12 border-t border-accent/25 bg-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-bold text-primary">Jain Desi and Pure</p>
          <p className="mt-1 text-sm text-accent-foreground/80 italic">Pure Desi Taste, Naturally Better</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Cold pressed oils, desi ghee, unpolished dals, stone ground attas and traditional Indian foods —
            sourced honestly and packed fresh.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase">Company</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {pageLinks.map((l) => (
              <li key={l}>
                <Link to="/account" className="hover:text-primary">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase">Customer Support</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MessageCircle className="size-4 text-primary" /> WhatsApp: +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-primary" /> Phone: 1800 123 4567
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-primary" /> care@jaindesiandpure.in
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase">Follow Us</h3>
          <div className="mt-4 flex gap-3">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <span
                key={i}
                className="grid size-10 place-items-center rounded-full border border-accent/40 bg-card text-primary"
              >
                <Icon className="size-4" />
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Delivering across India · Mon–Sat, 8 AM to 9 PM</p>
        </div>
      </div>
      <div className="border-t border-accent/20 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Jain Desi and Pure. All rights reserved.
      </div>
    </footer>
  );
}
