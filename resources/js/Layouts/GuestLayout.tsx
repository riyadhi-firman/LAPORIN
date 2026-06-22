import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    const { app_settings } = usePage<any>().props;
    const appName = app_settings?.app_name || 'LaporIn';

    return (
        <div className="flex min-h-screen">
            {/* Left side: Branding / Hero */}
            <div className="hidden w-1/2 flex-col justify-between bg-zinc-950 p-10 text-white lg:flex relative overflow-hidden">
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2">
                        {app_settings?.app_logo ? (
                            <img src={app_settings.app_logo} alt={appName} className="h-8 w-8 object-contain" />
                        ) : (
                            <ApplicationLogo className="h-8 w-8 fill-current text-primary" />
                        )}
                        <span className="text-xl font-bold tracking-tight">{appName}</span>
                    </Link>
                </div>
                
                <div className="relative z-10 max-w-md">
                    <h1 className="text-4xl font-bold tracking-tight">Sistem Pengaduan Warga Modern.</h1>
                    <p className="mt-4 text-zinc-400">
                        Laporkan masalah lingkungan di sekitar Anda dengan mudah, cepat, dan transparan.
                    </p>
                </div>
                
                <div className="relative z-10 text-sm text-zinc-500">
                    &copy; {new Date().getFullYear()} {appName}. All rights reserved.
                </div>

                {/* Decorative background elements */}
                <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary via-zinc-950 to-zinc-950"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            {/* Right side: Auth Form */}
            <div className="flex w-full flex-col justify-center px-4 sm:px-6 lg:w-1/2 lg:px-8 bg-background">
                <div className="mx-auto w-full max-w-md">
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link href="/" className="flex items-center gap-2">
                            <ApplicationLogo className="h-10 w-10 fill-current text-primary" />
                            <span className="text-2xl font-bold tracking-tight">LaporIn</span>
                        </Link>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
