import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps, Report } from '@/types';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Trash2, Edit, Calendar, Info, MapPin, Tag, MessageSquare } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Textarea } from '@/Components/ui/textarea';
import MapView from '@/Components/MapView';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';

export default function DetailReport({ report, auth }: PageProps<{ report: Report & { category?: { name: string }, comments?: any[], latitude?: number, longitude?: number } }>) {
    const { delete: destroy, processing: deleting } = useForm();
    const { data, setData, post, processing: commenting, reset } = useForm({
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

    const deleteReport = () => {
        destroy(route('reports.destroy', report.id), {
            preserveScroll: true,
            onSuccess: () => setDialogOpen(false),
        });
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
        <AuthenticatedLayout header={`Detail Laporan #${report.id}`}>
            <Head title={`Laporan #${report.id}`} />

            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                    <Link href={route('reports.index')} className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Daftar
                    </Link>
                </Button>

                {report.status === 'menunggu' && (
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button variant="outline" asChild className="flex-1 sm:flex-none">
                            <Link href={route('reports.edit', report.id)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Laporan
                            </Link>
                        </Button>
                        
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" className="flex-1 sm:flex-none">
                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Apakah Anda yakin ingin menghapus laporan ini?</DialogTitle>
                                    <DialogDescription>
                                        Laporan yang dihapus tidak dapat dikembalikan. Ini akan menghapus data laporan beserta lampiran fotonya secara permanen.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={deleting}>Batal</Button>
                                    <Button variant="destructive" onClick={deleteReport} disabled={deleting}>
                                        {deleting ? 'Menghapus...' : 'Hapus Permanen'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-6 max-w-4xl">
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
                                        <Info className="h-4 w-4" />
                                        <span>Diperbarui: {new Date(report.updated_at).toLocaleDateString('id-ID')}</span>
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
                                <img 
                                    src={`/storage/${report.image}`} 
                                    alt="Lampiran Laporan" 
                                    className="max-h-[500px] object-contain rounded" 
                                />
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
                                placeholder="Tulis komentar atau tanggapan..."
                                value={data.body}
                                onChange={(e) => setData('body', e.target.value)}
                                className="min-h-[100px]"
                                required
                            />
                            <div className="flex justify-end">
                                <Button type="submit" disabled={commenting || !data.body.trim()}>
                                    Kirim Komentar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
