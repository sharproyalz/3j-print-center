import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function CarouselImagePage() {
  return (
    <>
      <main className=" p-8">
        <div className="flex justify-between ">
          <div className="text-4xl font-bold">Carousel Image</div>
          <Link
            href={`/admin/carousel-image/add`}
            className="flex items-center gap-4 rounded-md border border-secondary p-4 hover:bg-secondary hover:text-white"
          >
            <div>Add</div>
            <Plus />
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-8">
          {Array.from({ length: 7 }).map((arr, arrIdx) => (
            <div key={arrIdx} className="h-[24rem] w-[24rem] bg-[#d9d9d9]"></div>
          ))}
        </div>
      </main>
    </>
  );
}
