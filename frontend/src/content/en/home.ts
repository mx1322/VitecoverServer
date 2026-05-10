import type { HomeContent } from "@/types/content";

export const homeContent: HomeContent = {
  hero: {
    badge: "Temporary motor insurance",
    title: "Get temporary motor insurance in minutes",
    subtitle: "A simple online flow to secure short-term coverage quickly.",
    primaryCtaLabel: "Get a quote",
    secondaryCtaLabel: "Browse products",
  },
  trustHighlights: [
    {
      key: "online",
      title: "Fully online flow",
      description: "From product choice to payment, the process is online.",
    },
    {
      key: "speed",
      title: "Fast processing",
      description: "Your request is processed quickly after validation.",
    },
  ],
  processSteps: [
    { key: "choose", title: "Choose your product", description: "Pick the cover that matches your vehicle." },
    { key: "details", title: "Enter your details", description: "Provide driver and vehicle information." },
    { key: "pay", title: "Pay online", description: "Confirm your request with secure payment." },
    { key: "receive", title: "Receive your policy", description: "Policy documents are sent by email after review." },
  ],
  sections: {
    productsIntro: {
      title: "Available products",
      subtitle: "Short-term products for multiple vehicle categories.",
    },
    faqIntro: {
      title: "Frequently asked questions",
      subtitle: "Practical answers before you buy temporary cover.",
    },
  },
};
