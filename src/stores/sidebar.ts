import {
  CircleUserRound,
  FileText,
  Images,
  LayoutDashboard,
  CircleDollarSign,
  Printer,
  User,
  type LucideIcon,
} from 'lucide-react';
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
    { Icon: LayoutDashboard, name: 'Dashboard', href: '/admin' },
    { Icon: Images, name: 'Banners', href: '/admin/carousel-images' },
    { Icon: Printer, name: 'Services', href: `/admin/services` },
    { Icon: CircleUserRound, name: 'Contacts', href: `/admin/contacts` },
    { Icon: FileText, name: 'Quotes', href: `/admin/quotes` },
    { Icon: CircleDollarSign, name: 'Pricing', href: '/admin/pricing' },
  ],

  userSidebarLinks: [
    { Icon: Printer, name: 'Services', href: '/#services' },
    { Icon: FileText, name: 'Price guide', href: '/service-guide' },
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
