export type HomeProductCard = {
  code: string;
  title: string;
  category: string;
  description: string;
  iconPath: string;
  href?: string;
  available: boolean;
  priceLabel: string;
  price: string;
  buttonLabel: string;
};

export const homeProductCards: HomeProductCard[] = [
  {
    code: "AUTOMOBILE",
    title: "Passenger Car",
    category: "AUTOMOBILE",
    description: "Private cars under 3.5 tonnes.",
    iconPath: "/icons/automobile.svg",
    href: "/quote?product=AUTOMOBILE",
    available: true,
    priceLabel: "From",
    price: "45,00 € / day",
    buttonLabel: "Choose cover",
  },
  {
    code: "UTILITAIRE",
    title: "Light Commercial Van",
    category: "COMMERCIAL VEHICLE",
    description: "Vans and light commercial vehicles up to 3.5 tonnes.",
    iconPath: "/icons/utilitaire.svg",
    href: "/quote?product=UTILITAIRE",
    available: true,
    priceLabel: "From",
    price: "69,00 € / day",
    buttonLabel: "Choose cover",
  },
  {
    code: "POIDS_LOURDS",
    title: "Heavy Goods Vehicle",
    category: "HEAVY GOODS VEHICLE",
    description: "Goods vehicles above 3.5 tonnes.",
    iconPath: "/icons/poids-lourds.svg",
    href: "/quote?product=POIDS_LOURDS",
    available: true,
    priceLabel: "From",
    price: "103,00 € / day",
    buttonLabel: "Choose cover",
  },
  {
    code: "AUTOCAR_BUS",
    category: "COACH / BUS",
    title: "Coach / Bus",
    description: "Buses and passenger coaches above 3.5 tonnes.",
    iconPath: "/icons/bus.svg",
    href: "/quote?product=AUTOCAR_BUS",
    available: true,
    priceLabel: "From",
    price: "129,00 € / day",
    buttonLabel: "Choose cover",
  },
  {
    code: "CAMPING_CAR",
    category: "MOTORHOME",
    title: "Motorhome",
    description: "Motorhomes and leisure vehicles.",
    iconPath: "/icons/camping-car.svg",
    href: "/quote?product=CAMPING_CAR",
    available: true,
    priceLabel: "From",
    price: "58,00 € / day",
    buttonLabel: "Choose cover",
  },
  {
    code: "REMORQUE",
    category: "TRAILER",
    title: "Trailer",
    description: "Standalone temporary trailer cover.",
    iconPath: "/icons/remorque.svg",
    available: false,
    priceLabel: "Price",
    price: "On request",
    buttonLabel: "Request pricing",
  },
];
