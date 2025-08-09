
'use client';

import AppHeader from '@/components/AppHeader';
import { useSettings } from '@/context/SettingsContext';
import AppFooter from '@/components/AppFooter';

export default function PrivacyPolicyPage() {
    const { settings } = useSettings();

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppHeader />
            <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
                <div className="max-w-4xl mx-auto prose dark:prose-invert">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">Privacy Policy</h1>
                    <p className="text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    
                    <p>
                        Welcome to {settings.appName}. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                    </p>

                    <h2>1. Information We Collect</h2>
                    <p>
                        We may collect personal information from you in a variety of ways, including when you register on the site, place an order, subscribe to our newsletter, or fill out a form. The information we may collect includes:
                    </p>
                    <ul>
                        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number.</li>
                        <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the site, such as your IP address, browser type, and the pages you have viewed.</li>
                        <li><strong>Financial Data:</strong> Data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, or exchange.</li>
                    </ul>

                    <h2>2. Use of Your Information</h2>
                    <p>
                        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the site to:
                    </p>
                    <ul>
                        <li>Create and manage your account.</li>
                        <li>Email you regarding your account or order.</li>
                        <li>Fulfill and manage purchases, orders, payments, and other transactions.</li>
                        <li>Send you a newsletter.</li>
                        <li>Request feedback and contact you about your use of the site.</li>
                    </ul>

                    <h2>3. Disclosure of Your Information</h2>
                    <p>
                        We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                    </p>

                    <h2>4. Tracking Technologies</h2>
                    <h3>Cookies and Web Beacons</h3>
                    <p>
                        We may use cookies, web beacons, tracking pixels, and other tracking technologies on the site to help customize the site and improve your experience. When you access the site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the site.
                    </p>

                    <h2>5. Security of Your Information</h2>
                    <p>
                        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                    </p>

                    <h2>6. Contact Us</h2>
                    <p>
                        If you have questions or comments about this Privacy Policy, please contact us.
                    </p>
                </div>
            </main>
            <AppFooter />
        </div>
    );
}
