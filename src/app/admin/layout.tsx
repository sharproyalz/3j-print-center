import { redirect } from 'next/navigation';
import { SideBar } from '~/app/admin/_components/side-bar';
import { getServerAuthSession } from '~/server/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect('/?error=AccessDenied');
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4.5rem)]">
      <SideBar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
