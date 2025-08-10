
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Syringe, ShoppingCart, User, LogOut, LayoutDashboard, Settings, Bell, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import React, { useEffect, useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
    id: string;
    subject: string;
    content: string;
    createdAt: {
        seconds: number;
    };
    isRead: boolean;
}

const AppHeader = () => {
  const { cart } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const { settings } = useSettings();
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (user?.uid) {
        const q = query(collection(db, 'notifications'), where('userId', '==', user.uid), where('isRead', '==', false));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const notifs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
            setNotifications(notifs);
        });
        return () => unsubscribe();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };
  
  const handleMarkAsRead = async (notificationId: string) => {
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, { isRead: true });
  }

  const cartItemCount = isMounted ? cart.reduce((count, item) => count + item.quantity, 0) : 0;
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Syringe className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary font-headline">{settings.appName}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map(link => (
            <Link key={link.label} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
            {user && (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-6 w-6" />
                            {notifications.length > 0 && (
                                <Badge variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center p-0">
                                    {notifications.length}
                                </Badge>
                            )}
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {notifications.length > 0 ? (
                            notifications.map(notif => (
                                <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-2 p-2" onSelect={(e) => e.preventDefault()}>
                                    <div className="w-full">
                                        <p className="font-semibold">{notif.subject}</p>
                                        <p className="text-xs text-muted-foreground truncate">{notif.content}</p>
                                        <div className="flex justify-between items-center w-full mt-2">
                                            <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(notif.createdAt.seconds * 1000), { addSuffix: true })}</p>
                                            <Button size="sm" variant="ghost" onClick={() => handleMarkAsRead(notif.id)}>
                                                <Check className="mr-2 h-4 w-4"/>
                                                Mark as read
                                            </Button>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <p className="p-4 text-center text-sm text-muted-foreground">No new notifications.</p>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center p-0">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Button>
          </Link>
          
          {user ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Account</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <Syringe className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold text-primary font-headline">{settings.appName}</span>
                </Link>
                {navLinks.map(link => (
                  <Link key={link.label} href={link.href} className="text-lg font-medium transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                ))}
                <div className="border-t pt-6 mt-auto">
                    {user ? (
                         <Button onClick={handleLogout} className="w-full">Logout</Button>
                    ) : (
                        <>
                        <Link href="/login">
                            <Button className="w-full mb-2">Login</Button>
                        </Link>
                        <Link href="/signup">
                            <Button variant="outline" className="w-full">Sign Up</Button>
                        </Link>
                        </>
                    )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
