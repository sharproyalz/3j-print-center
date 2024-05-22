import { ContactsSectionView } from '~/app/_components/contacts-section';
import { ProductCarousel } from '~/app/_components/product-carousel';
import { ServicesSectionView } from '~/app/_components/services-section';
import Footer from '~/components/footer';
import { api } from '~/trpc/server';

export default async function HomePage() {
  const carouselImage = await api.carouselImage.getAll.query();
  const service = await api.service.getAll.query();
  const contact = await api.contact.getAll.query();

  return (
    <>
      <main className="">
        <div className="h-[85vh] bg-primary text-white">
          <div className="mx-auto my-0 max-w-screen-xl py-4">
            <ProductCarousel initialData={carouselImage} />
          </div>
        </div>

        <div className="relative z-10 bg-white py-16 shadow-[0px_-10px_60px_20px_rgba(255,255,255,0.5)]">
          {/* Services */}
          <ServicesSectionView initialData={service} />

          {/* Contact Information */}
          <ContactsSectionView initialData={contact} />

          <section id="about" className="mx-auto my-0 mt-16 flex max-w-screen-2xl gap-4 px-16">
            <div className="w-[50%]">
              <div className="text-4xl font-semibold">3J Since 2014</div>
              <div className="mt-8 w-[75%]">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro molestias
                accusantium repudiandae, exercitationem aspernatur asperiores maxime nihil eaque,
                fugit illo excepturi pariatur eveniet sed harum officia aliquid iure. Repudiandae,
                sapiente repellendus expedita tempora praesentium eos enim alias minus voluptatem
                explicabo placeat, deserunt neque autem nemo atque, laborum repellat corrupti omnis!
              </div>
            </div>
            <div className="flex w-[50%] flex-col gap-4">
              <div>
                <div className="text-xl font-medium">Quality</div>
                <div className="mt-4 w-[75%]">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsam corporis aut
                  itaque veritatis odio illo accusantium doloremque numquam nesciunt molestiae.
                </div>
              </div>
              <div>
                <div className="text-xl font-medium">Services</div>
                <div className="mt-4 w-[75%]">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsam corporis aut
                  itaque veritatis odio illo accusantium doloremque numquam nesciunt molestiae.
                </div>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
}
