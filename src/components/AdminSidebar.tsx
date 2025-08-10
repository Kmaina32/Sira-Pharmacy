
'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  Users,
  LogOut,
  Syringe,
  Settings,
  Mail,
  Inbox,
  History,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();
  const { settings } = useSettings();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Box },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
    { href: '/admin/messages', label: 'Messages', icon: Inbox },
    { href: '/admin/logs', label: 'Logs', icon: History },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
                <Syringe className="h-8 w-8 text-primary" />
            </Link>
            <div className="flex flex-col">
                <span className="text-lg font-bold text-primary font-headline">{settings.appName}</span>
                <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
            <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{ children: item.label, side: 'right' }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton onClick={handleLogout}>
            <LogOut />
            <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </>
  );
}
