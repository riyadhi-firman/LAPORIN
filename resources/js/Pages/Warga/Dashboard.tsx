import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps, Report } from '@/types';
import { FileText, PlusCircle, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';

export default function Dashboard({ 
    totalReports, 
    statusStats,
    recentReports
}: PageProps<{ totalReports: number, statusStats: any, recentReports: Report[] }>) {
    
    const { flash } = usePage<PageProps>().props;

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
        <AuthenticatedLayout header="Dashboard Warga">
            <Head title="Dashboard Warga" />

            {flash?.success && (
                <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-600 px-4 py-3 rounded-lg relative text-sm font-medium" role="alert">
                    {flash.success}
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Ringkasan Laporan Anda</h3>
                    <p className="text-sm text-muted-foreground">Pantau status laporan yang telah Anda buat.</p>
                </div>
                <Button asChild>
                    <Link href={route('reports.create')}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Buat Laporan Baru
                    </Link>
                </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalReports}</div>
                        <p className="text-xs text-muted-foreground mt-1">Laporan diajukan</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Diproses</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statusStats.diproses}</div>
                        <p className="text-xs text-muted-foreground mt-1">Sedang ditindaklanjuti</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Selesai</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statusStats.selesai}</div>
                        <p className="text-xs text-muted-foreground mt-1">Laporan terselesaikan</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Reports */}
            <Card>
                <CardHeader>
                    <CardTitle>Laporan Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                    {recentReports.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Judul</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentReports.map(report => (
                                        <TableRow key={report.id}>
                                            <TableCell className="font-medium">{report.title}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(report.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(report.status)} variant="outline">
                                                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={route('reports.show', report.id)}>Detail</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-12 flex flex-col items-center justify-center">
                            <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center mb-4">
                                <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium">Belum ada laporan</h3>
                            <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-sm mx-auto">
                                Anda belum membuat laporan. Mulai laporkan masalah infrastruktur, lingkungan, atau layanan publik di sekitar Anda.
                            </p>
                            <Button asChild variant="outline">
                                <Link href={route('reports.create')}>Buat Laporan Pertama</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
