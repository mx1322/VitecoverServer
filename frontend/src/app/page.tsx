import Link from "next/link";
import { homeProductCards } from "@/lib/home-product-cards";

export default function HomePage() {
  return (
    <main className="pb-20">
      <section className="section-wrap py-16 md:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.72)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            Temporary vehicle insurance
          </div>

          <h1
            className="mt-6 text-5xl font-semibold leading-[0.98] tracking-tight text-[var(--ink)] md:text-7xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Choose your insurance product and start the quote in a few minutes.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            The homepage now stays focused on one thing: picking the right temporary vehicle
            product. Each card gives a fast pricing signal and sends the customer straight into the
            quote flow.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {homeProductCards.map((product) => {
            const cardBody = (
              <article className="flex h-full flex-col rounded-[32px] border border-[rgba(22,36,58,0.08)] bg-[rgba(255,255,255,0.92)] p-6 shadow-[0_24px_70px_rgba(22,36,58,0.08)] transition duration-200 ease-out hover:scale-[1.02] hover:shadow-[0_30px_80px_rgba(22,36,58,0.12)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  {product.eyebrow}
                </p>
                <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">{product.title}</h2>
                <p className="mt-4 min-h-[72px] text-sm leading-6 text-[var(--muted)]">
                  {product.description}
                </p>

                <div className="mt-8 rounded-[24px] bg-[rgba(255,179,71,0.14)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    Starting point
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-[var(--ink)]">
                    {product.primaryMetric}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {product.secondaryMetric}
                  </p>
                </div>

                <div className="mt-8">
                  {product.available && product.href ? (
                    <span className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(255,179,71,0.18)] transition duration-200 ease-out group-hover:scale-[1.03]">
                      Select this product
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center rounded-full border border-[rgba(22,36,58,0.12)] bg-[rgba(22,36,58,0.04)] px-6 py-3 text-sm font-semibold text-[var(--muted)]">
                      Available soon
                    </span>
                  )}
                </div>
              </article>
            );

            return product.available && product.href ? (
              <Link key={product.code} href={product.href} className="group">
                {cardBody}
              </Link>
            ) : (
              <div key={product.code}>{cardBody}</div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
