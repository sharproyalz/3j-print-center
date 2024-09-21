import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { buttonVariants } from '~/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { cn } from '~/lib/utils';

type SocialLink = {
  link: string;
  className?: string;
  Icon: LucideIcon | JSX.ElementType;
};

type Props = {
  name: string;
  image: string;
  initials: string;
  title: string;
  socialLinks?: SocialLink[];
};

export function DeveloperCard({ name, image, initials, title, socialLinks }: Props) {
  return (
    <Card className="flex items-center gap-4 p-4">
      <Avatar className="h-24 w-24 border-2">
        <AvatarImage src={image} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{title}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-wrap items-center gap-2">
          {socialLinks?.map(({ Icon, link, className }, linkIdx) => (
            <Link
              key={linkIdx}
              href={link}
              className={cn(
                buttonVariants({ size: 'icon' }),
                'rounded-full',
                className ? className : 'bg-black text-white hover:bg-black/80 active:scale-95'
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon />
            </Link>
          ))}
        </CardFooter>
      </div>
    </Card>
  );
}
