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
    iconPath: "/directus/assets/c30a3007-fc25-4e24-bb0c-69582ab326f1",
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
    iconPath: "/directus/assets/53b82e07-5ffe-4c95-931f-cd68559f9351",
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
    iconPath: "/directus/assets/d6aba802-39bd-438f-9e42-034d695f176f",
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
    iconPath: "/directus/assets/aaf3231c-1e1e-47e9-81fa-12f2e6d0c18a",
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
    iconPath: "/directus/assets/fcb30dc5-063d-418e-9260-f5ac41287a8c",
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
    iconPath: "/directus/assets/3f787ccf-0a49-4235-a9f6-b03fb9875478",
    available: false,
    priceLabel: "Price",
    price: "On request",
    buttonLabel: "Request pricing",
  },
];
