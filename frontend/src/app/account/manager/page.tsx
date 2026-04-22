"use client";

import { useEffect, useState } from "react";

import type { AccountRole } from "@/lib/auth-session";

type WorkspaceSubmission = {
  id: string;
  kind: "vehicle" | "driver";
  owner: string;
  title: string;
  docs: string[];
  status: "pending" | "verified";
};

const initialSubmissions: WorkspaceSubmission[] = [
  {
    id: "veh-1",
    kind: "vehicle",
    owner: "max@example.com",
    title: "AB-123-CD / Peugeot 308",
    docs: ["carte-grise-maxime-bai.pdf"],
    status: "pending",
  },
  {
    id: "drv-1",
    kind: "driver",
    owner: "luc@example.com",
    title: "Luc Martin / FR-8765",
    docs: ["licence-front.jpg", "licence-back.jpg", "passport-front.jpg", "passport-back.jpg"],
    status: "pending",
  },
];

export default function ManagerWorkspaceReviewPage() {
  const [role, setRole] = useState<AccountRole>("customer");
  const [items, setItems] = useState(initialSubmissions);

  useEffect(() => {
    async function loadRole() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const payload = (await response.json()) as {
          account?: { user?: { role?: AccountRole } };
        };
        if (payload.account?.user?.role) {
          setRole(payload.account.user.role);
        }
      } catch {
        // Keep default role.
      }
    }

    loadRole();
  }, []);

  if (role !== "product_manager" && role !== "admin") {
    return (
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6">
        <h2 className="text-2xl font-semibold text-[var(--ink)]">仅产品经理可访问</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          当前账号为普通用户。普通用户只保留已有界面，不展示审核功能。
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.94)] p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">产品经理</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">用户资料审核</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          可以认证用户上传的车辆信息、驾驶员信息。认证后前台不可再改，需管理员后台修改。
        </p>
      </section>

      {items.map((item) => (
        <article key={item.id} className="rounded-[22px] border border-[rgba(22,36,58,0.08)] bg-white px-5 py-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-[var(--ink)]">{item.kind === "vehicle" ? "车辆" : "驾驶员"}：{item.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">用户：{item.owner}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">资料：{item.docs.join("、")}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setItems((current) =>
                    current.map((entry) => (entry.id === item.id ? { ...entry, status: "verified" } : entry)),
                  )
                }
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--ink)]"
              >
                确认资料
              </button>
              <button
                onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}
                className="rounded-full border border-[rgba(22,36,58,0.12)] px-4 py-2 text-sm"
              >
                驳回
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            状态：{item.status === "verified" ? "已确认（锁定）" : "等待确认"}
          </p>
        </article>
      ))}
    </div>
  );
}
