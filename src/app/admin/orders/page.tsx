
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, Timestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';


interface Order {
    id: string;
    customerName: string;
    createdAt: Timestamp;
    total: number;
    status: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
        setLoading(false);
        return;
    }

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(ordersList);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching orders: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, authLoading]);
  
  const handleStatusChange = async (orderId: string, status: string) => {
    if (!isAdmin) return;
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'default';
      case 'shipped': return 'secondary';
      case 'processing': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'outline';
    }
  };
  
  if (loading || authLoading) {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold font-headline">Orders</h1>
            <Card>
                <CardHeader><CardTitle>Customer Orders</CardTitle></CardHeader>
                <CardContent><p>Loading orders...</p></CardContent>
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
      <h1 className="text-3xl font-bold font-headline">Orders</h1>

      <Card>
        <CardHeader>
          <CardTitle>Customer Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-xs text-muted-foreground md:hidden">{order.id.substring(0, 7)}...</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {order.createdAt?.toDate().toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Select onValueChange={(value) => handleStatusChange(order.id, value)} defaultValue={order.status}>
                                <SelectTrigger className="w-full border-0 focus:ring-0">
                                    <SelectValue placeholder="Update Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Processing">Processing</SelectItem>
                                    <SelectItem value="Shipped">Shipped</SelectItem>
                                    <SelectItem value="Delivered">Delivered</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
