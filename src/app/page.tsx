import { ContactsSectionView } from '~/app/_components/contacts-section';
import { ProductCarousel } from '~/app/_components/product-carousel';
import { ServicesSectionView } from '~/app/_components/services-section';
import { api } from '~/trpc/server';

export default async function HomePage() {
  const carouselImage = await api.carouselImage.getAll.query();
  const service = await api.service.getAll.query();
  const contact = await api.contact.getAll.query();

  return (
    <>
      <main className="">
        <div className="h-[calc(100vh-24rem)] bg-primary text-white md:h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-8rem)]">
          <div className="mx-auto flex h-full max-w-screen-xl flex-col items-center justify-between py-4">
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
          </div>
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
              <div className="text-4xl font-semibold">Three J Since 2014</div>
              <div className="mt-4 md:mt-8 md:w-[75%]">
                Established in 2014, with a wide range of digital printing services from desktop
                document printing to large format printing like Tarpaulins and Stickers. We also
                provide variety of personalized printing in mugs, tumblers, lanyards, keychains, and
                many others. We also have different kinds of process in t-shirt printing from
                silkscreen process to digital process.
              </div>
            </div>
            <div className="flex flex-col gap-4 md:w-[50%]">
              <div>
                <div className="text-xl font-medium">Mission</div>
                <div className="mt-4 md:w-[75%]">
                  Our mission is to be the leading one-stop-printing shop for high quality,
                  competitively priced printing services by being the catalyst for the best and
                  latest innovative technology in the printing industry.
                </div>
              </div>
              <div>
                <div className="text-xl font-medium">Services</div>
                <div className="mt-4 md:w-[75%]">
                  Three J Print center provides services to nearby schools and offices here in Imus
                  but we are not limiting our horizons, for our printing services accommodate
                  clients all over the country.
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
