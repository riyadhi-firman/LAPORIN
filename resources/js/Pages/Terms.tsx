import { Head, Link, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function Terms() {
    const { app_settings } = usePage<any>().props;
    const termsText = app_settings?.terms_text || 'Belum ada syarat dan ketentuan yang diatur.';

    return (
        <GuestLayout>
            <Head title={`Syarat & Ketentuan - ${app_settings?.app_name || 'LaporIn'}`} />

            <div className="w-full sm:max-w-4xl mt-6 px-6 py-4 bg-card shadow-sm border overflow-hidden sm:rounded-lg">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Syarat & Ketentuan</h1>
                </div>

                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-muted-foreground">
                    {termsText}
                </div>
            </div>
        </GuestLayout>
    );
}
