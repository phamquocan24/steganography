/**
 * Reusable Image Grid Component
 * For displaying multiple images (channels, bit planes, operations)
 */

import React from 'react';
import clsx from 'clsx';

export function ImageGrid({ images, columns = 3, onImageClick }) {
    return (
        <div className={clsx(
            "grid gap-4",
            columns === 2 && "grid-cols-1 md:grid-cols-2",
            columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        )}>
            {images.map((img, idx) => (
                <ImageCard
                    key={idx}
                    src={img.src}
                    label={img.label}
                    onClick={() => onImageClick?.(img)}
                />
            ))}
        </div>
    );
}

function ImageCard({ src, label, onClick }) {
    return (
        <div
            className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer"
            onClick={onClick}
        >
            <div className="aspect-square bg-gray-100 rounded overflow-hidden mb-2">
                <img
                    src={src}
                    alt={label}
                    className="w-full h-full object-contain"
                />
            </div>
            <p className="text-sm font-medium text-gray-700 text-center">{label}</p>
        </div>
    );
}

export function DataTable({ data, columns }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-gray-50">
                            {columns.map((col, colIdx) => (
                                <td key={colIdx} className="px-4 py-3 text-sm text-gray-900">
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function Alert({ severity = 'info', title, children }) {
    const colors = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        error: 'bg-red-50 border-red-200 text-red-800'
    };

    return (
        <div className={clsx("rounded-lg border p-4", colors[severity])}>
            {title && <h4 className="font-semibold mb-2">{title}</h4>}
            <div className="text-sm">{children}</div>
        </div>
    );
}

export function StatCard({ icon: Icon, label, value, color = 'indigo', subtitle }) {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-600',
        red: 'bg-red-50 text-red-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        blue: 'bg-blue-50 text-blue-600',
        orange: 'bg-orange-50 text-orange-600',
        purple: 'bg-purple-50 text-purple-600',
        gray: 'bg-gray-50 text-gray-600'
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {subtitle && (
                        <p className={clsx("text-xs font-medium mt-1", colors[color]?.split(' ')[1] || 'text-gray-500')}>
                            {subtitle}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className={clsx("p-3 rounded-full", colors[color])}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>
        </div>
    );
}
