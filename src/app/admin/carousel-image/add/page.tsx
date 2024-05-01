import { Plus } from 'lucide-react';
import Link from 'next/link';
import { BreadcrumbComponent } from '~/app/admin/carousel-image/add/_components/breadcrumb';

export default function CarouselImagePage() {
  return (
    <>
      <main className="p-8">
        <div className="flex flex-col justify-between ">
          <BreadcrumbComponent />

          <div className="mt-4 text-4xl font-bold">Add New Carousel Image</div>
        </div>

        {/* Forms */}
        <div className="flex flex-col pb-12">
          <div className="flex flex-col gap-4">
            <div className="mt-8 h-[24rem] w-full bg-[#d9d9d9]"></div>
            <button
              type="button"
              className="w-full rounded-lg border border-secondary p-4 hover:bg-secondary hover:text-white"
            >
              Upload Carousel Image
            </button>

            <div className="flex flex-col">
              <label htmlFor="image-link">Link to</label>

              <input
                type="text"
                name="image-link"
                id="image-link"
                className="rounded-sm border border-black p-2 text-lg focus:outline-primary"
              />
            </div>

            <Link
              href={`/admin/carousel-image`}
              className="flex items-center justify-center gap-4 rounded-md bg-primary p-4 text-white"
            >
              <div>Add</div>
              <Plus />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
