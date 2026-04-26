import type { HomeContent } from "@/types/content";

export const homeContent: HomeContent = {
  hero: {
    badge: "短期车险",
    title: "几分钟内完成短期车险投保。",
    subtitle: "在线购买，审核后通过邮件发送保单。",
    primaryCtaLabel: "开始报价",
    secondaryCtaLabel: "查看产品",
  },
  trustHighlights: [
    { key: "online", title: "全流程线上", description: "从选择到支付均可在线完成。" },
    { key: "fast", title: "发送快速", description: "审核后尽快通过邮件发送保单。" },
  ],
  processSteps: [
    { key: "choose", title: "选择产品", description: "选择适合的短期保障。" },
    { key: "details", title: "填写信息", description: "填写驾驶员和车辆资料。" },
    { key: "pay", title: "在线支付", description: "安全确认并完成支付。" },
    { key: "receive", title: "接收保单", description: "审核后通过邮件接收文件。" },
  ],
  sections: {
    productsIntro: { title: "选择保障方案", subtitle: "按车辆类型提供短期产品。" },
    faqIntro: { title: "常见问题", subtitle: "购买前常见问题解答。" },
  },
};
