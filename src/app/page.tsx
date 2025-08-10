
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, HeartPulse, Baby, BriefcaseMedical } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import { Product } from '@/lib/placeholder-data';
import { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatCurrency } from '@/lib/utils';
import { useSettings } from '@/context/SettingsContext';
import { Skeleton } from '@/components/ui/skeleton';
import AppFooter from '@/components/AppFooter';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"
import { useCart } from '@/context/CartContext';


export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings, loading: settingsLoading } = useSettings();
  const { addToCart } = useCart();
   const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const featuredProducts = products.slice(0, 8);
  const categories = [
    { name: 'Medication', icon: Pill, href: '/products?category=medication', imageUrl: 'https://firstaidforlife.org.uk/wp-content/uploads/2018/03/poisoning-pill-bottle-1080x720.jpg', aiHint: 'assorted pills' },
    { name: 'Wellness', icon: HeartPulse, href: '/products?category=wellness', imageUrl: 'https://www.newfoodmagazine.com/wp-content/uploads/health-and-wellness.jpg', aiHint: 'yoga meditation' },
    { name: 'Baby Care', icon: Baby, href: '/products?category=baby-care', imageUrl: 'https://www.lullabytrust.org.uk/wp-content/uploads/2025/01/Hero-sub-hero-feature-banner-41-aspect-ratio-1280-720-1024x680-c-default.webp', aiHint: 'happy baby' },
    { name: 'First Aid', icon: BriefcaseMedical, href: '/products?category=first-aid', imageUrl: 'https://www.shekhawatihospital.com/wp-content/uploads/2022/03/first-aid.jpg', aiHint: 'first-aid kit' },
  ];
   const brands = [
    { name: 'Brand 1', logoUrl: 'https://www.webmobilefirst.com/images/logo-coca-cola.png' },
    { name: 'Brand 2', logoUrl: 'https://www.webmobilefirst.com/images/logo-google.png' },
    { name: 'Brand 3', logoUrl: 'https://www.webmobilefirst.com/images/logo-microsoft.png' },
    { name: 'Brand 4', logoUrl: 'https://www.webmobilefirst.com/images/logo-samsung.png' },
    { name: 'Brand 5', logoUrl: 'https://www.webmobilefirst.com/images/logo-facebook.png' },
    { name: 'Brand 6', logoUrl: 'https://www.webmobilefirst.com/images/logo-amazon.png' },
    { name: 'Brand 7', logoUrl: 'https://www.webmobilefirst.com/images/logo-netflix.png' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <section className="w-full py-6 md:py-12">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="relative rounded-lg overflow-hidden h-[400px] md:h-[500px] flex items-center justify-center text-center p-4 md:p-8">
                    {settingsLoading ? (
                        <Skeleton className="absolute inset-0" />
                    ) : (
                        <>
                            <Image
                                src={settings.heroImageUrl}
                                alt="Pharmacist"
                                fill
                                style={{objectFit: 'cover'}}
                                className="z-0"
                                data-ai-hint="pharmacy background"
                                priority
                                sizes="100vw"
                            />
                            <div className="absolute inset-0 bg-black/50 z-10" />
                        </>
                    )}
                     <div className="relative z-20">
                         <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white font-headline">
                           {settingsLoading ? <Skeleton className="h-12 w-3/4 mx-auto bg-white/20" /> : settings.appName}
                         </h1>
                         <p className="mx-auto max-w-[700px] text-white/90 md:text-xl mt-4 text-base">
                           Get your prescriptions and health products delivered to your doorstep. Fast, reliable, and convenient.
                         </p>
                         <div className="mt-8">
                           <Link href="/products">
                             <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                               Shop Now
                             </Button>
                           </Link>
                         </div>
                     </div>
                 </div>
            </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6">
                 <h2 className="text-2xl font-bold tracking-tighter text-center mb-8 text-muted-foreground">Our Trusted Partners</h2>
                 <Carousel
                    plugins={[plugin.current]}
                    opts={{ align: "start", loop: true, }}
                    className="w-full"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                >
                    <CarouselContent className="-ml-2">
                        {brands.map((brand, index) => (
                            <CarouselItem key={index} className="basis-1/3 md:basis-1/4 lg:basis-1/6 pl-2 flex justify-center">
                                <Image
                                    src={brand.logoUrl}
                                    alt={brand.name}
                                    width={120}
                                    height={60}
                                    className="object-contain h-12 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 font-headline">Shop by Category</h2>
            
            <div className="sm:hidden">
              <Carousel
                plugins={[plugin.current]}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
              >
                <CarouselContent>
                  {categories.map((category) => (
                    <CarouselItem key={category.name} className="basis-full">
                      <Link href={category.href} className="group p-1">
                        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                          <div className="relative h-40">
                            <Image
                              src={category.imageUrl}
                              alt={category.name}
                              fill
                              sizes="100vw"
                              style={{objectFit: 'cover'}}
                              className="transition-transform duration-300 group-hover:scale-105"
                              data-ai-hint={category.aiHint}
                            />
                          </div>
                          <CardContent className="p-4 text-center">
                            <CardTitle className="font-headline text-lg">{category.name}</CardTitle>
                          </CardContent>
                        </Card>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
            
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {categories.map((category) => (
                <Link key={category.name} href={category.href} className="group">
                    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <div className="relative h-40 md:h-48">
                            <Image
                                src={category.imageUrl}
                                alt={category.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                style={{objectFit: 'cover'}}
                                className="transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={category.aiHint}
                            />
                        </div>
                        <CardContent className="p-4 text-center">
                            <CardTitle className="font-headline text-lg">{category.name}</CardTitle>
                        </CardContent>
                    </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 font-headline">Featured Products</h2>
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <Card key={i}><CardContent className="p-4"><Skeleton className="h-48 w-full mb-4" /><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2" /></CardContent></Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`} className="group">
                        <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl h-full">
                            <CardHeader className="p-0">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    width={300}
                                    height={300}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    data-ai-hint={product.aiHint}
                                />
                            </CardHeader>
                            <CardContent className="p-4 flex-1 flex flex-col">
                                <CardTitle className="text-base md:text-lg font-headline mb-2">{product.name}</CardTitle>
                                <p className="text-sm text-muted-foreground flex-1">{product.description.substring(0, 60)}...</p>
                                <p className="text-lg font-bold text-primary mt-2">{formatCurrency(product.price)}</p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                 <Button 
                                    className="w-full"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        addToCart(product, 1);
                                    }}
                                >
                                    Add to Cart
                                </Button>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
                </div>
            )}
            <div className="text-center mt-12">
              <Link href="/products">
                <Button variant="outline">View All Products</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
