import { CircleUserRound, Images, Printer, User, type LucideIcon } from 'lucide-react';
import { create } from 'zustand';

type SidebarLink = { Icon: LucideIcon; name: string; href: string };

type SidebarState = {
  adminSidebarLinks: SidebarLink[];
  userSidebarLinks: SidebarLink[];
  isSidebarExpanded: boolean;
  toggleIsSidebarExpanded: (value?: () => boolean) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  adminSidebarLinks: [
    { Icon: Images, name: 'Banners', href: '/admin/carousel-images' },
    { Icon: Printer, name: 'Services', href: `/admin/services` },
    { Icon: CircleUserRound, name: 'Contacts', href: `/admin/contacts` },
  ],

  userSidebarLinks: [
    { Icon: Printer, name: 'Services', href: '/#services' },
    { Icon: User, name: 'About', href: `/#about` },
    {
      Icon: CircleUserRound,
      name: 'Contact',
      href: `/#contacts`,
    },
  ],

  isSidebarExpanded: false,
  toggleIsSidebarExpanded: (value) => {
    set((state) => ({ isSidebarExpanded: value ? value() : !state.isSidebarExpanded }));
  },
}));
