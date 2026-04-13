export type HomeProductCard = {
  code: string;
  title: string;
  eyebrow: string;
  description: string;
  href?: string;
  available: boolean;
  primaryMetric: string;
  secondaryMetric: string;
};

export const homeProductCards: HomeProductCard[] = [
  {
    code: "AUTOMOBILE",
    title: "Light-duty vehicle",
    eyebrow: "Automobile",
    description: "Temporary cover for passenger cars, from 1 day to 90 days.",
    href: "/quote?product=AUTOMOBILE",
    available: true,
    primaryMetric: "45,00 € / day",
    secondaryMetric: "4,66 € / day over 90 days",
  },
  {
    code: "POIDS_LOURDS",
    title: "Heavy vehicle",
    eyebrow: "Poids lourds",
    description: "Temporary cover for commercial heavy vehicles and transport use.",
    href: "/quote?product=POIDS_LOURDS",
    available: true,
    primaryMetric: "103,00 € / day",
    secondaryMetric: "From 1 to 15 days",
  },
  {
    code: "AUTOCAR_BUS",
    title: "Coach / bus",
    eyebrow: "Autocar / bus",
    description: "Short-term protection for coaches, buses, and passenger transport fleets.",
    href: "/quote?product=AUTOCAR_BUS",
    available: true,
    primaryMetric: "129,00 € / day",
    secondaryMetric: "From 1 to 15 days",
  },
  {
    code: "CAMPING_CAR",
    title: "Motorhome",
    eyebrow: "Camping-car",
    description: "Temporary insurance for camping-cars and leisure vehicles.",
    href: "/quote?product=CAMPING_CAR",
    available: true,
    primaryMetric: "58,00 € / day",
    secondaryMetric: "5,28 € / day over 90 days",
  },
];
