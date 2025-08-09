
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

const MpesaLogo = () => (
    <svg width="40" height="28" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0H40V28H0V0Z" fill="#71B944"/>
        <path d="M12.9649 19.3242L12.3396 17.5135H8.77353L8.14823 19.3242H5.0293L10.5522 6.002H15.6599L21.2144 19.3242H12.9649ZM11.6214 15.3912L10.5522 12.1895L9.48303 15.3912H11.6214ZM22.4277 19.3242V6.002H32.4093V8.12181H25.541V11.2285H31.5034V13.3483H25.541V17.2024H32.4093V19.3222L22.4277 19.3242Z" fill="white"/>
    </svg>
);

const PayPalLogo = () => (
    <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.31958 2.30273C12.9351 2.30273 15.698 5.76011 14.8569 10.4309C14.7358 11.2443 14.5919 12.0163 14.434 12.7533C14.2215 13.8437 14.122 14.4309 14.122 14.4309C14.122 14.4309 14.103 14.509 14.0768 14.6136C13.8839 15.4222 13.5673 16.3217 13.1119 17.1897C11.8385 19.5539 9.61009 20.3061 7.29177 20.3061H1.58398L1.00684 23.714H0.844356L0 27.9999H4.49833L5.05141 24.3855H8.16912L8.72304 20.977H2.86475C3.89673 12.3533 11.1694 12.1465 11.1694 8.78313C11.1694 7.03158 10.0381 5.9226 8.35123 5.9226C6.2753 5.9226 4.90138 7.06857 4.41707 7.69715L1.87114 3.7371C2.98634 2.89868 5.38596 2.30273 8.31958 2.30273Z" fill="#253B80"/>
        <path d="M19.3276 8.52734C19.043 8.52734 17.5215 8.91742 16.4895 9.53723C15.6882 10.0215 15.1193 10.569 14.8252 10.9067C14.8077 10.9294 14.7936 10.9496 14.7811 10.9678L14.7358 11.2443L14.434 12.7533C14.2215 13.8437 14.122 14.4309 14.122 14.4309C14.122 14.4309 14.103 14.509 14.0768 14.6136C13.8839 15.4222 13.5673 16.3217 13.1119 17.1897C11.8385 19.5539 9.61009 20.3061 7.29177 20.3061H1.58398L1.00684 23.714H8.72304L9.08862 21.613H9.4297C10.7022 22.868 12.5694 23.4735 14.5164 23.4735C19.7828 23.4735 23.0125 19.2907 24 13.4345C24.0158 13.3364 24.0307 13.238 24.0448 13.1392C24.5123 10.155 22.4244 8.52734 19.3276 8.52734ZM16.2996 15.8277C16.8902 12.5835 19.0065 11.3994 20.3956 11.3994C21.1969 11.3994 21.4628 11.758 21.321 12.603C20.899 15.2257 18.9161 16.7491 16.2996 15.8277Z" fill="#179BD7"/>
    </svg>
);

const StripeLogo = () => (
    <svg width="49" height="28" viewBox="0 0 49 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M48.0699 10.1601C48.0699 9.38008 47.9699 8.81008 47.8199 8.24008C47.6699 7.67008 47.4599 7.15008 47.1699 6.66008C46.8899 6.17008 46.5499 5.75008 46.1299 5.37008C45.7099 4.99008 45.2199 4.69008 44.6299 4.45008C44.0499 4.21008 43.3799 4.05008 42.5999 3.96008C42.4299 3.92008 42.2499 3.89008 42.0699 3.87008H29.5699V0.51008H44.6299C45.7499 0.51008 46.6699 0.76008 47.3899 1.25008C48.1199 1.74008 48.6399 2.41008 48.9699 3.26008C49.2899 4.11008 49.4499 5.07008 49.4499 6.13008C49.4499 7.02008 49.3099 7.84008 49.0399 8.59008C48.7599 9.34008 48.3599 9.99008 47.8199 10.5501C47.2899 11.1101 46.6399 11.5501 45.8699 11.8701C47.1199 12.1101 48.0599 12.6601 48.6999 13.5201C49.3299 14.3801 49.6499 15.4601 49.6499 16.7601C49.6499 18.0601 49.3499 19.1901 48.7499 20.1501C48.1499 21.1101 47.2999 21.8401 46.1999 22.3401C45.0999 22.8401 43.8099 23.0901 42.3299 23.0901H29.5699V19.7801H42.6899C43.5199 19.7801 44.1799 19.6001 44.6599 19.2401C45.1399 18.8801 45.4999 18.3701 45.7399 17.7101C45.9799 17.0501 46.0999 16.3101 46.0999 15.4901C46.0999 14.5001 45.8899 13.7101 45.4699 13.1201C45.0499 12.5301 44.4699 12.1101 43.7299 11.8601L42.5999 11.4501C41.8799 11.1901 41.2899 10.9601 40.8299 10.7601C40.3599 10.5601 39.9899 10.3601 39.7199 10.1601H48.0699ZM18.4299 23.0901H12.9399L16.2799 11.2301H6.70993L6.48993 12.9201H10.9399L7.59993 23.0901H2.10993L5.44993 11.2301H0.27993V8.00008H11.7199L15.0599 19.8701H21.6299L21.8499 18.1801H17.3999L20.7399 8.00008H25.9099L22.5699 19.8701H29.1399L29.5699 16.4801H15.0599L18.4299 23.0901Z" fill="#635BFF"/>
    </svg>
);

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-12">
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
                              <MpesaLogo />
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
                              <div className="w-10 h-7 flex items-center justify-center rounded bg-gray-200"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg></div>
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
                               <div className="w-10 h-7 flex items-center justify-center">
                                <PayPalLogo />
                               </div>
                              <span className="ml-4 font-medium flex-1">Pay with PayPal</span>
                          </Label>
                          {paymentMethod === 'paypal' && (
                            <div className="pl-12 pr-4 pb-4">
                                <p className="text-sm text-muted-foreground">You will be redirected to the PayPal website to complete your payment securely.</p>
                            </div>
                          )}
                          <Label htmlFor="stripe" className="flex items-center p-4 border rounded-md cursor-pointer has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:shadow-md">
                            <RadioGroupItem value="stripe" id="stripe" className="mr-4"/>
                            <div className="w-10 h-7 flex items-center justify-center">
                                <StripeLogo/>
                            </div>
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
