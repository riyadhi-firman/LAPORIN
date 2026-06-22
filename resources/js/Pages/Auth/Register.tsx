import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />
            
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="space-y-1 px-0">
                    <CardTitle className="text-2xl font-bold tracking-tight">Buat akun baru</CardTitle>
                    <CardDescription>Daftar untuk mulai melaporkan masalah di sekitar Anda.</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Budi Santoso"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@email.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            {errors.password_confirmation && <p className="text-sm text-destructive">{errors.password_confirmation}</p>}
                        </div>

                        <Button className="w-full mt-6" type="submit" disabled={processing}>
                            {processing ? 'Mendaftar...' : 'Daftar'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="px-0 flex flex-col items-center">
                    <div className="text-center text-sm text-muted-foreground mt-4">
                        Sudah punya akun?{' '}
                        <Link href={route('login')} className="font-medium text-primary hover:underline">
                            Login di sini
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </GuestLayout>
    );
}
