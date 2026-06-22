import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, Report } from '@/types';
import { Badge } from '@/Components/ui/badge';
import { ArrowRight, Search, Filter, Tag, Download } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
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

export default function AdminReportList({ reports, filters }: PageProps<{ reports: PaginationData, filters: { status: string, search: string } }>) {
    
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = () => {
        router.get(route('admin.reports.index'), { search, status }, { preserveState: true });
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
        <AuthenticatedLayout header="Manajemen Laporan">
            <Head title="Semua Laporan" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Daftar Semua Laporan</h3>
                    <p className="text-sm text-muted-foreground">Tinjau, proses, dan kelola laporan dari warga.</p>
                </div>
                <Button variant="outline" asChild>
                    <a href={route('admin.reports.export', { status, search })}>
                        <Download className="mr-2 h-4 w-4" />
                        Ekspor CSV
                    </a>
                </Button>
            </div>

            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Filter Laporan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari judul atau nama pelapor..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                className="pl-9"
                            />
                        </div>
                        <div className="w-full sm:w-[200px]">
                            <Select 
                                value={status} 
                                onValueChange={(val) => {
                                    const newStatus = val === 'semua' ? '' : val;
                                    setStatus(newStatus);
                                    router.get(route('admin.reports.index'), { search, status: newStatus }, { preserveState: true });
                                }}
                            >
                                <SelectTrigger>
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                        <SelectValue placeholder="Semua Status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua Status</SelectItem>
                                    <SelectItem value="menunggu">Menunggu</SelectItem>
                                    <SelectItem value="diproses">Diproses</SelectItem>
                                    <SelectItem value="selesai">Selesai</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleFilter} className="w-full sm:w-auto">
                            Cari
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead>Judul & Pelapor</TableHead>
                                <TableHead className="w-[150px]">Tanggal</TableHead>
                                <TableHead className="w-[120px]">Status</TableHead>
                                <TableHead className="w-[100px] text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.data.length > 0 ? reports.data.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium text-muted-foreground">#{report.id}</TableCell>
                                    <TableCell>
                                        <div className="font-medium truncate max-w-[250px] sm:max-w-md">{report.title}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-muted-foreground">{report.user?.name}</span>
                                            {report.category && (
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                                                    <Tag className="w-3 h-3" />
                                                    {report.category.name}
                                                </span>
                                            )}
                                        </div>
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
                                            <Link href={route('admin.reports.show', report.id)}>
                                                Proses <ArrowRight className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                        Tidak ada laporan yang ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {reports.last_page > 1 && (
                        <div className="flex items-center justify-center space-x-2 py-4 border-t">
                            {reports.links.map((link, key) => {
                                // Simplified label handling (Inertia gives &laquo; Previous)
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
        </AuthenticatedLayout>
    );
}
