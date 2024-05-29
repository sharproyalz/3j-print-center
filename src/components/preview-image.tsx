import { Service } from '@prisma/client';
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

type Props = {
  children: React.ReactNode;
  service: Service | null;
  imageId: string;
};
export function PreviewImage({ children, imageId, service }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="">
            <div className="mb-2 flex items-center justify-center gap-4">
              <Image src="/3J-icon.png" alt="" width={40} height={40} />
              <div className="text-xl font-semibold">{service?.title}</div>
            </div>
          </DialogTitle>
          <DialogDescription>
            <div className="flex justify-center">
              <CldImage width="512" height="512" src={imageId} alt="Receipt" />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
