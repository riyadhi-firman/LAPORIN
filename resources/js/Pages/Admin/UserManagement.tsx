import { useState, FormEventHandler } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { PageProps, User } from '@/types';
import { Users, Plus, Search, Shield, UserCheck, Trash2, Edit, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Badge } from '@/Components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

interface PaginationData {
    data: User[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Filters {
    role?: string;
    search?: string;
}

export default function UserManagement({ auth, users, filters, flash }: PageProps<{
    users: PaginationData;
    filters: Filters;
    flash?: { success?: string; error?: string };
}>) {
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchValue, setSearchValue] = useState(filters?.search || '');

    // Form for adding new user
    const addForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'admin',
    });

    // Form for updating role
    const roleForm = useForm({
        role: '',
    });

    const handleAddUser: FormEventHandler = (e) => {
        e.preventDefault();
        addForm.post(route('admin.users.store'), {
            onSuccess: () => {
                setAddDialogOpen(false);
                addForm.reset();
            },
        });
    };

    const handleUpdateRole: FormEventHandler = (e) => {
        e.preventDefault();
        if (!selectedUser) return;
        roleForm.put(route('admin.users.update-role', selectedUser.id), {
            onSuccess: () => {
                setRoleDialogOpen(false);
                setSelectedUser(null);
                roleForm.reset();
            },
        });
    };

    const handleDeleteUser = () => {
        if (!selectedUser) return;
        router.delete(route('admin.users.destroy', selectedUser.id), {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setSelectedUser(null);
            },
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.users.index'), {
            search: searchValue || undefined,
            role: filters?.role || undefined,
        }, { preserveState: true });
    };

    const handleFilterRole = (role: string) => {
        router.get(route('admin.users.index'), {
            role: role === 'all' ? undefined : role,
            search: filters?.search || undefined,
        }, { preserveState: true });
    };

    const openRoleDialog = (user: User) => {
        setSelectedUser(user);
        roleForm.setData('role', user.role);
        setRoleDialogOpen(true);
    };

    const openDeleteDialog = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const currentUserId = auth.user.id;

    return (
        <AuthenticatedLayout header="Manajemen Pengguna">
            <Head title="Manajemen Pengguna" />

            {/* Flash messages */}
            {flash?.success && (
                <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-400 text-sm animate-fade-in">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm animate-fade-in">
                    {flash.error}
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Daftar Semua Pengguna</h3>
                    <p className="text-sm text-muted-foreground">Kelola semua pengguna dan administrator dalam sistem.</p>
                </div>

                {/* Add User Button */}
                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            Tambah Pengguna
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                            <DialogDescription>
                                Buat akun pengguna baru. Anda dapat menambahkan admin atau warga.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddUser} id="add-user-form">
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        value={addForm.data.name}
                                        onChange={(e) => addForm.setData('name', e.target.value)}
                                        placeholder="Masukkan nama lengkap"
                                    />
                                    {addForm.errors.name && (
                                        <p className="text-sm text-destructive">{addForm.errors.name}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={addForm.data.email}
                                        onChange={(e) => addForm.setData('email', e.target.value)}
                                        placeholder="contoh@email.com"
                                    />
                                    {addForm.errors.email && (
                                        <p className="text-sm text-destructive">{addForm.errors.email}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select
                                        value={addForm.data.role}
                                        onValueChange={(value) => addForm.setData('role', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="warga">Warga</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {addForm.errors.role && (
                                        <p className="text-sm text-destructive">{addForm.errors.role}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={addForm.data.password}
                                        onChange={(e) => addForm.setData('password', e.target.value)}
                                        placeholder="Minimal 8 karakter"
                                    />
                                    {addForm.errors.password && (
                                        <p className="text-sm text-destructive">{addForm.errors.password}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={addForm.data.password_confirmation}
                                        onChange={(e) => addForm.setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi password"
                                    />
                                </div>
                            </div>
                        </form>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" form="add-user-form" disabled={addForm.processing}>
                                {addForm.processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari berdasarkan nama atau email..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit" variant="secondary">Cari</Button>
                </form>

                <Select
                    value={filters?.role || 'all'}
                    onValueChange={handleFilterRole}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Filter Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Role</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="warga">Warga</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Semua Pengguna</CardTitle>
                            <CardDescription>Total {users.total} pengguna terdaftar dalam sistem.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead>Nama Lengkap</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="w-[120px]">Role</TableHead>
                                <TableHead className="w-[150px]">Terdaftar Sejak</TableHead>
                                <TableHead className="w-[100px] text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length > 0 ? users.data.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium text-muted-foreground">#{user.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{user.name}</span>
                                            {user.id === currentUserId && (
                                                <Badge variant="outline" className="text-xs">Anda</Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                    <TableCell>
                                        {user.role === 'admin' ? (
                                            <Badge className="gap-1 bg-purple-500/20 text-purple-400 border-purple-500/30 border">
                                                <Shield className="h-3 w-3" />
                                                Admin
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="gap-1">
                                                <UserCheck className="h-3 w-3" />
                                                Warga
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(user.created_at || '').toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {user.id !== currentUserId ? (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openRoleDialog(user)} className="cursor-pointer">
                                                        <Shield className="mr-2 h-4 w-4" />
                                                        Ubah Role
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => openDeleteDialog(user)}
                                                        className="cursor-pointer text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Hapus Pengguna
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        Tidak ada pengguna yang ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="flex items-center justify-center space-x-2 py-4 border-t">
                            {users.links.map((link, key) => {
                                let label = link.label;
                                if (label.includes('Previous')) label = '«';
                                if (label.includes('Next')) label = '»';

                                return link.url === null ? (
                                    <Button key={key} variant="outline" size="icon" disabled className="w-8 h-8 opacity-50">
                                        <span dangerouslySetInnerHTML={{ __html: label }} />
                                    </Button>
                                ) : (
                                    <Button
                                        key={key}
                                        variant={link.active ? "default" : "outline"}
                                        size="icon"
                                        asChild
                                        className="w-8 h-8"
                                    >
                                        <Link href={link.url} dangerouslySetInnerHTML={{ __html: label }} />
                                    </Button>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Update Role Dialog */}
            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                <DialogContent className="sm:max-w-[350px]">
                    <DialogHeader>
                        <DialogTitle>Ubah Role Pengguna</DialogTitle>
                        <DialogDescription>
                            Ubah role untuk <span className="font-semibold text-foreground">{selectedUser?.name}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateRole} id="update-role-form">
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="update-role">Role Baru</Label>
                                <Select
                                    value={roleForm.data.role}
                                    onValueChange={(value) => roleForm.setData('role', value)}
                                >
                                    <SelectTrigger id="update-role">
                                        <SelectValue placeholder="Pilih role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="warga">Warga</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </form>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setRoleDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button type="submit" form="update-role-form" disabled={roleForm.processing}>
                            {roleForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Hapus Pengguna</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus pengguna <span className="font-semibold text-foreground">{selectedUser?.name}</span>?
                            Semua laporan milik pengguna ini juga akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteUser}>
                            Ya, Hapus Pengguna
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
