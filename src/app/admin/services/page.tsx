import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ServicePage() {
  return (
    <>
      <main className=" p-8">
        <div className="flex justify-between ">
          <div className="text-4xl font-bold">Service</div>
        </div>

        <div className="mt-4 flex flex-wrap gap-8">
          <Link
            href={`/admin/services/product/add`}
            className=" flex h-[300px] w-[300px] items-center justify-center gap-4 rounded-sm border border-slate-500 p-4 hover:bg-slate-500 hover:text-white"
          >
            <div>Add</div>
            <Plus />
          </Link>
          {Array.from({ length: 1 }).map((arr, arrIdx) => {
            return (
              <Link href="/admin/services/product" key={arrIdx} className="w-[20rem]">
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
            );
          })}
        </div>
      </main>
    </>
  );
}
