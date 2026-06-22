import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { PageProps, Report } from '@/types';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Trash2, Calendar, User as UserIcon, Tag, MapPin, MessageSquare } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/Components/ui/card';
import { Textarea } from '@/Components/ui/textarea';
import MapView from '@/Components/MapView';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';

export default function AdminDetailReport({ report, auth }: PageProps<{ report: Report & { category?: { name: string }, comments?: any[], latitude?: number, longitude?: number } }>) {
    const { data, setData, put, processing: updating } = useForm({
        status: report.status,
    });
    const { data: commentData, setData: setCommentData, post, processing: commenting, reset } = useForm({
        body: '',
    });

    const [dialogOpen, setDialogOpen] = useState(false);

    const submitComment: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('comments.store', report.id), {
            preserveScroll: true,
            onSuccess: () => reset('body'),
        });
    };

    const updateStatus = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.reports.update-status', report.id), {
            preserveScroll: true,
        });
    };

    const deleteReport = () => {
        router.delete(route('admin.reports.destroy', report.id));
        setDialogOpen(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'menunggu': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
            case 'diproses': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
            case 'selesai': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
            case 'ditolak': return 'bg-destructive/10 text-destructive hover:bg-destructive/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <AuthenticatedLayout header={`Laporan #${report.id}`}>
            <Head title={`Proses Laporan #${report.id}`} />

            <div className="mb-6">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                    <Link href={route('admin.reports.index')} className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Daftar Laporan
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    <Card>
                        <CardHeader className="pb-4 border-b">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl leading-tight">{report.title}</CardTitle>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {new Date(report.created_at).toLocaleDateString('id-ID', { 
                                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <UserIcon className="h-4 w-4" />
                                            <span>{report.user?.name} ({report.user?.email})</span>
                                        </div>
                                        {report.category && (
                                            <div className="flex items-center gap-1.5">
                                                <Tag className="h-4 w-4" />
                                                <span>{report.category.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Badge className={getStatusColor(report.status)} variant="outline">
                                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none whitespace-pre-wrap">
                                {report.description}
                            </div>
                        </CardContent>
                    </Card>

                    {report.latitude && report.longitude && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-lg">Lokasi Kejadian</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <MapView latitude={report.latitude} longitude={report.longitude} />
                            </CardContent>
                        </Card>
                    )}

                    {report.image && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Lampiran Foto</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border bg-muted/50 p-2 overflow-hidden flex justify-center">
                                    <a href={`/storage/${report.image}`} target="_blank" rel="noreferrer" title="Klik untuk memperbesar">
                                        <img 
                                            src={`/storage/${report.image}`} 
                                            alt="Lampiran Laporan" 
                                            className="max-h-[500px] object-contain rounded" 
                                        />
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">Komentar & Tanggapan</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {report.comments && report.comments.length > 0 ? (
                                <div className="space-y-4 mb-6">
                                    {report.comments.map((comment: any) => (
                                        <div key={comment.id} className={`flex flex-col p-4 rounded-lg border ${comment.user_id === auth.user.id ? 'bg-primary/5 border-primary/20 ml-8' : 'bg-muted/50 mr-8'}`}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-semibold text-sm">
                                                    {comment.user.name} {comment.user.role === 'admin' && <Badge variant="secondary" className="ml-2 text-[10px]">Admin</Badge>}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(comment.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-sm whitespace-pre-wrap">{comment.body}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground mb-6 text-center py-4">Belum ada tanggapan.</p>
                            )}

                            <form onSubmit={submitComment} className="flex flex-col gap-2 pt-4 border-t">
                                <Textarea 
                                    placeholder="Tulis tanggapan resmi..."
                                    value={commentData.body}
                                    onChange={(e) => setCommentData('body', e.target.value)}
                                    className="min-h-[100px]"
                                    required
                                />
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={commenting || !commentData.body.trim()}>
                                        Kirim Tanggapan
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar / Actions */}
                <div className="w-full lg:w-[320px] shrink-0 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Tindakan</CardTitle>
                            <CardDescription>Perbarui status laporan ini.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={updateStatus} className="space-y-4">
                                <div className="space-y-2">
                                    <Select 
                                        value={data.status} 
                                        onValueChange={(val) => setData('status', val as any)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="menunggu">Menunggu</SelectItem>
                                            <SelectItem value="diproses">Diproses</SelectItem>
                                            <SelectItem value="selesai">Selesai</SelectItem>
                                            <SelectItem value="ditolak">Ditolak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={updating || data.status === report.status}
                                    className="w-full"
                                >
                                    Perbarui Status
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border-destructive/50 bg-destructive/5">
                        <CardHeader>
                            <CardTitle className="text-lg text-destructive">Zona Berbahaya</CardTitle>
                            <CardDescription>Tindakan ini tidak dapat dibatalkan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" className="w-full gap-2">
                                        <Trash2 className="h-4 w-4" /> Hapus Laporan
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Apakah Anda yakin ingin menghapus laporan ini?</DialogTitle>
                                        <DialogDescription>
                                            Laporan yang dihapus tidak dapat dikembalikan. Semua data dan lampiran terkait akan dihapus secara permanen dari sistem.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="gap-2 sm:gap-0">
                                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                                        <Button variant="destructive" onClick={deleteReport}>Hapus Permanen</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
