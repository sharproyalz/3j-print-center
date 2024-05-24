'use client';

import { Service } from '@prisma/client';
import { Pencil, Trash2 } from 'lucide-react';
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
  service: Service;
};

export function ServiceProduct({ service }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const params = useParams();
  const utils = api.useUtils();

  const deleteService = api.service.delete.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async () => {
      await utils.service.invalidate();
      toast.success('Service has been deleted');
      console.log('Service has been deleted');
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      console.log('Internal Server Error');
    },
  });

  return (
    <div key={service.id} className="">
      <Link
        href={`/admin/services/${service.id}`}
        className="flex h-[300px] w-[300px] flex-col items-center gap-4 rounded-sm bg-slate-500 p-4"
      >
        <div className="flex  items-center justify-center gap-4">
          <Image src="/3J-icon.png" alt="" width={40} height={40} />
          <div className="text-xl text-white">{service.title}</div>
        </div>
        <div className="object-fit flex h-[12rem] w-[12rem]">
          <CldImage
            width="192"
            height="192"
            src={service.imageId ?? ''}
            alt="Service Image"
            className="rounded-sm"
          />
        </div>
      </Link>

      <div className="mt-4">
        <div className="flex justify-between">
          <Link
            href={`/admin/services/${service.id}`}
            className="text-sm font-bold text-primary hover:text-primary/80"
          >
            Show all designs {`->`}
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="hover:text-primary"
            >
              <EllipsisVertical />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-10 z-10 flex flex-col rounded-md bg-white text-black shadow-xl">
                <button
                  type="button"
                  onClick={() => router.push(`/admin/services/${service.id}/edit`)}
                  className="flex gap-4 rounded-md p-4  hover:bg-primary-foreground "
                >
                  Edit
                  <div>
                    <Pencil />
                  </div>
                </button>

                <CustomDialog
                  handleContinue={() => deleteService.mutate({ id: service?.id as string })}
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
        <div className="w-[16rem]">{service.description}</div>
      </div>
    </div>
  );
}