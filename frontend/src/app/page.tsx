import Link from "next/link";

import { getHomeProductCards } from "@/lib/home-product-cards";

export default async function HomePage() {
  const homeProductCards = await getHomeProductCards();
  const cardShellClass =
    "group flex h-full min-h-[700px] flex-col rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-6 shadow-[0_20px_56px_rgba(22,36,58,0.08)] transition duration-200 ease-out hover:translate-y-[-2px] hover:shadow-[0_28px_72px_rgba(22,36,58,0.12)]";
  const categoryClass =
    "text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--muted)]";
  const titleClass =
    "text-[24px] font-semibold leading-[1.08] tracking-tight text-[var(--ink)]";
  const iconWrapClass =
    "mt-4 flex h-[250px] w-full items-center justify-center rounded-[26px] bg-[rgba(255,179,71,0.14)] px-4 py-6";
  const descriptionClass =
    "text-[15px] leading-7 text-[var(--muted)]";
  const priceBlockClass =
    "mt-4 rounded-[22px] border border-[rgba(255,179,71,0.12)] bg-[rgba(255,179,71,0.14)] px-5 py-4";

  return (
    <main>
      <section className="section-wrap pb-1 pt-6 md:pb-6 md:pt-6">
        <div className="max-w-5xl">
          <h1
            className="mt-2 max-w-none whitespace-nowrap text-[2.2rem] font-semibold leading-[1] tracking-tight text-[var(--ink)] md:text-[3.3rem]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Get temporary auto insurance in minutes.
          </h1>

        </div>
      </section>

      <section id="products" className="section-wrap pb-16 md:pb-24">
        <div className="max-w-3xl">
          <p className="mt-4 text-lg leading-7 text-[var(--muted)]">
            Choose your temporary insurance products according to vehicle types.
          </p>
        </div>

        <div className="mt-5 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {homeProductCards.map((product) => {
            const [priceMain, priceSuffix] = product.price.split(" / ");
            const cardBody = (
              <article className={cardShellClass}>
                <p className={categoryClass}>{product.category}</p>
                <div className="mt-4 min-h-[50px]">
                  <h3 className={titleClass}>{product.title}</h3>
                </div>

                <div className={iconWrapClass}>
                  <img
                    src={product.iconPath}
                    alt={product.title}
                    className="h-auto w-full max-w-[320px] object-contain"
                  />
                </div>

                <div className="mt-5 min-h-[72px] border-t border-[rgba(255,179,71,0.18)] pt-4">
                  <p className={descriptionClass}>{product.description}</p>
                </div>

                <div className={priceBlockClass}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                    {product.priceLabel}
                  </p>
                  <p className="mt-2 text-[28px] font-semibold leading-none tracking-tight text-[var(--ink)] whitespace-nowrap">
                    {priceMain}
                    {priceSuffix ? (
                      <span className="text-[18px] font-medium"> / {priceSuffix}</span>
                    ) : null}
                  </p>
                </div>

                <div className="mt-5">
                  {product.available && product.href ? (
                    <span className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)] transition duration-200 ease-out group-hover:scale-[1.03]">
                      {product.buttonLabel}
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center rounded-full border border-[rgba(22,36,58,0.12)] bg-white px-6 py-3 text-sm font-semibold text-[var(--ink)]">
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
