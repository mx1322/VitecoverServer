import type { ProductsContent } from "@/types/content";

export const productsContent: ProductsContent = {
  AUTOMOBILE: {
    title: "私家车",
    shortDescription: "适用于私家车的短期保险。",
    longDescription: "该产品面向私家车短期用车场景，支持线上快速投保。",
    seoTitle: "短期私家车保险 | Vitecover",
    seoDescription: "在线购买短期私家车保险。",
    highlights: ["短期保障", "线上购买", "邮件发送保单"],
  },
  UTILITAIRE: {
    title: "轻型商用车",
    shortDescription: "适用于 3.5 吨以下轻型商用车的短期保障。",
    longDescription: "适合货车和轻型商用车的短期使用场景。",
  },
  POIDS_LOURDS: {
    title: "重型货车",
    shortDescription: "适用于重型货车的短期保障。",
    longDescription: "为 3.5 吨以上货运车辆提供短期保险方案。",
  },
  AUTOCAR_BUS: {
    title: "客车 / 巴士",
    shortDescription: "适用于客车与巴士的短期保险。",
    longDescription: "面向大型客运车辆的短期保险保障。",
  },
  CAMPING_CAR: {
    title: "房车",
    shortDescription: "适用于房车和休闲车辆的短期保障。",
    longDescription: "适合房车短期出行期间使用的保险产品。",
  },
  REMORQUE: {
    title: "拖车",
    shortDescription: "适用于拖车的短期保障。",
    longDescription: "根据资格条件提供独立拖车短期保险。",
  },
};
