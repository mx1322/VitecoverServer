import { listDirectusFiles } from "@/lib/directus-admin";
import { directusAssetUrl } from "@/lib/file-service";

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

const fallbackIconPaths: Record<string, string> = {
  AUTOMOBILE: "/icons/automobile.svg",
  UTILITAIRE: "/icons/utilitaire.svg",
  POIDS_LOURDS: "/icons/poids-lourds.svg",
  AUTOCAR_BUS: "/icons/bus.svg",
  CAMPING_CAR: "/icons/camping-car.svg",
  REMORQUE: "/icons/remorque.svg",
};

const productFileMatchers: Record<string, string[]> = {
  AUTOMOBILE: ["logo vehicle"],
  UTILITAIRE: ["logo camionnette"],
  POIDS_LOURDS: ["logo poidslourd"],
  AUTOCAR_BUS: ["logo bus"],
  CAMPING_CAR: ["logo mobilehome"],
  REMORQUE: ["logo remorque"],
};

const baseHomeProductCards: HomeProductCard[] = [
  {
    code: "AUTOMOBILE",
    title: "Passenger Car",
    category: "AUTOMOBILE",
    description: "Private cars under 3.5 tonnes.",
    iconPath: fallbackIconPaths.AUTOMOBILE,
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
    iconPath: fallbackIconPaths.UTILITAIRE,
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
    iconPath: fallbackIconPaths.POIDS_LOURDS,
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
    iconPath: fallbackIconPaths.AUTOCAR_BUS,
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
    iconPath: fallbackIconPaths.CAMPING_CAR,
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
    iconPath: fallbackIconPaths.REMORQUE,
    available: false,
    priceLabel: "Price",
    price: "On request",
    buttonLabel: "Request pricing",
  },
];

function normalizeFileLabel(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export async function getHomeProductCards(): Promise<HomeProductCard[]> {
  try {
    const files = await listDirectusFiles();

    return baseHomeProductCards.map((card) => {
      const matchers = productFileMatchers[card.code] ?? [];
      const matchedFile = files.find((file) => {
        const title = normalizeFileLabel(file.title);
        const filename = normalizeFileLabel(file.filename_download);
        return matchers.some((matcher) => title.includes(matcher) || filename.includes(matcher));
      });

      if (!matchedFile?.id) {
        return card;
      }

      return {
        ...card,
        iconPath: directusAssetUrl(matchedFile.id),
      };
    });
  } catch {
    return baseHomeProductCards;
  }
}
