'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  address: z.string().min(5, 'Address is too short'),
  city: z.string().min(2, 'City is required'),
  paymentMethod: z.enum(['mpesa', 'paypal', 'card'], {
    required_error: 'You need to select a payment method.',
  }),
});

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || '',
      paymentMethod: 'mpesa',
    },
  });

  const onSubmit = async (data: z.infer<typeof checkoutSchema>) => {
    setIsProcessing(true);
    if (!user) {
        toast({ title: "Authentication Error", description: "You must be logged in to place an order.", variant: "destructive" });
        setIsProcessing(false);
        return;
    }
    try {
        await addDoc(collection(db, 'orders'), {
            userId: user.uid,
            customerName: data.name,
            customerEmail: data.email,
            customerPhone: data.phone,
            shippingAddress: {
                address: data.address,
                city: data.city,
            },
            items: cart,
            total: cartTotal,
            status: 'Processing',
            paymentMethod: data.paymentMethod,
            createdAt: serverTimestamp(),
        });

      clearCart();
      toast({ title: 'Order Placed!', description: 'Your order has been successfully submitted.' });
      router.push('/confirmation');
    } catch (error) {
        console.error("Error placing order:", error);
        toast({ title: 'Order Failed', description: 'There was a problem placing your order.', variant: 'destructive' });
    } finally {
        setIsProcessing(false);
    }
  };
  
  if (cart.length === 0) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppHeader />
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-semibold">Your cart is empty.</h1>
                <p className="text-muted-foreground mt-2">Add some products to your cart before you can checkout.</p>
                <Button onClick={() => router.push('/products')} className="mt-4">
                    Go to Products
                </Button>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-8 text-center">Checkout</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle className="font-headline">Shipping Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="0712345678" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Address</FormLabel><FormControl><Input placeholder="123 Moi Avenue" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Nairobi" /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="font-headline">Payment Method</CardTitle></CardHeader>
                <CardContent>
                  <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-4">
                            <div className="flex items-center space-x-3 p-4 border rounded-md has-[[data-state=checked]]:border-primary">
                                <RadioGroupItem value="mpesa" id="mpesa" />
                                <Label htmlFor="mpesa" className="font-medium text-lg flex-1 cursor-pointer">M-Pesa</Label>
                            </div>
                            <div className="flex items-center space-x-3 p-4 border rounded-md has-[[data-state=checked]]:border-primary">
                                <RadioGroupItem value="paypal" id="paypal" />
                                <Label htmlFor="paypal" className="font-medium text-lg flex-1 cursor-pointer">PayPal</Label>
                            </div>
                            <div className="flex items-center space-x-3 p-4 border rounded-md has-[[data-state=checked]]:border-primary">
                                <RadioGroupItem value="card" id="card" />
                                <Label htmlFor="card" className="font-medium text-lg flex-1 cursor-pointer">Credit/Debit Card</Label>
                            </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-1">
              <Card className="sticky top-24">
                <CardHeader><CardTitle className="font-headline">Order Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <p>{item.name} <span className="text-muted-foreground">x{item.quantity}</span></p>
                      <p>{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <p>Total</p>
                    <p>{formatCurrency(cartTotal)}</p>
                  </div>
                </CardContent>
              </Card>
              <Button type="submit" size="lg" className="w-full mt-8 bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isProcessing}>
                {isProcessing ? 'Placing Order...' : 'Place Order'}
                </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
