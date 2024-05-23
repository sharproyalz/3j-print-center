'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CarouselImage } from '@prisma/client';
import { Save, Trash2 } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { useParams, useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { BreadcrumbComponent } from '~/app/admin/carousel-images/[id]/_components/breadcrumb';
import { OnSuccessUpload, ResourceType, UploadButton } from '~/components/upload-button';
import { api } from '~/trpc/react';
import { schemas } from '~/zod-schemas';

type Inputs = z.infer<typeof schemas.carouselImage.update>;
type Props = {
  initialData: CarouselImage | null;
};

export function CarouselImageView({ initialData }: Props) {
  const router = useRouter();
  const params = useParams();

  const getCarouselImageView = api.carouselImage.get.useQuery(
    { id: params.id as string },
    { initialData }
  );
  const carouselImage = getCarouselImageView.data;

  const updateCarouselImageForm = useForm<Inputs>({
    resolver: zodResolver(schemas.carouselImage.update),
    values: {
      id: carouselImage?.id as string,
      image: carouselImage?.image,
      imageId: carouselImage?.imageId,
      link: carouselImage?.link,
    },
  });

  const updateCarouselImage = api.carouselImage.update.useMutation({
    onSuccess: async ({ id }) => {
      toast.success('Banner has been updated.');
      console.log('Banner has been updated.');
      await router.push(`/admin/carousel-images`);
    },
  });

  const deleteCarouselImage = api.carouselImage.delete.useMutation({
    // This is the callback function after successful backend execution
    onSuccess: async () => {
      toast.success('Contact has been deleted');
      router.push(`/admin/carousel-images`);
      console.log('Contact has been deleted');
    },
    // This is the callback function after failed backend execution. This is mostly used for 'unique' data conflict errors like unique email, etc.
    onError: () => {
      toast.error('Internal Server Error');
      console.log('Internal Server Error');
    },
  });

  const onSuccessUpload: OnSuccessUpload = (result) => {
    updateCarouselImageForm.setValue('image', result.info?.secure_url ?? '');
    updateCarouselImageForm.setValue('imageId', result.info?.public_id ?? '');
  };

  const onSubmitUpdateCarouselImage: SubmitHandler<Inputs> = (values) => {
    updateCarouselImage.mutate(values);
    console.log(values);
  };

  return (
    <>
      <main className="p-8">
        <div className="flex flex-col justify-between ">
          <BreadcrumbComponent />

          <div className="mt-4 text-4xl font-bold">Update Banner</div>
        </div>

        {/* Forms */}
        <div className="flex flex-col pb-12">
          <form
            onSubmit={updateCarouselImageForm.handleSubmit(onSubmitUpdateCarouselImage, (err) =>
              console.log(err)
            )}
            className="flex flex-col gap-4"
          >
            {updateCarouselImageForm.watch('imageId') ? (
              <div className="object-fit mx-auto mt-8 flex h-[32rem] w-[32rem]">
                <CldImage
                  width="512"
                  height="512"
                  src={updateCarouselImageForm.watch('imageId') ?? ''}
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
                {...updateCarouselImageForm.register('link')}
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => deleteCarouselImage.mutate({ id: params.id as string })}
                className="flex items-center justify-center gap-4 rounded-md bg-destructive p-4 text-white"
              >
                <div>Delete</div>
                <Trash2 />
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-4 rounded-md bg-primary p-4 text-white"
              >
                <div>Save</div>
                <Save />
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
