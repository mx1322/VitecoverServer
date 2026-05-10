import type { HomeContent } from "@/types/content";

export const homeContent: HomeContent = {
  hero: {
    badge: "Assurance auto temporaire",
    title: "Souscrivez une assurance auto temporaire en quelques minutes",
    subtitle: "Parcours en ligne simple pour obtenir votre couverture rapidement.",
    primaryCtaLabel: "Obtenir un devis",
    secondaryCtaLabel: "Voir les produits",
  },
  trustHighlights: [
    {
      key: "online",
      title: "Parcours 100% en ligne",
      description: "De la sélection du produit au paiement, tout se fait en ligne.",
    },
    {
      key: "speed",
      title: "Traitement rapide",
      description: "Votre dossier est traité rapidement après validation.",
    },
  ],
  processSteps: [
    { key: "choose", title: "Choisissez votre produit", description: "Sélectionnez la formule adaptée à votre véhicule." },
    { key: "details", title: "Renseignez vos informations", description: "Ajoutez les informations conducteur et véhicule." },
    { key: "pay", title: "Payez en ligne", description: "Confirmez votre demande avec un paiement sécurisé." },
    { key: "receive", title: "Recevez votre police", description: "La police est envoyée par email après revue." },
  ],
  sections: {
    productsIntro: {
      title: "Produits disponibles",
      subtitle: "Des formules temporaires selon votre type de véhicule.",
    },
    faqIntro: {
      title: "Questions fréquentes",
      subtitle: "Réponses aux questions courantes avant souscription.",
    },
  },
};
