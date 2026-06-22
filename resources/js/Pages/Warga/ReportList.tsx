import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, Report } from '@/types';
import { Badge } from '@/Components/ui/badge';
import { PlusCircle, FileText, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';

interface ReportWithCategory extends Report {
    category?: { name: string };
}

interface PaginationData {
    data: ReportWithCategory[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function ReportList({ reports }: PageProps<{ reports: PaginationData }>) {
    
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
        <AuthenticatedLayout header="Semua Laporan Saya">
            <Head title="Laporanku" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Daftar Laporan Anda</h3>
                    <p className="text-sm text-muted-foreground">Total {reports.total} laporan telah dibuat.</p>
                </div>
                <Button asChild>
                    <Link href={route('reports.create')}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Buat Laporan Baru
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    {reports.data.length > 0 ? (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">ID</TableHead>
                                        <TableHead>Judul Laporan</TableHead>
                                        <TableHead className="w-[150px]">Tanggal</TableHead>
                                        <TableHead className="w-[120px]">Status</TableHead>
                                        <TableHead className="w-[100px] text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reports.data.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell className="font-medium text-muted-foreground">#{report.id}</TableCell>
                                            <TableCell className="font-medium">
                                                {report.title.length > 50 ? report.title.substring(0, 50) + '...' : report.title}
                                                {report.category && (
                                                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                                        <Tag className="w-3 h-3" />
                                                        {report.category.name}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {new Date(report.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(report.status)} variant="outline">
                                                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild className="h-8 gap-1">
                                                    <Link href={route('reports.show', report.id)}>
                                                        Detail <ArrowRight className="h-3 w-3" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            {reports.last_page > 1 && (
                                <div className="flex items-center justify-center space-x-2 py-4 border-t">
                                    {reports.links.map((link, key) => {
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
                        </>
                    ) : (
                        <div className="text-center py-16 flex flex-col items-center justify-center">
                            <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center mb-4">
                                <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium">Belum ada laporan</h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                                Anda belum membuat laporan. Mulai buat laporan masalah lingkungan atau infrastruktur di sekitar Anda.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
