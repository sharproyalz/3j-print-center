import { Plus } from 'lucide-react';
import Link from 'next/link';
import { BreadcrumbComponent } from '~/app/admin/services/add/_components/breadcrumb';

export default function AddServicePage() {
  return (
    <>
      <main className="p-8">
        <div className="flex flex-col justify-between ">
          <BreadcrumbComponent />

          <div className="mt-4 text-4xl font-bold">Add New Service</div>
        </div>

        {/* Forms */}
        <div className="pb-12">
          <div className="mt-8 flex gap-8">
            <div className="flex flex-col gap-8">
              <div className=" h-[20rem] w-[20rem] bg-[#d9d9d9]"></div>
              <button
                type="button"
                className="w-full rounded-lg border border-secondary p-4 hover:bg-secondary hover:text-white"
              >
                Upload Service Image
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {/* Name */}
              <div className="flex flex-col">
                <label htmlFor="service-name">Name</label>

                <input
                  type="text"
                  name="service-name"
                  id="service-name"
                  className="rounded-sm border border-black p-2 text-lg focus:outline-primary"
                />
              </div>

              {/* Short Description */}
              <div className="flex flex-col">
                <label htmlFor="description">Short Description</label>

                <input
                  type="text"
                  name="description"
                  id="description"
                  className="rounded-sm border border-black p-2 text-lg focus:outline-primary"
                />
              </div>

              <Link
                href={`/admin/Service-image`}
                className="flex items-center justify-center gap-4 rounded-md bg-primary p-4 text-white"
              >
                <div>Add</div>
                <Plus />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
