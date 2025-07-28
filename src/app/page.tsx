import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, HeartPulse, Baby, Search } from 'lucide-react';
import { products } from '@/lib/placeholder-data';
import AppHeader from '@/components/AppHeader';

export default function HomePage() {
  const featuredProducts = products.slice(0, 4);
  const categories = [
    { name: 'Medication', icon: Pill, href: '/products?category=medication' },
    { name: 'Wellness', icon: HeartPulse, href: '/products?category=wellness' },
    { name: 'Baby Care', icon: Baby, href: '/products?category=baby-care' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40 bg-primary/10">
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="Pharmacist"
            layout="fill"
            objectFit="cover"
            className="opacity-20"
            data-ai-hint="pharmacy background"
          />
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-primary font-headline">
              Your Health, Our Priority
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl mt-4">
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
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 font-headline">Shop by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link key={category.name} href={category.href} className="group">
                  <Card className="h-full flex flex-col items-center justify-center p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-primary/5">
                    <category.icon className="w-16 h-16 text-primary mb-4 transition-transform duration-300 group-hover:scale-110" />
                    <CardTitle className="font-headline">{category.name}</CardTitle>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 font-headline">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-xl">
                  <CardHeader className="p-0">
                    <Link href={`/products/${product.id}`}>
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover"
                        data-ai-hint={product.aiHint}
                      />
                    </Link>
                  </CardHeader>
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <CardTitle className="text-lg font-headline mb-2">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground flex-1">{product.description.substring(0, 60)}...</p>
                    <p className="text-lg font-bold text-primary mt-2">Ksh {product.price.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Link href={`/products/${product.id}`} className="w-full">
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/products">
                <Button variant="outline">View All Products</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-secondary text-secondary-foreground py-6">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p>&copy; {new Date().getFullYear()} Sira Pharmacy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}