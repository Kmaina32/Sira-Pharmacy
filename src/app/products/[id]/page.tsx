'use client';

import { useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { products } from '@/lib/placeholder-data';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Minus, Plus, ShieldCheck, Truck } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const product = products.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="flex items-center justify-center bg-card rounded-lg overflow-hidden shadow-md">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={500}
              height={500}
              className="object-cover transition-transform duration-300 hover:scale-105"
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

            <Button onClick={handleAddToCart} size="lg" className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground text-lg">
              Add to Cart
            </Button>
            
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
      <footer className="bg-secondary text-secondary-foreground py-6 mt-8">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p>&copy; {new Date().getFullYear()} Sira Pharmacy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
