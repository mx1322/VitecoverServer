export const siteConfig = {
  name: "Vitecover",
  description:
    "Temporary vehicle insurance with a simple quote flow focused on auto only.",
  supportEmail: "support@vitecover.example",
  navigation: [
    { href: "/quote", label: "Get insured" },
    { href: "/policies", label: "My policy" },
    { href: "/auth", label: "Account" },
  ],
} as const;
