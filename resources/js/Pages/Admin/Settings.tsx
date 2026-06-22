import { FormEventHandler, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Settings({ auth, appSettings }: PageProps<{ appSettings: any }>) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        app_name: appSettings.app_name,
        app_logo: null as File | null,
        hero_title: appSettings.hero_title,
        hero_description: appSettings.hero_description,
        contact_email: appSettings.contact_email,
        contact_phone: appSettings.contact_phone,
        social_instagram: appSettings.social_instagram,
        social_facebook: appSettings.social_facebook,
        terms_text: appSettings.terms_text,
        maintenance_mode: appSettings.maintenance_mode,
    });

    const [previewLogo, setPreviewLogo] = useState<string | null>(appSettings.app_logo);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('app_logo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AuthenticatedLayout header="Pengaturan Lanjutan">
            <Head title="Pengaturan Lanjutan" />

            <div className="max-w-4xl space-y-6">
                {recentlySuccessful && (
                    <div className="flex items-center gap-2 p-4 text-sm text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded-md border border-green-200 dark:border-green-800">
                        <CheckCircle2 className="h-4 w-4" />
                        <p>Pengaturan berhasil disimpan.</p>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                    
                    {/* Identitas Aplikasi */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Identitas Aplikasi</CardTitle>
                            <CardDescription>Ubah nama dan logo yang akan ditampilkan pada sistem.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="app_name">Nama Aplikasi</Label>
                                <Input id="app_name" value={data.app_name} onChange={(e) => setData('app_name', e.target.value)} />
                                {errors.app_name && <p className="text-sm text-destructive">{errors.app_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="app_logo">Logo Aplikasi</Label>
                                <div className="flex items-center gap-4">
                                    <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-muted/50 overflow-hidden shrink-0">
                                        {previewLogo ? (
                                            <img src={previewLogo} alt="Logo Preview" className="h-full w-full object-contain p-2" />
                                        ) : (
                                            <span className="text-xs text-muted-foreground text-center">Tanpa Logo</span>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2 max-w-md">
                                        <Input id="app_logo" type="file" accept="image/*" onChange={handleLogoChange} className="cursor-pointer file:cursor-pointer" />
                                        <p className="text-xs text-muted-foreground">PNG/JPG maks 2MB.</p>
                                    </div>
                                </div>
                                {errors.app_logo && <p className="text-sm text-destructive">{errors.app_logo}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Teks Landing Page */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Landing Page</CardTitle>
                            <CardDescription>Teks yang tampil di halaman depan sebelum login.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="hero_title">Judul Utama (Hero)</Label>
                                <Input id="hero_title" value={data.hero_title} onChange={(e) => setData('hero_title', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hero_description">Deskripsi Singkat</Label>
                                <Textarea id="hero_description" rows={3} value={data.hero_description} onChange={(e) => setData('hero_description', e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kontak & Sosial Media */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kontak & Sosial Media</CardTitle>
                            <CardDescription>Informasi yang ditampilkan di bagian footer.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="contact_email">Email Bantuan</Label>
                                    <Input id="contact_email" type="email" value={data.contact_email} onChange={(e) => setData('contact_email', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact_phone">Nomor Telepon/WA</Label>
                                    <Input id="contact_phone" value={data.contact_phone} onChange={(e) => setData('contact_phone', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="social_instagram">Link Instagram</Label>
                                    <Input id="social_instagram" placeholder="https://instagram.com/..." value={data.social_instagram} onChange={(e) => setData('social_instagram', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="social_facebook">Link Facebook</Label>
                                    <Input id="social_facebook" placeholder="https://facebook.com/..." value={data.social_facebook} onChange={(e) => setData('social_facebook', e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Syarat & Ketentuan */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Syarat & Ketentuan</CardTitle>
                            <CardDescription>Teks aturan penggunaan (T&C) aplikasi.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea id="terms_text" rows={6} value={data.terms_text} onChange={(e) => setData('terms_text', e.target.value)} />
                        </CardContent>
                    </Card>

                    {/* Mode Pemeliharaan */}
                    <Card className={data.maintenance_mode ? 'border-destructive bg-destructive/5' : ''}>
                        <CardHeader>
                            <CardTitle className="text-destructive">Mode Pemeliharaan (Maintenance)</CardTitle>
                            <CardDescription>Cegah pengguna biasa mengakses aplikasi saat Anda melakukan perbaikan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="h-5 w-5 rounded border-gray-300 text-destructive focus:ring-destructive"
                                    checked={data.maintenance_mode} 
                                    onChange={(e) => setData('maintenance_mode', e.target.checked)} 
                                />
                                <span className="font-medium">Aktifkan Mode Pemeliharaan</span>
                            </label>
                            {data.maintenance_mode && (
                                <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" /> Warga tidak akan bisa login atau mengakses website.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end pb-10">
                        <Button disabled={processing} type="submit" size="lg">Simpan Semua Pengaturan</Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
