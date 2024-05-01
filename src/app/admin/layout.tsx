import { SideBar } from '~/app/admin/_components/side-bar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[calc(100vh-4.5rem)]">
      <SideBar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
