import Link from 'next/link';

export function PriceGuideCta() {
  return (
    <section
      id="price-guide"
      className="mx-auto max-w-screen-2xl px-8 pt-16 md:px-16 md:pt-20"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold md:text-3xl">Need a price estimate?</h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          Choose a service, enter your job details, and see an estimate before you send a request.
        </p>
        <Link
          href="/service-guide"
          className="mt-6 inline-block text-sm font-bold text-primary hover:text-primary/80"
        >
          Open the price guide {'->'}
        </Link>
      </div>
    </section>
  );
}
