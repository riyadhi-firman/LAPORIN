import { Head, usePage } from '@inertiajs/react';
import { Settings, Wrench } from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';

export default function Maintenance() {
    const { app_settings } = usePage<any>().props;
    const appName = app_settings?.app_name || 'LaporIn';

    return (
        <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4 font-sans">
            <Head title={`Sedang dalam Perbaikan - ${appName}`} />

            <Card className="w-full max-w-md shadow-lg border-2">
                <CardContent className="pt-10 pb-8 px-6 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <Settings className="h-20 w-20 text-primary animate-[spin_4s_linear_infinite]" />
                            <Wrench className="h-10 w-10 text-muted-foreground absolute -bottom-2 -right-2 transform -rotate-12" />
                        </div>
                    </div>
                    
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-4">
                        Sistem Sedang Diperbarui
                    </h1>
                    
                    <p className="text-muted-foreground mb-8">
                        Mohon maaf atas ketidaknyamanan ini. {appName} saat ini sedang dalam masa pemeliharaan rutin untuk meningkatkan kualitas layanan kami. Kami akan segera kembali!
                    </p>

                    <div className="text-sm font-medium text-muted-foreground border-t pt-4">
                        &copy; {new Date().getFullYear()} {appName}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
