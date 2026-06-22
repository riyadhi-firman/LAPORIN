import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <p className="text-sm text-muted-foreground">
                Setelah akun Anda dihapus, semua data dan laporan akan dihapus secara permanen.
                Sebelum menghapus akun, pastikan Anda telah mengunduh data yang ingin disimpan.
            </p>

            <Button variant="destructive" onClick={confirmUserDeletion}>
                Hapus Akun Saya
            </Button>

            <Dialog open={confirmingUserDeletion} onOpenChange={setConfirmingUserDeletion}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Apakah Anda yakin?</DialogTitle>
                        <DialogDescription>
                            Setelah akun Anda dihapus, semua data akan dihapus secara permanen.
                            Masukkan password Anda untuk mengkonfirmasi penghapusan akun.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={deleteUser} id="delete-user-form">
                        <div className="grid gap-2 py-4">
                            <Label htmlFor="delete-password">Password</Label>
                            <Input
                                id="delete-password"
                                type="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Masukkan password Anda"
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password}</p>
                            )}
                        </div>
                    </form>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={closeModal}>
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            form="delete-user-form"
                            variant="destructive"
                            disabled={processing}
                        >
                            {processing ? 'Menghapus...' : 'Ya, Hapus Akun'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
}
