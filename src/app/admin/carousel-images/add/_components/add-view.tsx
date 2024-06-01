'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangleIcon, Plus } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { BreadcrumbComponent } from '~/app/admin/carousel-images/add/_components/breadcrumb';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
import { api } from '~/trpc/react';
import { schemas } from '~/zod-schemas';

type Inputs = z.infer<typeof schemas.carouselImage.create>;

export function CarouselImageAddView() {
  const router = useRouter();
  const addCarouselImageForm = useForm<Inputs>({
    resolver: zodResolver(schemas.carouselImage.create),
  });

  const addCarouselImage = api.carouselImage.create.useMutation({
    onSuccess: async ({ id }) => {
      toast.success('Banner has been added.');
      console.log('Banner has been added.');
      await router.push(`/admin/carousel-images`);
    },
  });

  const onSuccessUpload: OnSuccessUpload = (result) => {
    addCarouselImageForm.setValue('image', result.info?.secure_url ?? '');
    addCarouselImageForm.setValue('imageId', result.info?.public_id ?? '');
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
            onSubmit={addCarouselImageForm.handleSubmit(onSubmit, (err) => console.log(err))}
            className="flex flex-col gap-4"
          >
            <div>
              {addCarouselImageForm.watch('imageId') ? (
                <div className="mx-auto mt-8 flex h-[120px] w-full max-w-[360px] object-fill md:h-[400px] md:max-w-[1200px]">
                  {' '}
                  <CldImage
                    width="1200"
                    height="400"
                    src={addCarouselImageForm.watch('imageId') ?? ''}
                    alt="Banner"
                    className=""
                  />
                </div>
              ) : (
                <div className="mx-auto mt-8 h-[120px] w-full max-w-[360px] bg-[#d9d9d9] md:h-[400px] md:max-w-[1200px]"></div>
              )}

              <p className="h-4 text-sm font-medium text-destructive">
                {addCarouselImageForm.formState.errors.image?.message}
              </p>
            </div>

            <UploadButton
              className="w-full rounded-lg border border-secondary p-4 hover:bg-secondary hover:text-white"
              folder="carousel-images"
              resourceType={ResourceType.IMAGE}
              onSuccess={onSuccessUpload}
            >
              Upload
            </UploadButton>

            <div className="flex gap-4">
              <AlertTriangleIcon color="#facc15" />
              Please upload with 1200 x 400 pixels only.
            </div>
            {/* <div className="flex flex-col">
              <label htmlFor="image-link">Link to</label>

              <input
                type="text"
                id="image-link"
                placeholder="(optional)"
                className="rounded-sm border border-black p-2 text-lg focus:outline-primary"
                {...carouselImageForm.register('link')}
              />
            </div> */}

            <button
              type="submit"
              className="flex items-center justify-center gap-4 rounded-md bg-primary p-4 text-white active:scale-95"
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
