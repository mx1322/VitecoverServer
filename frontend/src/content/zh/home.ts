import type { HomeContent } from "@/types/content";

export const homeContent: HomeContent = {
  hero: {
    badge: "临时汽车保险",
    title: "几分钟内完成临时车险申请",
    subtitle: "统一在线流程，快速获得短期保障。",
    primaryCtaLabel: "获取报价",
    secondaryCtaLabel: "查看产品",
  },
  trustHighlights: [
    {
      key: "online",
      title: "全程线上办理",
      description: "从选择产品到支付确认，均可在线完成。",
    },
    {
      key: "speed",
      title: "处理速度快",
      description: "资料验证后会尽快完成审核处理。",
    },
  ],
  processSteps: [
    { key: "choose", title: "选择产品", description: "根据车辆类型选择合适方案。" },
    { key: "details", title: "填写信息", description: "提交驾驶员与车辆信息。" },
    { key: "pay", title: "在线支付", description: "通过安全支付确认申请。" },
    { key: "receive", title: "接收保单", description: "审核后通过邮箱发送保单文件。" },
  ],
  sections: {
    productsIntro: {
      title: "可选产品",
      subtitle: "按不同车辆类型提供短期保障产品。",
    },
    faqIntro: {
      title: "常见问题",
      subtitle: "下单前常见问题与说明。",
    },
  },
};
