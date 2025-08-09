
'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
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
import Image from 'next/image';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  address: z.string().min(5, 'Address is too short'),
  city: z.string().min(2, 'City is required'),
  paymentMethod: z.enum(['mpesa', 'paypal', 'card', 'stripe'], {
    required_error: 'You need to select a payment method.',
  }),
  mpesaPhone: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      paymentMethod: 'mpesa',
    },
  });

  const paymentMethod = form.watch('paymentMethod');

  const onSubmit = async (data: CheckoutFormValues) => {
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
  
  if (cart.length === 0 && !isProcessing) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppHeader />
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader><CardTitle className="font-headline">1. Shipping Information</CardTitle></CardHeader>
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
                    <FormItem><FormLabel>City/Town</FormLabel><FormControl><Input placeholder="Nairobi" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="font-headline">2. Payment Method</CardTitle></CardHeader>
                <CardContent>
                  <Controller
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-4">
                        <div className="flex flex-col space-y-4">
                           <Label htmlFor="mpesa" className="flex items-center p-4 border rounded-md cursor-pointer has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:shadow-md">
                              <RadioGroupItem value="mpesa" id="mpesa" className="mr-4"/>
                              <Image src="https://www.clipartmax.com/png/full/229-2293241_while-m-pesa-logo.png" alt="M-Pesa" width={80} height={25} className="object-contain" />
                              <span className="ml-4 font-medium flex-1">Pay with M-Pesa</span>
                          </Label>
                          {paymentMethod === 'mpesa' && (
                             <div className="pl-12 pr-4 pb-4">
                                <FormField control={form.control} name="mpesaPhone" render={({ field }) => (
                                  <FormItem><FormLabel>M-Pesa Phone Number</FormLabel><FormControl><Input placeholder="254712345678" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <p className="text-xs text-muted-foreground mt-2">You will receive a pop-up on this number to enter your PIN.</p>
                             </div>
                          )}
                          <Label htmlFor="card" className="flex items-center p-4 border rounded-md cursor-pointer has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:shadow-md">
                              <RadioGroupItem value="card" id="card" className="mr-4"/>
                              <Image src="https://www.citypng.com/public/uploads/preview/hd-mastercard-payment-logo-transparent-background-701751694777780z7xaiuu0sh.png" alt="Card" width={40} height={25} className="object-contain" />
                              <span className="ml-4 font-medium flex-1">Credit/Debit Card</span>
                          </Label>
                           {paymentMethod === 'card' && (
                             <div className="pl-12 pr-4 pb-4 space-y-4">
                                <FormField control={form.control} name="cardNumber" render={({ field }) => (
                                  <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="**** **** **** ****" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <div className="flex gap-4">
                                   <FormField control={form.control} name="cardExpiry" render={({ field }) => (
                                    <FormItem className="flex-1"><FormLabel>Expiry (MM/YY)</FormLabel><FormControl><Input placeholder="MM/YY" {...field} /></FormControl><FormMessage /></FormItem>
                                  )}/>
                                   <FormField control={form.control} name="cardCvc" render={({ field }) => (
                                    <FormItem className="flex-1"><FormLabel>CVC</FormLabel><FormControl><Input placeholder="123" {...field} /></FormControl><FormMessage /></FormItem>
                                  )}/>
                                </div>
                             </div>
                          )}
                           <Label htmlFor="paypal" className="flex items-center p-4 border rounded-md cursor-pointer has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:shadow-md">
                              <RadioGroupItem value="paypal" id="paypal" className="mr-4"/>
                              <Image src="https://www.citypng.com/public/uploads/preview/transparent-hd-paypal-logo-701751694777788ilpzr3lary.png" alt="PayPal" width={80} height={25} className="object-contain" />
                              <span className="ml-4 font-medium flex-1">Pay with PayPal</span>
                          </Label>
                          {paymentMethod === 'paypal' && (
                            <div className="pl-12 pr-4 pb-4">
                                <p className="text-sm text-muted-foreground">You will be redirected to the PayPal website to complete your payment securely.</p>
                            </div>
                          )}
                          <Label htmlFor="stripe" className="flex items-center p-4 border rounded-md cursor-pointer has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:shadow-md">
                            <RadioGroupItem value="stripe" id="stripe" className="mr-4"/>
                            <Image src="https://www.citypng.com/public/uploads/preview/hd-stripe-official-logo-png-701751694777755j0aa3puxte.png" alt="Stripe" width={60} height={25} className="object-contain" />
                            <span className="ml-4 font-medium flex-1">Pay with Stripe</span>
                          </Label>
                           {paymentMethod === 'stripe' && (
                            <div className="pl-12 pr-4 pb-4">
                                <p className="text-sm text-muted-foreground">You will be redirected to Stripe to complete your payment securely.</p>
                            </div>
                          )}
                        </div>
                      </RadioGroup>
                    )}
                  />
                  <FormMessage />
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-1">
              <Card className="sticky top-24">
                <CardHeader><CardTitle className="font-headline">Order Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p>{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  <Separator />
                   <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p>{formatCurrency(cartTotal)}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Shipping</p>
                    <p>Free</p>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <p>Total</p>
                    <p>{formatCurrency(cartTotal)}</p>
                  </div>
                </CardContent>
                 <CardContent>
                     <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isProcessing}>
                        {isProcessing ? 'Placing Order...' : `Place Order & Pay with ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}`}
                    </Button>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
