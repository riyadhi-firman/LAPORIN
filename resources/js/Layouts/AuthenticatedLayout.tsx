import { PropsWithChildren, ReactNode, useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { LayoutDashboard, FileText, Users, LogOut, Menu, X, User, Bell, Settings } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { ThemeToggle } from '@/Components/ThemeToggle';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { user, notifications = [], unread_count = 0 } = usePage<any>().props.auth;
    const app_settings = usePage<any>().props.app_settings || { app_name: 'LaporIn', app_logo: null };
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isAdmin = user.role === 'admin';
    const navigation = isAdmin
        ? [
              { name: 'Dashboard', href: route('admin.dashboard'), current: route().current('admin.dashboard'), icon: LayoutDashboard },
              { name: 'Semua Laporan', href: route('admin.reports.index'), current: route().current('admin.reports.*'), icon: FileText },
              { name: 'Users', href: route('admin.users.index'), current: route().current('admin.users.*'), icon: Users },
              { name: 'Pengaturan', href: route('admin.settings.index'), current: route().current('admin.settings.*'), icon: Settings },
          ]
        : [
              { name: 'Dashboard', href: route('dashboard'), current: route().current('dashboard'), icon: LayoutDashboard },
              { name: 'Laporanku', href: route('reports.index'), current: route().current('reports.*'), icon: FileText },
          ];

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Mobile sidebar toggle */}
            <div className="md:hidden flex items-center justify-between p-4 border-b bg-sidebar">
                <Link href="/" className="flex items-center gap-2 text-sidebar-foreground">
                    {app_settings.app_logo ? (
                        <img src={app_settings.app_logo} alt="Logo" className="h-8 w-8 object-contain" />
                    ) : (
                        <ApplicationLogo className="h-8 w-8 fill-current text-primary" />
                    )}
                    <span className="text-xl font-bold">{app_settings.app_name}</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-sidebar-foreground">
                    {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex h-full flex-col">
                    <div className="flex h-16 shrink-0 items-center px-6 border-b border-sidebar-border hidden md:flex">
                        <Link href="/" className="flex items-center gap-2">
                            {app_settings.app_logo ? (
                                <img src={app_settings.app_logo} alt="Logo" className="h-8 w-8 object-contain" />
                            ) : (
                                <ApplicationLogo className="h-8 w-8 fill-current text-primary" />
                            )}
                            <span className="text-xl font-bold tracking-tight text-sidebar-foreground">{app_settings.app_name}</span>
                        </Link>
                    </div>

                    <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                        <nav className="flex-1 space-y-1 px-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                                        item.current
                                            ? 'bg-sidebar-accent text-sidebar-foreground'
                                            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                                    }`}
                                >
                                    <item.icon
                                        className={`mr-3 h-5 w-5 shrink-0 ${
                                            item.current ? 'text-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground'
                                        }`}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="border-b bg-card flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    <div>
                        {header && (
                            <h1 className="text-2xl font-semibold text-foreground tracking-tight">{header}</h1>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Notifications */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="h-5 w-5" />
                                    {unread_count > 0 && (
                                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-y-auto">
                                <DropdownMenuLabel className="flex justify-between items-center">
                                    Notifikasi
                                    {unread_count > 0 && (
                                        <Button variant="ghost" size="sm" className="h-auto text-xs px-2 py-1" onClick={() => router.post(route('notifications.mark-all-as-read'))}>
                                            Tandai semua dibaca
                                        </Button>
                                    )}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {notifications.length > 0 ? (
                                    notifications.map((notif: any) => (
                                        <DropdownMenuItem key={notif.id} className="p-3 cursor-pointer flex flex-col items-start gap-1 focus:bg-accent" onClick={() => router.post(route('notifications.mark-as-read', notif.id))}>
                                            <span className="font-semibold text-sm">{notif.data.title}</span>
                                            <span className="text-xs text-muted-foreground whitespace-normal line-clamp-2">{notif.data.message}</span>
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-sm text-muted-foreground">Tidak ada notifikasi baru</div>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Profile */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-md">
                                    <Avatar className="h-8 w-8 rounded-md">
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} />
                                        <AvatarFallback className="rounded-md bg-primary text-primary-foreground">
                                            {user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={route('profile.edit')} className="w-full cursor-pointer flex items-center">
                                        <User className="mr-2 h-4 w-4" /> Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={route('logout')} method="post" as="button" className="w-full cursor-pointer flex items-center text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" /> Log out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-muted/20">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
