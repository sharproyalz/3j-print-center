import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function CarouselImagePage() {
  return (
    <>
      <main className=" p-8">
        <div className="flex justify-between ">
          <div className="text-4xl font-bold">Carousel Image</div>
        </div>

        <div className="mt-4 flex flex-wrap gap-8">
          <Link
            href={`/admin/carousel-images/add`}
            className=" flex h-[24rem] w-[24rem] items-center justify-center gap-4 rounded-sm border border-slate-500 p-4 hover:bg-slate-500 hover:text-white"
          >
            <div>Add</div>
            <Plus />
          </Link>

          {Array.from({ length: 7 }).map((arr, arrIdx) => (
            <div key={arrIdx} className="h-[24rem] w-[24rem] bg-slate-500"></div>
          ))}
        </div>
      </main>
    </>
  );
}
