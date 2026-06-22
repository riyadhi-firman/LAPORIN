import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { User, Lock, AlertTriangle } from 'lucide-react';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout header="Profile">
            <Head title="Profile" />

            <div className="flex flex-col gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Pengaturan Akun</h3>
                    <p className="text-sm text-muted-foreground">Kelola informasi profil, password, dan pengaturan akun Anda.</p>
                </div>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Informasi Profil</CardTitle>
                                <CardDescription>Perbarui nama dan alamat email akun Anda.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Lock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Ubah Password</CardTitle>
                                <CardDescription>Pastikan akun Anda menggunakan password yang kuat dan aman.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <UpdatePasswordForm className="max-w-xl" />
                    </CardContent>
                </Card>

                <Card className="border-destructive/30">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-destructive/10 p-2 rounded-full">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-destructive">Hapus Akun</CardTitle>
                                <CardDescription>Tindakan ini bersifat permanen dan tidak dapat dibatalkan.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DeleteUserForm className="max-w-xl" />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
