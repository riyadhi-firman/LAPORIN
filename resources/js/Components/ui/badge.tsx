import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
                secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
                destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
                outline: 'text-foreground',
                menunggu: 'border-transparent bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                diproses: 'border-transparent bg-blue-500/20 text-blue-400 border-blue-500/30',
                selesai: 'border-transparent bg-green-500/20 text-green-400 border-green-500/30',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// Status badge helper
export function StatusBadge({ status }: { status: string }) {
    const variantMap: Record<string, 'menunggu' | 'diproses' | 'selesai'> = {
        menunggu: 'menunggu',
        diproses: 'diproses',
        selesai: 'selesai',
    };
    const labelMap: Record<string, string> = {
        menunggu: 'Menunggu',
        diproses: 'Diproses',
        selesai: 'Selesai',
    };
    return (
        <Badge variant={variantMap[status] ?? 'secondary'}>
            {labelMap[status] ?? status}
        </Badge>
    );
}

export { Badge, badgeVariants };
