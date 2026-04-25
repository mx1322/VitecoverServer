import { InfoCard } from "@/components/info-card";
import type { Locale } from "@/lib/i18n";

export function PoliciesPageContent({ locale }: { locale: Locale }) {
  const copy = {
    en: {
      eyebrow: "Policy delivery",
      title: "PDF policy handling",
      cards: [
        {
          eyebrow: "Delivery",
          title: "Email is a distribution channel",
          body: "Sending the PDF by email is a good customer experience and should absolutely be part of the product.",
        },
        {
          eyebrow: "Storage",
          title: "Private storage is still recommended",
          body: "Even if the customer receives the PDF by email, the platform should keep a private stored copy for re-download, support, audit trail, and future document recovery.",
        },
        {
          eyebrow: "Development",
          title: "Local-first now",
          body: "During local development, Directus file storage can remain local. The frontend only needs a stable policy access pattern.",
        },
        {
          eyebrow: "Production",
          title: "AWS path later",
          body: "In production, a private S3 bucket is still the cleanest long-term option. The customer portal can expose files through authenticated backend-controlled access.",
        },
      ],
    },
    fr: {
      eyebrow: "Livraison de police",
      title: "Gestion des polices PDF",
      cards: [
        { eyebrow: "Livraison", title: "L'e-mail est un canal de diffusion", body: "L'envoi du PDF par e-mail améliore l'expérience client et doit faire partie du produit." },
        { eyebrow: "Stockage", title: "Le stockage privé reste recommandé", body: "Même si le client reçoit le PDF par e-mail, la plateforme doit conserver une copie privée pour le re-téléchargement, le support et l'audit." },
        { eyebrow: "Développement", title: "Priorité au local", body: "En développement local, le stockage Directus peut rester local. Le frontend a surtout besoin d'un accès stable aux polices." },
        { eyebrow: "Production", title: "Parcours AWS ensuite", body: "En production, un bucket S3 privé reste l'option la plus propre à long terme. Le portail client expose les fichiers via un accès authentifié côté backend." },
      ],
    },
    zh: {
      eyebrow: "保单交付",
      title: "PDF 保单处理",
      cards: [
        { eyebrow: "交付", title: "邮件是有效分发渠道", body: "通过邮件发送 PDF 可显著提升客户体验，建议作为标准产品能力。" },
        { eyebrow: "存储", title: "仍建议私有存储", body: "即使客户收到邮件版 PDF，平台也应保留私有副本，便于重下载、客服和审计追溯。" },
        { eyebrow: "开发", title: "当前以本地优先", body: "在本地开发阶段，Directus 文件存储可保持本地，前端只需稳定的保单访问路径。" },
        { eyebrow: "生产", title: "后续接入 AWS", body: "在生产环境中，私有 S3 存储仍是更清晰的长期方案，客户门户可通过后端鉴权访问文件。" },
      ],
    },
  }[locale];

  return (
    <main className="section-wrap py-16">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1 className="mt-4 text-4xl font-semibold text-[var(--ink)]">{copy.title}</h1>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {copy.cards.map((card) => (
          <InfoCard key={card.title} eyebrow={card.eyebrow} title={card.title}>
            {card.body}
          </InfoCard>
        ))}
      </div>
    </main>
  );
}

export default function PoliciesPage() {
  return <PoliciesPageContent locale="en" />;
}
