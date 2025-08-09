
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

interface Subscription {
  id: string;
  email: string;
  subscribedAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function AdminNewsletterPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
        setLoading(false);
        return;
    }

    const q = query(collection(db, 'newsletter'), orderBy('subscribedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const subsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subscription));
      setSubscriptions(subsList);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching newsletter subscriptions: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, authLoading]);
  
  if (loading || authLoading) {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline">Newsletter Subscribers</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Subscribed Emails</CardTitle>
                    <CardDescription>A list of all users subscribed to your newsletter.</CardDescription>
                </CardHeader>
                <CardContent><p>Loading subscribers...</p></CardContent>
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
      <h1 className="text-3xl font-bold font-headline">Newsletter Subscribers</h1>

      <Card>
        <CardHeader>
          <CardTitle>Subscribed Emails</CardTitle>
          <CardDescription>A list of all users subscribed to your newsletter.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email Address</TableHead>
                <TableHead className="text-right">Subscription Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div className="font-medium">{sub.email}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    {sub.subscribedAt ? format(new Date(sub.subscribedAt.seconds * 1000), 'PPP') : 'N/A'}
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
