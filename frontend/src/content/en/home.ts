import type { HomeContent } from "@/types/content";

export const homeContent: HomeContent = {
  hero: {
    badge: "Temporary motor insurance",
    title: "Get temporary motor cover in minutes.",
    subtitle: "Buy online and receive policy documents by email after review.",
    primaryCtaLabel: "Start quote",
    secondaryCtaLabel: "Browse products",
  },
  trustHighlights: [
    { key: "online", title: "Fully online", description: "Complete the full purchase flow online." },
    { key: "fast", title: "Fast delivery", description: "Policy documents are sent after review." },
  ],
  processSteps: [
    { key: "choose", title: "Choose a product", description: "Select the right temporary cover." },
    { key: "details", title: "Enter details", description: "Provide driver and vehicle data." },
    { key: "pay", title: "Pay securely", description: "Confirm and pay online." },
    { key: "receive", title: "Receive policy", description: "Get policy documents by email." },
  ],
  sections: {
    productsIntro: { title: "Choose your cover", subtitle: "Temporary products by vehicle type." },
    faqIntro: { title: "Frequently asked questions", subtitle: "Common answers before purchase." },
  },
};
