import { fonts } from "@/components/ui/font";
import Link from "next/link";
import Image from "next/image";
import { Twitter, Facebook, Linkedin, Instagram } from "lucide-react";
import Container from "./container";

const footerLinks = {
  customers: {
    title: "For Customers",
    links: [
      { text: "Overview", href: "#" },
      { text: "Customer Features", href: "#" },
      { text: "Periodical", href: "#" },
    ],
  },
  admin: {  // Added new admin section
    title: "Admin",
    links: [
      { text: "Admin Panel", href: "https://admin-tradetroppers.vercel.app/" },
    ],
  },
  suppliers: {
    title: "For Suppliers",
    links: [
      { text: "TradeTroppers for Suppliers", href: "#" },
      { text: "Master Data Management Platform", href: "#" },
      { text: "Customer Experience Application", href: "#" },
      { text: "TradeTropper Marketplace", href: "#" },
      { text: "TradeTropper Marketplace Supplier Features", href: "#" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { text: "About us", href: "#" },
      { text: "Careers", href: "#" },
      { text: "Contact Us", href: "#" },
      { text: "Events", href: "#" },
      { text: "News", href: "#" },
    ],
  },
  values: {
    title: "Values",
    links: [
      { text: "Privacy", href: "#" },
      { text: "Security", href: "#" },
    ],
  },
  learning: {
    title: "Learning",
    links: [
      { text: "Help Center", href: "#" },
      { text: "How to Use TradeTropper", href: "#" },
      { text: "Blog", href: "#" },
    ],
  },
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export default function Footer() {
  return (
    <Container>
      <footer
        className={`bg-white ${fonts.montserrat} border-t border-gray-200`}
      >
        <div className="max-w-7xl mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {Object.values(footerLinks).map((section) => (
              <div key={section.title}>
                <h2 className="font-semibold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.text}>
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-gray-900 text-sm"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col justify-between items-start space-y-4 md:space-y-6">
              <section className="flex items-center space-x-4 mb-4">
                <div className="text-xl font-semibold text-gray-900">Logo</div>
                <span className="text-sm text-gray-500">
                  © 2025 TradeTropper. All Rights Reserved.
                </span>
              </section>

              <section className="flex flex-col md:w-full md:flex-row md:justify-between items-start md:items-center space-y-4 md:space-y-0 ">
                <div className="flex items-center space-x-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <Link
                        key={social.label}
                        href={social.href}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label={social.label}
                      >
                        <Icon className="w-5 h-5" />
                      </Link>
                    );
                  })}
                </div>

                <div className="flex space-x-4 text-sm text-gray-500">
                  <Link href="#" className="hover:text-gray-700">
                    Terms of Use
                  </Link>
                  <span>|</span>
                  <Link href="#" className="hover:text-gray-700">
                    Cookies
                  </Link>
                  <span>|</span>
                  <Link href="#" className="hover:text-gray-700">
                    Cookie settings
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </footer>
    </Container>
  );
}