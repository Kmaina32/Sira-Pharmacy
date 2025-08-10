
'use client';

import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import ProductsList from '@/components/ProductsList';


export default function ProductsPage() {

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold font-headline text-primary">Our Products</h1>
            <p className="text-muted-foreground mt-2">Find all your health and wellness needs here.</p>
        </div>
        <Suspense fallback={
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <Card key={i}><CardContent className="p-4"><Skeleton className="h-48 w-full mb-4" /><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2" /></CardContent></Card>
                ))}
            </div>
        }>
            <ProductsList />
        </Suspense>
      </main>
      <AppFooter />
    </div>
  );
}

// Dummy components to avoid undefined errors in Suspense fallback
const Card = ({ children }: { children: React.ReactNode }) => <div className="border rounded-lg bg-card">{children}</div>;
const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>;
