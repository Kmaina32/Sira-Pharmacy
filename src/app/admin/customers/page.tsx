'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

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
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!isAdmin) {
        setLoading(false);
        return;
      }
      setLoading(true);
      
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      
      const customersList = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          displayName: data.displayName,
          email: data.email,
          photoURL: data.photoURL,
          isAdmin: data.email === adminEmail,
        };
      });

      setCustomers(customersList);
      setLoading(false);
    };

    fetchCustomers();
  }, [isAdmin]);
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold font-headline">Customers</h1>
        <Card>
          <CardHeader><CardTitle>Registered Customers</CardTitle></CardHeader>
          <CardContent><p>Loading customers...</p></CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline">Access Denied</h1>
            <Card>
                <CardHeader><CardTitle>Permission Required</CardTitle></CardHeader>
                <CardContent><p>You do not have permission to view this page.</p></CardContent>
            </Card>
        </div>
    );
  }


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Customers</h1>

      <Card>
        <CardHeader>
          <CardTitle>Registered Customers</CardTitle>
        </CardHeader>
        <CardContent>
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
                    {customer.isAdmin ? <Badge>Admin</Badge> : <Badge variant="outline">Customer</Badge>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
