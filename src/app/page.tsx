'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Footer from '~/components/footer';

export default function HomePage() {
  const [show, setShow] = useState(false);

  const [timer, setTimer] = useState(0);

  useEffect(() => {
    // Start the timer after the component mounts
    const timerId = setTimeout(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000); // 1000 milliseconds = 1 second

    // Clean up the timer when the component unmounts
    if (timer === 7) {
      setTimer(0);
    }

    return () => clearTimeout(timerId);
  }, [timer]);

  return (
    <>
      <div className="h-[85vh] bg-primary text-white">
        <div className="mx-auto my-0 max-w-screen-2xl py-20">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="font-sans text-6xl">Print your next</div>
            <div className="text-4xl">{timer >= 3 ? 'Mug' : 'Tarpaulin'}</div>
          </div>
          {timer > 0 && (
            <div className="flex gap-4">
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
            </div>
          )}
          {/* {timer >= 3 && (
            <div className="flex gap-4">
              <div className="flex w-[300px] animate-[hero-up_1s_ease-in-out] flex-col gap-4">
                <div className="h-[300px] rounded-md  ">
                  <Image
                    src="/mug/mug1.JPG"
                    alt=""
                    width={100}
                    height={100}
                    className="h-full w-full rounded-md"
                  />
                </div>
                <div className="h-[300px] rounded-md  ">
                  <Image
                    src="/mug/mug2.JPG"
                    alt=""
                    width={100}
                    height={100}
                    className="h-full w-full rounded-md"
                  />
                </div>
              </div>
              <div className="mt-40 flex w-[300px] animate-[hero-up_1s_ease-in-out] flex-col gap-4 delay-300">
                <div className=" h-[300px] rounded-md  ">
                  <Image
                    src="/mug/mug3.JPG"
                    alt=""
                    width={100}
                    height={100}
                    className="h-full w-full rounded-md"
                  />
                </div>
                <div className="h-[300px] rounded-md  ">
                  <Image
                    src="/mug/mug4.JPG"
                    alt=""
                    width={100}
                    height={100}
                    className="h-full w-full rounded-md"
                  />
                </div>
              </div>
              <div className="mt-80 h-[300px] w-[300px] animate-[hero-up_1s_ease-in-out] rounded-md   delay-500">
                <Image
                  src="/mug/mug5.JPG"
                  alt=""
                  width={100}
                  height={100}
                  className="h-full w-full rounded-md"
                />
              </div>
              <div className="mt-40 flex w-[300px] animate-[hero-up_1s_ease-in-out] flex-col gap-4 delay-700">
                <div className=" h-[300px] rounded-md  ">
                  <Image
                    src="/mug/mug6.JPG"
                    alt=""
                    width={100}
                    height={100}
                    className="h-full w-full rounded-md"
                  />
                </div>
                <div className=" h-[300px] rounded-md  ">
                  <Image
                    src="/mug/mug7.JPG"
                    alt=""
                    width={100}
                    height={100}
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
            </div>
          )} */}
        </div>
      </div>

      <div className="relative z-10  bg-white py-16 shadow-[0px_-10px_60px_20px_rgba(255,255,255,0.5)]">
        <div className="mx-auto my-0 max-w-screen-2xl ">
          <div className="mx-auto my-0 max-w-screen-lg text-center">
            <div className="text-center text-2xl font-semibold">
              3J’s services: We’re here to help you stand out
            </div>
            <div className="mt-4">
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
          <div className="mt-16 flex gap-4">
            <Image src="/3J-banner.jpg" alt="3J Banner" width={1000} height={1000} />
            <div className="">
              <div className="text-xl font-semibold">Contact us</div>
              <div className="mt-4">
                <div className="flex items-center gap-4">
                  <Image src="/gmail.png" alt="Gmail Icon" height={28} width={28} />
                  <div>email@example.com</div>
                </div>
                <div className="flex items-center gap-4">
                  <Image src="/fb.png" alt="Facebook Icon" height={28} width={28} />
                  <div>email@example.com</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex gap-4">
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
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
