import Link from "next/link";

import { homeProductCards } from "@/lib/home-product-cards";

export default function HomePage() {
  const cardShellClass =
    "group flex h-full min-h-[540px] flex-col rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-6 shadow-[0_24px_70px_rgba(22,36,58,0.08)] transition duration-200 ease-out hover:translate-y-[-2px] hover:shadow-[0_30px_80px_rgba(22,36,58,0.12)]";
  const categoryClass =
    "text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--muted)]";
  const titleClass =
    "mt-4 min-h-[72px] text-[30px] font-semibold leading-[1.02] text-[var(--ink)]";
  const iconWrapClass =
    "mt-5 flex h-[120px] w-[120px] items-center justify-center rounded-[28px] bg-[rgba(255,179,71,0.14)]";
  const descriptionClass = "mt-4 min-h-[84px] text-sm leading-6 text-[var(--muted)]";
  const priceBlockClass =
    "mt-8 rounded-[24px] border border-[rgba(255,179,71,0.12)] bg-[rgba(255,179,71,0.14)] p-5";

  return (
    <main>
      <section className="section-wrap pb-10 pt-12 md:pb-14 md:pt-16">
        <div className="max-w-5xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.84)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            TEMPORARY AUTO INSURANCE
          </div>

          <h1
            className="mt-4 max-w-5xl text-[2.9rem] font-semibold leading-[0.96] tracking-tight text-[var(--ink)] md:text-[4.3rem]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Get temporary auto insurance in minutes.
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-7 text-[rgba(22,36,58,0.72)] md:text-[1.15rem]">
            Choose your cover online and receive your policy by email after review.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-[var(--ink)] shadow-[0_14px_32px_rgba(255,179,71,0.24)] transition duration-200 ease-out hover:translate-y-[-1px] hover:shadow-[0_18px_40px_rgba(255,179,71,0.3)]"
            >
              Start Quote
            </Link>
            <Link
              href="/#products"
              className="inline-flex items-center justify-center rounded-full border border-[rgba(22,36,58,0.12)] bg-[rgba(255,255,255,0.84)] px-7 py-3.5 text-sm font-semibold text-[var(--ink)] transition duration-200 ease-out hover:border-[rgba(22,36,58,0.22)] hover:bg-white"
            >
              Browse Products
            </Link>
          </div>

          <p className="mt-4 text-sm font-medium text-[rgba(22,36,58,0.62)]">
            Short-term cover · 100% online · Policy by email
          </p>
        </div>
      </section>

      <section id="products" className="section-wrap pb-16 md:pb-24">
        <div className="max-w-3xl">
          <h2
            className="text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Choose your cover
          </h2>
          <p className="mt-4 text-lg leading-7 text-[var(--muted)]">
            Temporary insurance products for different vehicle types.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {homeProductCards.map((product) => {
            const [priceMain, priceSuffix] = product.price.split(" / ");
            const cardBody = (
              <article className={cardShellClass}>
                <p className={categoryClass}>{product.category}</p>
                <h3 className={titleClass}>{product.title}</h3>

                <div className={iconWrapClass}>
                  <img
                    src={product.iconPath}
                    alt={product.title}
                    className="h-[76px] w-[76px] object-contain"
                  />
                </div>

                <p className={descriptionClass}>{product.description}</p>

                <div className={priceBlockClass}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                    {product.priceLabel}
                  </p>
                  <p className="mt-3 text-[32px] font-semibold leading-none tracking-tight text-[var(--ink)] whitespace-nowrap">
                    {priceMain}
                    {priceSuffix ? (
                      <span className="text-[24px] font-medium"> / {priceSuffix}</span>
                    ) : null}
                  </p>
                </div>

                <div className="mt-auto pt-8">
                  {product.available && product.href ? (
                    <span className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)] transition duration-200 ease-out group-hover:scale-[1.03]">
                      {product.buttonLabel}
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center rounded-full border border-[rgba(22,36,58,0.12)] bg-[rgba(255,255,255,0.82)] px-6 py-3 text-sm font-semibold text-[var(--ink)]">
                      {product.buttonLabel}
                    </span>
                  )}
                </div>
              </article>
            );

            return product.available && product.href ? (
              <Link key={product.code} href={product.href} className="block">
                {cardBody}
              </Link>
            ) : (
              <div key={product.code}>{cardBody}</div>
            );
          })}
        </div>
      </section>

      <section className="section-wrap pb-16 md:pb-24">
        <div className="rounded-[36px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.88)] p-8 shadow-[0_20px_60px_rgba(22,36,58,0.06)] md:p-10">
          <div className="max-w-2xl">
            <h2
              className="text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              How it works
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              A simple online flow from product selection to policy delivery.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Choose a product",
              "Enter driver and vehicle details",
              "Pay online",
              "Receive your policy by email after review",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-[24px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,252,247,0.92)] p-5"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--muted)]">
                  Step {index + 1}
                </p>
                <p className="mt-4 text-lg font-semibold leading-7 text-[var(--ink)]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wrap pb-16 md:pb-24">
        <div className="rounded-[36px] border border-[rgba(22,36,58,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,246,231,0.92))] p-8 shadow-[0_20px_60px_rgba(22,36,58,0.06)] md:p-10">
          <div className="max-w-2xl">
            <h2
              className="text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Why choose Vitecover
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "100% online process",
              "Short-term insurance products",
              "Policy documents delivered digitally",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.8)] p-5"
              >
                <p className="text-lg font-semibold leading-7 text-[var(--ink)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
