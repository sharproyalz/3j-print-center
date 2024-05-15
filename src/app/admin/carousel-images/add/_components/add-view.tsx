'use client';

import { Plus } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { BreadcrumbComponent } from '~/app/admin/carousel-images/add/_components/breadcrumb';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
import { api } from '~/trpc/react';
import { type schemas } from '~/zod-schemas';

type Inputs = z.infer<typeof schemas.carouselImage.create>;

export function CarouselImageAddView() {
  const router = useRouter();
  const carouselImageForm = useForm<Inputs>();

  const addCarouselImage = api.carouselImage.create.useMutation({
    onSuccess: async ({ id }) => {
      console.log('✔️ Banner has been added.');
      await router.push(`/admin/carousel-images`);
    },
  });

  const onSuccessUpload: OnSuccessUpload = (result) => {
    carouselImageForm.setValue('image', result.info?.secure_url ?? '');
    carouselImageForm.setValue('imageId', result.info?.public_id ?? '');
  };

  const onSubmit: SubmitHandler<Inputs> = (values) => {
    addCarouselImage.mutate(values);
    console.log(values);
  };
  return (
    <>
      <main className="p-8">
        <div className="flex flex-col justify-between ">
          <BreadcrumbComponent />

          <div className="mt-4 text-4xl font-bold">Add New Banner</div>
        </div>

        {/* Forms */}
        <div className="flex flex-col pb-12">
          <form
            onSubmit={carouselImageForm.handleSubmit(onSubmit, (err) => console.log(err))}
            className="flex flex-col gap-4"
          >
            {carouselImageForm.watch('imageId') ? (
              <div className="object-fit mx-auto mt-8 flex h-[32rem] w-[32rem]">
                <CldImage
                  width="512"
                  height="512"
                  src={carouselImageForm.watch('imageId') ?? ''}
                  alt="Avatar logo"
                  className=""
                />
              </div>
            ) : (
              <div className="mx-auto mt-8 h-[32rem] w-[32rem] bg-[#d9d9d9]"></div>
            )}

            <UploadButton
              className="w-full rounded-lg border border-secondary p-4 hover:bg-secondary hover:text-white"
              folder="carousel-images"
              resourceType={ResourceType.IMAGE}
              onSuccess={onSuccessUpload}
            >
              Upload
            </UploadButton>

            <div className="flex flex-col">
              <label htmlFor="image-link">Link to</label>

              <input
                type="text"
                id="image-link"
                placeholder="(optional)"
                className="rounded-sm border border-black p-2 text-lg focus:outline-primary"
                {...carouselImageForm.register('link')}
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-4 rounded-md bg-primary p-4 text-white"
            >
              <div>Add</div>
              <Plus />
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
