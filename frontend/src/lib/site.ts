export const siteConfig = {
  name: "Vitecover",
  description:
    "Temporary vehicle insurance with a simple quote flow focused on auto only.",
  supportEmail: "support@vitecover.example",
  navigation: [
    { href: "/", label: "Home" },
    { href: "/quote", label: "Quote Flow" },
    { href: "/account", label: "Account" },
    { href: "/policies", label: "Policies" },
  ],
} as const;
