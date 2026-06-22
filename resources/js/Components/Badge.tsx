import React from 'react';

export default function Badge({ status }: { status: string }) {
    const colors = {
        menunggu: 'bg-yellow-100 text-yellow-800',
        diproses: 'bg-blue-100 text-blue-800',
        selesai: 'bg-green-100 text-green-800',
    };
    
    const colorClass = colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass}`}>
            {status}
        </span>
    );
}
