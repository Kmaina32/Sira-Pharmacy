'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  isAdmin?: boolean;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      // In a real app, you'd have a secure way to get users, likely via a Cloud Function
      // For this prototype, we will fetch users who have placed orders.
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const usersMap = new Map<string, User>();

      ordersSnapshot.docs.forEach(doc => {
          const order = doc.data();
          if (!usersMap.has(order.userId)) {
              usersMap.set(order.userId, {
                  id: order.userId,
                  displayName: order.customerName,
                  email: order.customerEmail,
              });
          }
      });
      
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      const customersList = Array.from(usersMap.values()).map(c => ({...c, isAdmin: c.email === adminEmail}));

      setCustomers(customersList);
      setLoading(false);
    };

    fetchCustomers();
  }, []);
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Customers</h1>

      <Card>
        <CardHeader>
          <CardTitle>Registered Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p>Loading customers...</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={customer.photoURL} alt="Avatar" />
                          <AvatarFallback>{getInitials(customer.displayName)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{customer.displayName || 'N/A'}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{customer.email}</TableCell>
                    <TableCell>
                      {customer.isAdmin && <Badge>Admin</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
