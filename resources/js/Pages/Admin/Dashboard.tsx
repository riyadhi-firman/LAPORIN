import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Users, FileText, CheckCircle, Clock, Activity, AlertCircle, Shield, ArrowRight } from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';

export default function Dashboard({ 
    totalReports, 
    totalUsers, 
    totalAdmins,
    statusStats,
    categoryStats,
    trendStats,
    recentReports
}: PageProps<{ 
    totalReports: number, 
    totalUsers: number, 
    totalAdmins: number, 
    statusStats: any,
    categoryStats: any[],
    trendStats: any[],
    recentReports: any[]
}>) {
    
    // Warna untuk Pie Chart (Distribusi Kategori)
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'menunggu': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'diproses': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'selesai': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'ditolak': return 'bg-destructive/10 text-destructive border-destructive/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <AuthenticatedLayout header="Dashboard Admin">
            <Head title="Dashboard Admin" />

            <div className="flex flex-col gap-4 mb-8">
                <h3 className="text-xl font-bold tracking-tight">Ringkasan Sistem</h3>
                <p className="text-sm text-muted-foreground">Gambaran umum tentang laporan dan pengguna dalam sistem.</p>
            </div>

            {/* Stat Cards - Top Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-primary">Total Laporan</CardTitle>
                        <FileText className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-primary">{totalReports}</div>
                        <p className="text-xs text-primary/80 mt-1">Seluruh laporan masuk</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Menunggu Verifikasi</CardTitle>
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statusStats.menunggu}</div>
                        <p className="text-xs text-muted-foreground mt-1">Laporan perlu ditinjau</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Laporan Selesai</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statusStats.selesai}</div>
                        <p className="text-xs text-muted-foreground mt-1">Laporan telah ditangani</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Warga</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <p className="text-xs text-muted-foreground mt-1">Warga terdaftar</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Admin</CardTitle>
                        <Shield className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalAdmins}</div>
                        <p className="text-xs text-muted-foreground mt-1">Administrator sistem</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Tren Laporan (Area Chart) - Takes up 2 columns */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Tren Laporan (6 Bulan Terakhir)</CardTitle>
                                <CardDescription>Jumlah laporan yang masuk setiap bulannya</CardDescription>
                            </div>
                            <Activity className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                    />
                                    <RechartsTooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'hsl(var(--card))', 
                                            borderColor: 'hsl(var(--border))',
                                            borderRadius: 'var(--radius)',
                                            color: 'hsl(var(--foreground))'
                                        }} 
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="total" 
                                        stroke="hsl(var(--primary))" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorTotal)" 
                                        activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Distribusi Kategori (Donut Chart) - Takes up 1 column */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Distribusi Kategori</CardTitle>
                        <CardDescription>Persentase laporan berdasarkan kategori</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex flex-col items-center justify-center">
                            {categoryStats.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryStats}
                                            cx="50%"
                                            cy="45%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {categoryStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'hsl(var(--card))', 
                                                borderColor: 'hsl(var(--border))',
                                                borderRadius: 'var(--radius)',
                                            }}
                                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                                        />
                                        <Legend 
                                            verticalAlign="bottom" 
                                            height={36} 
                                            iconType="circle"
                                            formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-muted-foreground flex flex-col items-center justify-center h-full">
                                    <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                                    <p>Belum ada data kategori</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Recent Reports Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Aktivitas Laporan Terbaru</CardTitle>
                        <CardDescription>5 laporan terakhir yang dikirimkan oleh warga</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.reports.index')}>
                            Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {recentReports.length > 0 ? (
                        <div className="space-y-4">
                            {recentReports.map((report) => (
                                <div key={report.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex flex-col gap-1 mb-2 sm:mb-0">
                                        <Link href={route('admin.reports.show', report.id)} className="font-semibold hover:underline line-clamp-1">
                                            {report.title}
                                        </Link>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>Oleh: {report.user_name}</span>
                                            <span>•</span>
                                            <span className="font-medium text-foreground">{report.category_name}</span>
                                            <span>•</span>
                                            <span className="flex items-center"><Clock className="h-3 w-3 mr-1"/> {report.date}</span>
                                        </div>
                                    </div>
                                    <Badge className={getStatusColor(report.status)} variant="outline">
                                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            Belum ada laporan yang masuk.
                        </div>
                    )}
                </CardContent>
            </Card>

        </AuthenticatedLayout>
    );
}
