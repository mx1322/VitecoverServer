export const siteConfig = {
  name: "Vitecover",
  description:
    "Temporary auto insurance products with an online quote, payment, and policy delivery flow.",
  supportEmail: "support@vitecover.example",
  navigation: [
    { href: "/#products", label: "Products" },
    { href: "/policies", label: "My Policies" },
    { href: "/auth", label: "Account" },
  ],
  footerLinks: [
    { href: "/#products", label: "Products" },
    { href: "/policies", label: "My Policies" },
    { href: "/auth", label: "Account" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/contact", label: "Contact" },
    { href: "/legal", label: "Legal Notice" },
    { href: "/regulatory", label: "Regulatory Information" },
  ],
} as const;
