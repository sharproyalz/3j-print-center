import { ContactsSectionView } from '~/app/_components/contacts-section';
import { ProductCarousel } from '~/app/_components/product-carousel';
import { ServicesSectionView } from '~/app/_components/services-section';
import { api } from '~/trpc/server';
import { OrderBy } from '~/zod-schemas/service';

export default async function HomePage() {
  const carouselImage = await api.carouselImage.getAll.query();
  const service = await api.service.getAll.query({ orderBy: OrderBy.ASC });
  const contact = await api.contact.getAll.query();

  return (
    <>
      <main className="">
        <div className="bg-primary text-white md:px-12 md:py-12">
          <section className="mx-auto flex max-w-screen-xl flex-col items-center justify-between py-4">
            <ProductCarousel initialData={carouselImage} />

            {/* <Link
              href="/#services"
              className={cn(
                buttonVariants({ variant: 'outline-primary', size: 'icon' }),
                'animate-bounce rounded-full md:hidden'
              )}
            >
              <ChevronsDown />
            </Link> */}
          </section>
        </div>

        <div className="relative z-10 bg-white py-16 shadow-[0px_-10px_60px_20px_rgba(255,255,255,0.5)]">
          {/* Services */}
          <ServicesSectionView initialData={service} />

          {/* Contact Information */}
          <ContactsSectionView initialData={contact} />

          <section
            id="about"
            className="mx-auto my-0 mt-16 flex max-w-screen-2xl flex-col gap-4 px-8 md:flex-row md:px-16"
          >
            <div className="md:w-[50%]">
              <h2 className="text-center text-3xl font-semibold md:text-left">
                About Three J Print Center: Your Trusted Printing Shop in Bucandala, Imus since 2014
              </h2>

              <p className="mt-4 text-center md:mt-8 md:w-[90%] md:text-left">
                Founded in 2014, Three J Print Center has grown to become a go-to printing shop in
                Bucandala, Imus, known for offering comprehensive digital printing services. Our
                offerings span from everyday document printing to large format projects, such as
                eye-catching tarpaulins, vibrant stickers, and custom design work. We also provide a
                range of personalized printing options—from mugs and tumblers to lanyards and
                keychains. Our t-shirt printing services include both traditional silkscreen and
                digital methods, ensuring versatility for any project.
              </p>
            </div>

            <div className="flex flex-col gap-4 md:w-[50%]">
              <div>
                <h3 className="text-center text-xl font-medium md:text-left">Our Mission</h3>

                <p className="mt-4 text-center md:w-[90%] md:text-left">
                  Our mission at Three J Print Center is to become the leading one-stop printing
                  shop, offering top-notch, affordable printing services using the latest
                  technology. We aim to set the standard for high-quality, innovative printing in
                  Bucandala, Imus, and beyond.
                </p>
              </div>

              <div>
                <h3 className="text-center text-xl font-medium md:text-left">
                  Printing Services Near You
                </h3>

                <p className="mt-4 text-center md:w-[90%] md:text-left">
                  Three J Print Center proudly serves Bucandala, Imus, and surrounding areas,
                  supporting local schools, businesses, and offices with printing solutions that
                  exceed expectations. While we are a trusted name locally, we're equipped to serve
                  clients from across the Philippines, offering everything from graphic design to
                  specialized printing, all at competitive rates.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
