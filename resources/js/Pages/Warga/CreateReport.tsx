import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FormEventHandler, useState } from 'react';
import { ArrowLeft, Image as ImageIcon, Send } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import MapPicker from '@/Components/MapPicker';

export default function CreateReport({ categories }: PageProps<{ categories: { id: number, name: string }[] }>) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        title: '',
        description: '',
        image: null as File | null,
        latitude: null as number | null,
        longitude: null as number | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('reports.store'));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AuthenticatedLayout header="Buat Laporan Baru">
            <Head title="Buat Laporan" />

            <div className="mb-6">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                    <Link href={route('reports.index')} className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Laporanku
                    </Link>
                </Button>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Formulir Pelaporan</CardTitle>
                    <CardDescription>
                        Sampaikan laporan Anda terkait masalah lingkungan atau infrastruktur dengan detail yang jelas.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={submit} encType="multipart/form-data">
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="category_id">Kategori Laporan</Label>
                            <Select 
                                value={data.category_id} 
                                onValueChange={(val) => setData('category_id', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kategori masalah" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Judul Laporan</Label>
                            <Input
                                id="title"
                                type="text"
                                name="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Contoh: Jalan berlubang di Jalan Sudirman"
                                required
                            />
                            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi Lengkap</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Jelaskan secara detail mengenai laporan Anda, lokasi spesifik, dan kondisi saat ini..."
                                className="min-h-[150px]"
                                required
                            />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Lokasi Kejadian (Opsional)</Label>
                            <p className="text-xs text-muted-foreground mb-2">Klik pada peta untuk menandai lokasi spesifik.</p>
                            <MapPicker 
                                latitude={data.latitude} 
                                longitude={data.longitude} 
                                onChange={(lat, lng) => {
                                    setData('latitude', lat);
                                    setData('longitude', lng);
                                }} 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Foto/Bukti Laporan (Opsional)</Label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10 transition-colors hover:bg-muted/50">
                                <div className="text-center">
                                    {preview ? (
                                        <div className="mb-4 relative">
                                            <img src={preview} alt="Preview" className="mx-auto max-h-[250px] rounded-md object-contain" />
                                            <Button 
                                                type="button" 
                                                variant="destructive" 
                                                size="sm"
                                                onClick={() => {setPreview(null); setData('image', null);}} 
                                                className="mt-4"
                                            >
                                                Hapus Gambar
                                            </Button>
                                        </div>
                                    ) : (
                                        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
                                    )}
                                    {!preview && (
                                        <>
                                            <div className="mt-4 flex text-sm leading-6 justify-center">
                                                <Label
                                                    htmlFor="image"
                                                    className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                                                >
                                                    <span>Unggah foto</span>
                                                    <input 
                                                        id="image" 
                                                        name="image" 
                                                        type="file" 
                                                        className="sr-only" 
                                                        accept="image/png, image/jpeg, image/jpg" 
                                                        onChange={handleImageChange} 
                                                    />
                                                </Label>
                                                <p className="pl-1 text-muted-foreground">atau seret ke sini</p>
                                            </div>
                                            <p className="text-xs leading-5 text-muted-foreground mt-1">PNG, JPG maksimal 5MB</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                        </div>
                    </CardContent>
                    <CardFooter className="border-t pt-6 flex justify-end">
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                            <Send className="mr-2 h-4 w-4" />
                            {processing ? 'Mengirim...' : 'Kirim Laporan'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </AuthenticatedLayout>
    );
}
