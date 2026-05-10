"use client";

import type { CSSProperties } from "react";

type ErrorFallbackProps = {
  reset?: () => void;
};

const shellStyle: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: 24,
  background: "linear-gradient(180deg, #fff8ec 0%, #f7f1e8 100%)",
  color: "#182230",
  fontFamily: 'Inter, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
};

const panelStyle: CSSProperties = {
  width: "min(560px, 100%)",
  border: "1px solid #eaddcc",
  borderRadius: 24,
  background: "#fffaf2",
  padding: "34px 30px",
  boxShadow: "0 18px 50px rgba(24, 34, 48, 0.08)",
};

const actionStyle: CSSProperties = {
  minHeight: 44,
  border: 0,
  borderRadius: 999,
  background: "#f8b347",
  padding: "0 18px",
  color: "#182230",
  fontWeight: 700,
  textDecoration: "none",
  cursor: "pointer",
};

export function ErrorFallback({ reset }: ErrorFallbackProps) {
  return (
    <main style={shellStyle}>
      <section style={panelStyle}>
        <div
          style={{
            width: 46,
            height: 46,
            display: "grid",
            placeItems: "center",
            borderRadius: 16,
            background: "rgba(248, 179, 71, 0.2)",
            color: "#9a5b00",
            fontSize: 24,
            fontWeight: 800,
          }}
        >
          !
        </div>
        <h1 style={{ margin: "24px 0 12px", fontSize: 34, lineHeight: 1.12 }}>网站正在更新中</h1>
        <p style={{ margin: 0, color: "#667085", fontSize: 16, lineHeight: 1.7 }}>
          服务正在短暂重启，通常几秒钟后即可恢复访问。页面会自动刷新，也可以手动重试。
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginTop: 26 }}>
          <button type="button" style={actionStyle} onClick={() => (reset ? reset() : window.location.reload())}>
            刷新页面
          </button>
          <span style={{ fontSize: 13, color: "#667085" }}>预计 5-10 秒恢复</span>
        </div>
      </section>
    </main>
  );
}
