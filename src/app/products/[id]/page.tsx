
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Product } from '@/lib/placeholder-data';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Minus, Plus, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettings } from '@/context/SettingsContext';
import AppFooter from '@/components/AppFooter';


const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 448 512" {...props}><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.8 0-67.6-9.5-97.2-26.7l-7.1-4.2-72.2 18.9L56 353.7l-4.5-7.3c-18.9-30.1-29.6-65.4-29.6-101.9 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.8-16.2-54.3-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>
  );

export default function ProductDetailPage() {
  const { addToCart } = useCart();
  const { settings } = useSettings();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      setLoading(true);
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
      } else {
        notFound();
      }
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppHeader />
            <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    <Skeleton className="w-full h-80 md:h-[500px] rounded-lg" />
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-8 w-1/4" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </main>
        </div>
    )
  }

  if (!product) {
    return null; // notFound() is called in useEffect
  }

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleWhatsAppPurchase = () => {
    if (!settings.whatsAppNumber) return;
    const message = `Hello ${settings.appName}, I would like to purchase ${quantity}x ${product.name}.`;
    const whatsappUrl = `https://wa.me/${settings.whatsAppNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
            <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
            </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="flex items-center justify-center bg-card rounded-lg overflow-hidden shadow-md">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={500}
              height={500}
              className="object-cover transition-transform duration-300 hover:scale-105 w-full h-auto aspect-square"
              data-ai-hint={product.aiHint}
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl lg:text-4xl font-bold font-headline text-primary">{product.name}</h1>
            <p className="text-2xl font-semibold text-foreground mt-2 mb-4">{formatCurrency(product.price)}</p>
            <p className="text-muted-foreground text-base leading-relaxed">{product.description}</p>
            
            <Card className="mt-6">
              <CardHeader><CardTitle className="text-lg">Usage Instructions</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{product.usage}</p>
              </CardContent>
            </Card>

            <div className="mt-6 flex items-center gap-4">
              <p className="font-medium">Quantity:</p>
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 h-10 text-center border-x"
                  min="1"
                />
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button onClick={handleAddToCart} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base md:text-lg">
                    Add to Cart
                </Button>
                {settings.whatsAppNumber && (
                    <Button onClick={handleWhatsAppPurchase} size="lg" variant="outline" className="w-full text-base md:text-lg">
                        <WhatsAppIcon className="w-5 h-5 mr-2" />
                        Purchase via WhatsApp
                    </Button>
                )}
            </div>
            
            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                    <span>{product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'} - 100% Genuine Products</span>
                </div>
                <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <span>Fast delivery across the country</span>
                </div>
            </div>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
