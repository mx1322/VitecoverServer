export type HomeProductCard = {
  code: string;
  title: string;
  eyebrow: string;
  description: string;
  iconPath: string;
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
    description: "Temporary cover for light passenger vehicles under 3.5 tonnes.",
    iconPath: "/icons/automobile.svg",
    href: "/quote?product=AUTOMOBILE",
    available: true,
    primaryMetric: "45,00 € / day",
    secondaryMetric: "4,66 € / day over 90 days",
  },
  {
    code: "UTILITAIRE",
    title: "Light commercial van",
    eyebrow: "Vehicule utilitaire",
    description: "Temporary cover for utility vans and light commercial vehicles up to 3.5 tonnes.",
    iconPath: "/icons/utilitaire.svg",
    href: "/quote?product=UTILITAIRE",
    available: true,
    primaryMetric: "69,00 € / day",
    secondaryMetric: "From 1 to 15 days",
  },
  {
    code: "POIDS_LOURDS",
    title: "Heavy vehicle",
    eyebrow: "Poids lourds",
    description: "Temporary cover for heavy goods vehicles above 3.5 tonnes.",
    iconPath: "/icons/poids-lourds.svg",
    href: "/quote?product=POIDS_LOURDS",
    available: true,
    primaryMetric: "103,00 € / day",
    secondaryMetric: "From 1 to 15 days",
  },
  {
    code: "AUTOCAR_BUS",
    title: "Coach / bus",
    eyebrow: "Autocar / bus",
    description: "Short-term protection for passenger buses and coaches above 3.5 tonnes.",
    iconPath: "/icons/bus.svg",
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
    iconPath: "/icons/camping-car.svg",
    href: "/quote?product=CAMPING_CAR",
    available: true,
    primaryMetric: "58,00 € / day",
    secondaryMetric: "5,28 € / day over 90 days",
  },
  {
    code: "REMORQUE",
    title: "Trailer",
    eyebrow: "Remorque",
    description: "Temporary cover for trailers as a standalone insurance product.",
    iconPath: "/icons/remorque.svg",
    available: false,
    primaryMetric: "Pricing on request",
    secondaryMetric: "Tariffs will appear here once the remorque table is loaded",
  },
];
