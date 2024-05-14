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
      console.log('✔️ Organization has been created.');
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

          <div className="mt-4 text-4xl font-bold">Add New Carousel Image</div>
        </div>

        {/* Forms */}
        <div className="flex flex-col pb-12">
          <form
            onSubmit={carouselImageForm.handleSubmit(onSubmit, (err) => console.log(err))}
            className="flex flex-col gap-4"
          >
            {carouselImageForm.watch('imageId') ? (
              <div className="mx-auto">
                <CldImage
                  width="384"
                  height="384"
                  src={carouselImageForm.watch('imageId') ?? ''}
                  alt="Avatar logo"
                  className="mt-8"
                />
              </div>
            ) : (
              <div className="mt-8 h-[24rem] w-full bg-[#d9d9d9]"></div>
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
                name="image-link"
                id="image-link"
                placeholder="(optional)"
                className="rounded-sm border border-black p-2 text-lg focus:outline-primary"
              />
            </div>

            <button
              // href={`/admin/carousel-images`}
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
