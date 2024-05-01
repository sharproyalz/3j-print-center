'use client';

import { Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCarousel } from '~/app/_components/product-carousel';
import Footer from '~/components/footer';

export default function HomePage() {
  return (
    <>
      <div className="h-[85vh] bg-primary text-white">
        <div className="mx-auto my-0 max-w-screen-xl px-20 py-16">
          {/* <div className="flex flex-col items-center justify-center gap-4">
            <div className="font-mono text-6xl font-semibold uppercase ">Print your next</div>
            <div className="font-mono text-4xl uppercase tracking-tighter">Mug</div>
          </div> */}

          <ProductCarousel />
          {/* <div className="flex gap-4">
              <div className="flex w-[300px] animate-[hero-up_1s_ease-in-out] flex-col gap-4">
                <div className="h-[300px] rounded-md">
                  <Image
                    src="/mug/mug1.JPG"
                    alt=""
                    width={200}
                    height={200}
                    className="h-full w-full rounded-md"
                  />
                </div>
                <div className="h-[300px] rounded-md  ">
                  <Image
                    src="/mug/mug2.JPG"
                    alt=""
                    width={200}
                    height={200}
                    className="h-full w-full rounded-md"
                  />
                </div>
              </div>
              <div className="mt-40 flex w-[300px] animate-[hero-up_1s_ease-in-out] flex-col gap-4 delay-300">
                <div className=" h-[300px] rounded-md  ">
                  <Image
                    src="/mug/mug3.JPG"
                    alt=""
                    width={200}
                    height={200}
                    className="h-full w-full rounded-md"
                  />
                </div>
                <div className="h-[300px] rounded-md  ">
                  <Image
                    src="/mug/mug4.JPG"
                    alt=""
                    width={200}
                    height={200}
                    className="h-full w-full rounded-md"
                  />
                </div>
              </div>
              <div className="mt-80 h-[300px] w-[300px] animate-[hero-up_1s_ease-in-out] rounded-md   delay-500">
                <Image
                  src="/mug/mug5.JPG"
                  alt=""
                  width={200}
                  height={200}
                  className="h-full w-full rounded-md"
                />
              </div>
              <div className="mt-40 flex w-[300px] animate-[hero-up_1s_ease-in-out] flex-col gap-4 delay-700">
                <div className=" h-[300px] rounded-md  ">
                  <Image
                    src="/mug/mug6.JPG"
                    alt=""
                    width={200}
                    height={200}
                    className="h-full w-full rounded-md"
                  />
                </div>
                <div className=" h-[300px] rounded-md  ">
                  <Image
                    src="/mug/mug7.JPG"
                    alt=""
                    width={200}
                    height={200}
                    className="h-full w-full rounded-md"
                  />
                </div>
              </div>
              <div className="flex w-[300px] animate-[hero-up_1s_ease-in-out] flex-col gap-4 delay-1000">
                <div className="h-[300px] rounded-md  ">
                  <Image
                    src="/mug/mug8.JPG"
                    alt=""
                    width={100}
                    height={100}
                    className="h-full w-full rounded-md"
                  />
                </div>
                <div className="h-[300px] rounded-md  ">
                  <Image
                    src="/mug/mug9.JPG"
                    alt=""
                    width={100}
                    height={100}
                    className="h-full w-full rounded-md"
                  />
                </div>
              </div>
            </div> */}
        </div>
      </div>

      <div className="relative z-10  bg-white py-16 shadow-[0px_-10px_60px_20px_rgba(255,255,255,0.5)]">
        <section className="mx-auto my-0 max-w-screen-2xl px-16">
          <div className="">
            <div className="text-center text-2xl font-semibold">
              3J’s services: We’re here to help you stand out
            </div>
            <div className="mt-4 text-center">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Alias itaque natus minus
              ducimus sed quia impedit! Sint tempore tempora nulla quaerat! Debitis, dolor. Iste at
              alias officiis possimus amet voluptate, adipisci a ipsa assumenda doloribus distinctio
              voluptatum minus illum fuga aperiam minima sint! Consequatur odio ipsa eius mollitia
              delectus corrupti?
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((arr, arrIdx) => (
              <Link href="#" key={arrIdx} className="mt-8">
                <div className=" flex h-[300px] w-[300px] flex-col items-center gap-4 rounded-sm bg-slate-500 p-4">
                  <div className="flex  items-center justify-center gap-4">
                    <Image src="/3J-icon.png" alt="" width={40} height={40} />
                    <div className="text-xl text-white">Services</div>
                  </div>
                  <Image src="/mug.jpg" alt="Mug" width={200} height={200} className="rounded-sm" />
                </div>
                <div className="mt-4">
                  <div className="text-sm font-bold text-primary hover:text-primary/80">
                    Mug designs {`->`}{' '}
                  </div>
                  <div className="">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus, eligendi.
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto my-0 mt-16 flex max-w-screen-2xl gap-4 px-16">
          <Image src="/3J-banner.jpg" alt="3J Banner" width={1000} height={1000} />
          <div className="">
            <div className="text-xl font-semibold">Contact us</div>
            <div className="mt-4">
              <div className="flex items-center gap-4 py-2">
                <Image src="/gmail.png" alt="Gmail Icon" height={28} width={28} />
                <div>printcenter.3j@gmail.com</div>
              </div>
              <div className="flex items-center gap-4 py-2">
                <Image src="/fb.png" alt="Facebook Icon" height={28} width={28} />
                <div>Threej Printcenter</div>
              </div>
              <div className="flex items-center gap-4 py-2">
                <Phone width={28} />
                <div>0933-942-2580 / 0915-714-3388</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto my-0 mt-16 flex max-w-screen-2xl gap-4 px-16">
          <div className="w-[50%]">
            <div className="text-4xl font-semibold">3J Since 2014</div>
            <div className="mt-8 w-[75%]">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro molestias accusantium
              repudiandae, exercitationem aspernatur asperiores maxime nihil eaque, fugit illo
              excepturi pariatur eveniet sed harum officia aliquid iure. Repudiandae, sapiente
              repellendus expedita tempora praesentium eos enim alias minus voluptatem explicabo
              placeat, deserunt neque autem nemo atque, laborum repellat corrupti omnis!
            </div>
          </div>
          <div className="flex w-[50%] flex-col gap-4">
            <div>
              <div className="text-xl font-medium">Quality</div>
              <div className="mt-4 w-[75%]">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsam corporis aut itaque
                veritatis odio illo accusantium doloremque numquam nesciunt molestiae.
              </div>
            </div>
            <div>
              <div className="text-xl font-medium">Services</div>
              <div className="mt-4 w-[75%]">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsam corporis aut itaque
                veritatis odio illo accusantium doloremque numquam nesciunt molestiae.
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
