export const siteConfig = {
  name: "Vitecover",
  logoAssetId: "6e76776b-1ad3-4091-944e-72927dc371cb",
  description:
    "Temporary auto insurance products with an online quote, payment, and policy delivery flow.",
  supportEmail: "support@vitecover.example",
  navigation: [
    { href: "/#products", label: "Product" },
    { href: "/auth", label: "Account" },
    { href: "/quote", label: "Quote" },
    { href: "/faq", label: "FAQ" },
  ],
  footerLinks: [
    { href: "/#products", label: "Product" },
    { href: "/auth", label: "Account" },
    { href: "/quote", label: "Quote" },
    { href: "/faq", label: "FAQ" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/contact", label: "Contact" },
    { href: "/legal", label: "Legal Notice" },
    { href: "/regulatory", label: "Regulatory Information" },
  ],
} as const;
