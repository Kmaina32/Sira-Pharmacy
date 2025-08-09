
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Syringe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/context/SettingsContext';
import PhoneInput from 'react-phone-number-input';
import { E164Number } from 'libphonenumber-js/types';
import type { ConfirmationResult } from 'firebase/auth';
import Image from 'next/image';

export default function PhoneAuthPage() {
  const router = useRouter();
  const { setupRecaptcha, sendVerificationCode, confirmVerificationCode } = useAuth();
  const { toast } = useToast();
  const [phone, setPhone] = useState<E164Number | undefined>();
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useSettings();

  const handleSendCode = async () => {
    if (!phone) {
        toast({ title: 'Invalid Phone Number', description: 'Please enter a valid phone number.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);
    try {
        const appVerifier = setupRecaptcha('recaptcha-container');
        const result = await sendVerificationCode(phone, appVerifier);
        setConfirmationResult(result);
        setStep('otp');
        toast({ title: 'Verification Code Sent', description: 'Check your phone for the OTP.' });
    } catch (error: any) {
        console.error(error);
        toast({ title: 'Failed to Send Code', description: error.message, variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleVerifyOtp = async () => {
    if (!confirmationResult || !otp) {
        toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);
    try {
        await confirmVerificationCode(confirmationResult, otp);
        toast({ title: 'Login Successful', description: 'Welcome!' });
        router.push('/');
    } catch (error: any) {
        toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };


  return (
     <div className="relative flex items-center justify-center min-h-screen w-full">
        {settings.heroImageUrl && (
            <Image
                src={settings.heroImageUrl}
                alt="Pharmacy background"
                fill
                style={{objectFit: 'cover'}}
                className="z-0"
                priority
                sizes="100vw"
            />
        )}
        <div className="absolute inset-0 bg-black/60 z-10" />
      <Card className="w-full max-w-md mx-4 z-20">
        <CardHeader className="text-center">
           <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Syringe className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary font-headline">{settings.appName}</span>
          </Link>
          <CardTitle className="font-headline text-2xl">Sign In with Phone</CardTitle>
          <CardDescription>
            {step === 'phone' ? 'Enter your phone number to receive a verification code.' : 'Enter the code sent to your phone.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {step === 'phone' ? (
                <div className="space-y-4">
                    <Label htmlFor="phone">Phone Number</Label>
                    <PhoneInput
                        id="phone"
                        international
                        defaultCountry="KE"
                        value={phone}
                        onChange={setPhone}
                        className="input" // A custom class to style with globals.css
                    />
                    <Button onClick={handleSendCode} className="w-full" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Verification Code'}
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit code" />
                    <Button onClick={handleVerifyOtp} className="w-full" disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                    </Button>
                    <Button variant="link" onClick={() => setStep('phone')}>Use a different number</Button>
                </div>
            )}
            <div id="recaptcha-container"></div>
        </CardContent>
      </Card>
    </div>
  );
}
