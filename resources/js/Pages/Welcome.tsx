import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { ShieldCheck, MapPin, MessageSquare, ArrowRight, BarChart3, CheckCircle2, Clock, Mail, Phone, Globe } from 'lucide-react';
import { ThemeToggle } from '@/Components/ThemeToggle';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth, stats }: PageProps<{ stats: { total_reports: number, total_resolved: number, total_processing: number } }>) {
    const app_settings = usePage<any>().props.app_settings || { app_name: 'LaporIn', app_logo: null };

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Head title={`Selamat Datang - ${app_settings.app_name}`} />

            {/* Navigation Bar */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-2">
                            {app_settings.app_logo ? (
                                <img src={app_settings.app_logo} alt="Logo" className="h-8 w-8 object-contain" />
                            ) : (
                                <ShieldCheck className="h-8 w-8 text-primary" />
                            )}
                            <span className="text-xl font-bold tracking-tight">{app_settings.app_name}</span>
                        </div>
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Button asChild variant="default">
                                    <Link href={route('dashboard')}>
                                        Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="ghost" className="hidden sm:inline-flex">
                                        <Link href={route('login')}>Masuk</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={route('register')}>Daftar Sekarang</Link>
                                    </Button>
                                </>
                            )}
                            <ThemeToggle />
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-20 lg:py-32 border-b">
                    <div className="absolute inset-0 bg-primary/5 -z-10" />
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm rounded-full bg-background/50 backdrop-blur-sm border-primary/20 text-primary">
                            Platform Pelaporan Masyarakat
                        </Badge>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
                            {app_settings.hero_title}
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto whitespace-pre-wrap">
                            {app_settings.hero_description}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" className="w-full sm:w-auto text-base h-12 px-8">
                                <Link href={route('register')}>
                                    Mulai Melapor <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8">
                                <a href="#statistik">Lihat Statistik</a>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight mb-4">Bagaimana Cara Kerjanya?</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                                Proses pelaporan dirancang sesederhana mungkin agar setiap warga dapat berkontribusi dengan mudah.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <Card className="border-none shadow-md bg-muted/30">
                                <CardContent className="pt-8 text-center px-6">
                                    <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                        <MapPin className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">Tandai Lokasi</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Pilih lokasi spesifik di peta untuk memudahkan petugas menemukan masalah yang Anda laporkan.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md bg-muted/30">
                                <CardContent className="pt-8 text-center px-6">
                                    <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                        <ShieldCheck className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">Sertakan Bukti</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Unggah foto dan deskripsi lengkap tentang kejadian agar laporan dapat segera divalidasi.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md bg-muted/30">
                                <CardContent className="pt-8 text-center px-6">
                                    <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                        <MessageSquare className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">Pantau Prosesnya</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Lacak status laporan Anda dan berkomunikasi langsung dengan admin yang menangani masalah tersebut.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Statistics Section */}
                <section id="statistik" className="py-20 border-t bg-muted/10">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight mb-4">Statistik Laporan</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                                Transparansi adalah prioritas kami. Berikut adalah data penanganan laporan hingga saat ini.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <Card className="overflow-hidden border-primary/10 shadow-sm transition-all hover:shadow-md">
                                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                    <BarChart3 className="h-10 w-10 text-muted-foreground mb-4" />
                                    <div className="text-4xl font-extrabold mb-2 text-foreground">{stats.total_reports}</div>
                                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Laporan Masuk</div>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden border-blue-500/20 shadow-sm transition-all hover:shadow-md bg-blue-500/5">
                                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                    <Clock className="h-10 w-10 text-blue-500 mb-4" />
                                    <div className="text-4xl font-extrabold mb-2 text-blue-600 dark:text-blue-400">{stats.total_processing}</div>
                                    <div className="text-sm font-medium text-blue-600/70 dark:text-blue-400/70 uppercase tracking-wider">Sedang Diproses</div>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden border-green-500/20 shadow-sm transition-all hover:shadow-md bg-green-500/5">
                                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                    <CheckCircle2 className="h-10 w-10 text-green-500 mb-4" />
                                    <div className="text-4xl font-extrabold mb-2 text-green-600 dark:text-green-400">{stats.total_resolved}</div>
                                    <div className="text-sm font-medium text-green-600/70 dark:text-green-400/70 uppercase tracking-wider">Laporan Selesai</div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-muted py-12 border-t">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        {app_settings.app_logo ? (
                            <img src={app_settings.app_logo} alt="Logo" className="h-6 w-6 object-contain opacity-50 grayscale" />
                        ) : (
                            <ApplicationLogo className="h-6 w-6 fill-current text-muted-foreground" />
                        )}
                        <span className="text-xl font-bold text-muted-foreground">{app_settings.app_name}</span>
                    </div>

                    <div className="flex justify-center gap-6 mb-6 text-muted-foreground">
                        {app_settings.contact_email && (
                            <a href={`mailto:${app_settings.contact_email}`} className="hover:text-primary transition-colors flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4" /> Email
                            </a>
                        )}
                        {app_settings.contact_phone && (
                            <span className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4" /> {app_settings.contact_phone}
                            </span>
                        )}
                        {app_settings.social_instagram && (
                            <a href={app_settings.social_instagram} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-2 text-sm">
                                <Globe className="h-4 w-4" /> Instagram
                            </a>
                        )}
                        {app_settings.social_facebook && (
                            <a href={app_settings.social_facebook} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-2 text-sm">
                                <Globe className="h-4 w-4" /> Facebook
                            </a>
                        )}
                    </div>

                    <div className="flex justify-center gap-4 text-sm text-muted-foreground mb-4">
                        <Link href={route('terms')} className="hover:text-primary underline underline-offset-4">Syarat & Ketentuan</Link>
                    </div>

                    <p className="text-muted-foreground text-sm">
                        &copy; {new Date().getFullYear()} {app_settings.app_name}. Solusi Pelaporan Warga.
                    </p>
                </div>
            </footer>
        </div>
    );
}

function Badge({ children, variant, className }: any) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
            {children}
        </span>
    );
}
