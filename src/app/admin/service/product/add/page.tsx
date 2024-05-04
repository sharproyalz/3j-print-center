import { BreadcrumbComponent } from '~/app/admin/service/product/add/_components/breadcrumb';

export default function AddServiceProductPage() {
  return (
    <>
      <main className="p-8">
        <div className="flex flex-col justify-between ">
          <BreadcrumbComponent />

          <div className="mt-4 text-4xl font-bold">Add New Service</div>
        </div>

        {/* Forms */}
        <div className="pb-12">
          <div className="mt-8 flex justify-center gap-8">
            <div className="flex w-full flex-col items-center gap-8">
              <div className=" h-[20rem] w-[20rem] bg-[#d9d9d9]"></div>
              <button type="button" className="w-full rounded-lg bg-primary p-4 text-white">
                Upload Service Image
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
