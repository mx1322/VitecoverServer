import type { HomeContent } from "@/types/content";

export const homeContent: HomeContent = {
  hero: {
    badge: "Assurance auto temporaire",
    title: "Obtenez votre assurance temporaire en quelques minutes.",
    subtitle: "Souscription en ligne avec envoi de police par email après revue.",
    primaryCtaLabel: "Obtenir un devis",
    secondaryCtaLabel: "Voir les produits",
  },
  trustHighlights: [
    { key: "online", title: "Processus 100% en ligne", description: "De la sélection au paiement sans déplacement." },
    { key: "fast", title: "Envoi rapide", description: "La police est envoyée par email après validation." },
  ],
  processSteps: [
    { key: "choose", title: "Choisir un produit", description: "Sélectionnez la couverture adaptée." },
    { key: "details", title: "Renseigner les informations", description: "Ajoutez les données conducteur et véhicule." },
    { key: "pay", title: "Payer en ligne", description: "Validez la commande de manière sécurisée." },
    { key: "receive", title: "Recevoir la police", description: "Recevez les documents après revue." },
  ],
  sections: {
    productsIntro: { title: "Choisissez votre couverture", subtitle: "Produits temporaires selon votre type de véhicule." },
    faqIntro: { title: "Questions fréquentes", subtitle: "Réponses aux questions courantes avant l'achat." },
  },
};
