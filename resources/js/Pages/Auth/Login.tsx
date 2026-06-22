import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="space-y-1 px-0">
                    <CardTitle className="text-2xl font-bold tracking-tight">Login ke akun Anda</CardTitle>
                    <CardDescription>Masukkan email dan password untuk melanjutkan.</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    {status && <div className="mb-4 text-sm font-medium text-green-500">{status}</div>}

                    <form onSubmit={submit} className="space-y-4">
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <Label htmlFor="remember" className="font-normal cursor-pointer">
                                Ingat saya
                            </Label>
                        </div>

                        <Button className="w-full mt-6" type="submit" disabled={processing}>
                            {processing ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="px-0 flex flex-col items-center">
                    <div className="text-center text-sm text-muted-foreground mt-4">
                        Belum punya akun?{' '}
                        <Link href={route('register')} className="font-medium text-primary hover:underline">
                            Daftar sekarang
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </GuestLayout>
    );
}
