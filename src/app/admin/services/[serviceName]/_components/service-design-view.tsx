'use client';

import { Pencil, Plus, Trash2 } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { BreadcrumbComponent } from '~/app/admin/services/[serviceName]/_components/breadcrumb';
import { BreadcrumbEllipsis } from '~/components/ui/breadcrumb';
import { api } from '~/trpc/react';

export function ServiceDesignView({ serviceName }: { serviceName: string }) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const params = useParams();

  const getServiceQuery = api.service.get.useQuery({ slug: params.serviceName as string });
  const service = getServiceQuery.data;

  const getServiceDesignQuery = api.product.getAll.useQuery();
  const serviceDesign = getServiceDesignQuery.data;

  const deleteService = api.service.delete.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async () => {
      toast.success('✔️ Service has been deleted.');
      console.log('✔️ Service has been deleted');
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      toast.error('❌ Internal Server Error');
      console.log('❌ Internal Server Error');
    },
  });

  return (
    <>
      <main className="p-8">
        <div className="flex flex-col justify-between ">
          <BreadcrumbComponent slug={serviceName} />

          <div className="flex items-center justify-between">
            <div className="mt-4 text-4xl font-bold capitalize">{serviceName}</div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="flex h-8 w-8 items-center rounded-full hover:bg-primary-foreground "
              >
                <BreadcrumbEllipsis />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-10 z-10 flex flex-col rounded-md bg-white text-black shadow-xl">
                  <button
                    type="button"
                    onClick={() => router.push(`/admin/services/${serviceName}/edit`)}
                    className="flex gap-4 rounded-md p-4  hover:bg-primary-foreground "
                  >
                    Edit
                    <div>
                      <Pencil />
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteService.mutate({ id: service?.id as string })}
                    className="flex gap-4 rounded-md p-4 text-destructive hover:bg-destructive hover:text-white"
                  >
                    Delete
                    <div>
                      <Trash2 />
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-8">
          <Link
            href={`/admin/services/${serviceName}/add`}
            className=" flex h-[300px] w-[300px] items-center justify-center gap-4 rounded-sm border border-slate-500 p-4 hover:bg-slate-500 hover:text-white"
          >
            <div>Add</div>
            <Plus />
          </Link>

          {serviceDesign?.map((image) => {
            return (
              <div
                key={image.id}
                className=" flex h-[300px] w-[300px] flex-col items-center  rounded-sm bg-slate-500 p-4"
              >
                <div className="flex  items-center justify-center gap-4">
                  <Image src="/3J-icon.png" alt="" width={40} height={40} />
                  <div className="text-xl text-white">Products</div>
                </div>
                <div className="object-fit mx-auto mt-8 flex h-[12rem] w-[12rem]">
                  <CldImage
                    width="192"
                    height="192"
                    src={image.imageId}
                    alt="Avatar logo"
                    className=""
                  />
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
