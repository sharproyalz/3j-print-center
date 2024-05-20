'use client';

import { Service } from '@prisma/client';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { CustomDialog } from '~/components/custom-dialog';
import { EllipsisVertical } from '~/components/svg/ellipsis-vertical';
import { api } from '~/trpc/react';

type Props = {
  initialData: Service[];
};

export function ServicesView({ initialData }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const params = useParams();
  const utils = api.useUtils();

  const getServicesView = api.service.getAll.useQuery(undefined, { initialData });
  const services = getServicesView.data;

  const deleteService = api.service.delete.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async () => {
      await utils.service.invalidate();
      toast.success('✔️ Service has been deleted');
      console.log('✔️ Service has been deleted');
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      console.log('❌ Internal Server Error');
    },
  });
  return (
    <>
      <main className=" p-8">
        <div className="flex justify-between ">
          <div className="text-4xl font-bold">Service</div>
        </div>

        <div className="mt-4 flex flex-wrap gap-8">
          <Link
            href={`/admin/services/add`}
            className=" flex h-[300px] w-[300px] items-center justify-center gap-4 rounded-sm border border-slate-500 p-4 hover:bg-slate-500 hover:text-white"
          >
            <div>Add</div>
            <Plus />
          </Link>
          {services?.map((service) => {
            return (
              <div key={service.id} className="w-[20rem]">
                <Link
                  href={`/admin/services/${service.slug}`}
                  className=" flex h-[300px] w-[300px] flex-col items-center gap-4 rounded-sm bg-slate-500 p-4"
                >
                  <div className="flex  items-center justify-center gap-4">
                    <Image src="/3J-icon.png" alt="" width={40} height={40} />
                    <div className="text-xl text-white">Services</div>
                  </div>
                  <div className="object-fit flex h-[12rem] w-[12rem]">
                    <CldImage
                      width="192"
                      height="192"
                      src={service.imageId ?? ''}
                      alt="Carousel Image"
                      className="rounded-sm"
                    />
                  </div>
                </Link>

                <div className="mt-4">
                  <div className="flex justify-between">
                    <Link
                      href={`/admin/services/${service.slug}`}
                      className="text-sm font-bold text-primary hover:text-primary/80"
                    >
                      {service.title} designs {`->`}{' '}
                    </Link>

                    <div className="relative">
                      <button type="button" onClick={() => setShowMenu(!showMenu)}>
                        <EllipsisVertical />
                      </button>
                      {showMenu && (
                        <div className="absolute right-0 top-10 z-10 flex flex-col rounded-md bg-white text-black shadow-xl">
                          <button
                            type="button"
                            onClick={() => router.push(`/admin/services/${service.slug}/edit`)}
                            className="flex gap-4 rounded-md p-4  hover:bg-primary-foreground "
                          >
                            Edit
                            <div>
                              <Pencil />
                            </div>
                          </button>

                          <CustomDialog
                            handleContinue={() =>
                              deleteService.mutate({ id: service?.id as string })
                            }
                            description="This action cannot be undone. This will permanently delete your service from our servers."
                          >
                            <button
                              type="button"
                              className="flex gap-4 rounded-md p-4 text-destructive hover:bg-destructive hover:text-white"
                            >
                              Delete
                              <div>
                                <Trash2 />
                              </div>
                            </button>
                          </CustomDialog>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="">{service.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
