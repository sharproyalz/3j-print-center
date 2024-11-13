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
import { siteConfig } from '~/config/site';

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
          <DialogTitle>
            <span className="mb-2 flex items-center justify-center gap-4">
              <Image src={siteConfig.icon} alt={`${siteConfig.name} Icon`} width={40} height={40} />

              <span className="text-xl font-semibold">{service?.title}</span>
            </span>
          </DialogTitle>

          <DialogDescription>
            <span className="flex justify-center">
              <CldImage width="512" height="512" src={imageId} alt={`${service?.title} Image`} />
            </span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
