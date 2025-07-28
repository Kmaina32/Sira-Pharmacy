import Link from 'next/link';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function ConfirmationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-lg text-center p-8 shadow-xl">
          <CardHeader>
            <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold font-headline mt-6 text-primary">Order Confirmed!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-lg mb-8">
              Thank you for your purchase. Your order has been received and is now being processed. You will receive an email confirmation shortly.
            </p>
            <Link href="/products">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
