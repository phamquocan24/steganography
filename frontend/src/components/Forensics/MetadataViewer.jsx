/**
 * Metadata Viewer Component
 * Displays EXIF, GPS, and embedded metadata from images
 */

import React, { useState } from 'react';
import { Camera, MapPin, Info, AlertTriangle, Calendar, Settings } from 'lucide-react';
import { Alert, DataTable, StatCard } from './shared/UIComponents';
import clsx from 'clsx';

export default function MetadataViewer({ data }) {
    const [activeTab, setActiveTab] = useState('basic');

    if (!data) {
        return (
            <div className="text-center py-12 text-gray-500">
                <Info className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Không có metadata</p>
            </div>
        );
    }

    const tabs = [
        { id: 'basic', label: 'Thông tin cơ bản', icon: Info },
        { id: 'exif', label: 'Dữ liệu EXIF', icon: Camera },
        { id: 'gps', label: 'Vị trí GPS', icon: MapPin },
        { id: 'comments', label: 'Bình luận', icon: Settings }
    ];

    return (
        <div className="space-y-4">
            {/* Suspicious Findings Alert */}
            {data.suspicious_findings && data.suspicious_findings.length > 0 && (
                <Alert severity="warning" title="Phát hiện Metadata đáng ngờ">
                    <ul className="list-disc list-inside space-y-1">
                        {data.suspicious_findings.map((finding, idx) => (
                            <li key={idx}>
                                <strong>{finding.type}:</strong> {finding.message}
                                {finding.matches && (
                                    <div className="ml-6 mt-1 text-xs">
                                        Tìm thấy: {finding.matches.slice(0, 3).join(', ')}
                                        {finding.matches.length > 3 && ` (+${finding.matches.length - 3} nữa)`}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </Alert>
            )}

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                "flex items-center px-4 py-2 border-b-2 font-medium text-sm transition-colors",
                                activeTab === tab.id
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            )}
                        >
                            <tab.icon className="w-4 h-4 mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                {activeTab === 'basic' && <BasicInfo data={data.basic} />}
                {activeTab === 'exif' && <ExifData data={data.exif} />}
                {activeTab === 'gps' && <GPSInfo data={data.gps} />}
                {activeTab === 'comments' && <Comments data={data.comments} />}
            </div>
        </div>
    );
}

function BasicInfo({ data }) {
    if (!data) return <div className="p-4 text-gray-500">Đang tải thông tin cơ bản...</div>;

    const stats = [
        { label: 'Định dạng', value: data.format || 'Không rõ', icon: Info },
        { label: 'Kích thước', value: data.size?.dimensions || 'N/A', icon: Settings },
        { label: 'Dung lượng', value: data.file_size?.mb ? `${data.file_size.mb} MB` : 'N/A', icon: Info },
        { label: 'Chế độ màu', value: data.color_info?.mode || 'N/A', icon: Settings }
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            {/* Detailed Info */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                <InfoCard title="Thuộc tính hình ảnh">
                    <InfoRow label="Chiều rộng" value={`${data.size?.width || 0}px`} />
                    <InfoRow label="Chiều cao" value={`${data.size?.height || 0}px`} />
                    <InfoRow label="Megapixel" value={data.size?.megapixels || 0} />
                    <InfoRow label="DPI" value={data.dpi ? `${data.dpi[0]} x ${data.dpi[1]}` : 'N/A'} />
                </InfoCard>

                <InfoCard title="Thông tin màu sắc">
                    <InfoRow label="Chế độ" value={data.color_info?.mode || 'N/A'} />
                    <InfoRow label="Dải màu (Bands)" value={data.color_info?.bands || 0} />
                    <InfoRow label="Có Alpha" value={data.color_info?.has_alpha ? 'Có' : 'Không'} />
                </InfoCard>
            </div>
        </div>
    );
}

function ExifData({ data }) {
    if (!data || !data.available) {
        return (
            <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Không có dữ liệu EXIF</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Camera Info */}
            {data.camera && Object.keys(data.camera).length > 0 && (
                <InfoCard title="Thông tin máy ảnh" icon={Camera}>
                    {Object.entries(data.camera).map(([key, value]) => (
                        <InfoRow key={key} label={formatKey(key)} value={value || 'N/A'} />
                    ))}
                </InfoCard>
            )}

            {/* DateTime Info */}
            {data.datetime && Object.keys(data.datetime).length > 0 && (
                <InfoCard title="Ngày & Giờ" icon={Calendar}>
                    {Object.entries(data.datetime).map(([key, value]) => (
                        <InfoRow key={key} label={formatKey(key)} value={value || 'N/A'} />
                    ))}
                </InfoCard>
            )}

            {/* Capture Settings */}
            {data.capture_settings && Object.keys(data.capture_settings).length > 0 && (
                <InfoCard title="Cài đặt chụp" icon={Settings}>
                    {Object.entries(data.capture_settings).map(([key, value]) => (
                        <InfoRow key={key} label={formatKey(key)} value={String(value) || 'N/A'} />
                    ))}
                </InfoCard>
            )}

            {/* Other EXIF Data */}
            {data.other && Object.keys(data.other).length > 0 && (
                <InfoCard title="Thông tin bổ sung">
                    {Object.entries(data.other).map(([key, value]) => (
                        <InfoRow key={key} label={formatKey(key)} value={String(value) || 'N/A'} />
                    ))}
                </InfoCard>
            )}

            <div className="text-sm text-gray-500 text-center pt-4">
                Tìm thấy tổng cộng {data.tag_count || 0} thẻ EXIF
            </div>
        </div>
    );
}

function GPSInfo({ data }) {
    if (!data || !data.available) {
        return (
            <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Không có dữ liệu GPS</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Alert severity="info" title="Tìm thấy tọa độ GPS">
                Ảnh này chứa dữ liệu địa điểm nhúng
            </Alert>

            <InfoCard title="Chi tiết vị trí" icon={MapPin}>
                <InfoRow label="Vĩ độ" value={data.latitude || 'N/A'} />
                <InfoRow label="Kinh độ" value={data.longitude || 'N/A'} />
                <InfoRow label="Độ cao" value={data.altitude || 'N/A'} />
                <InfoRow label="Dấu thời gian" value={data.timestamp || 'N/A'} />
            </InfoCard>

            {/* Google Maps Link */}
            {data.google_maps_url && (
                <a
                    href={data.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <MapPin className="w-5 h-5 inline-block mr-2" />
                    Xem trên Google Maps
                </a>
            )}
        </div>
    );
}

function Comments({ data }) {
    if (!data || !data.available || !data.data || Object.keys(data.data).length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Info className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Không tìm thấy bình luận hoặc mô tả nào</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Alert severity="info">
                Tìm thấy {Object.keys(data.data || {}).length} trường bình luận với tổng độ dài {data.total_length || 0} ký tự
            </Alert>

            {Object.entries(data.data || {}).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">{formatKey(key)}</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap font-mono">
                        {value}
                    </p>
                </div>
            ))}
        </div>
    );
}

// Helper Components
function InfoCard({ title, icon: Icon, children }) {
    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                {Icon && <Icon className="w-5 h-5 mr-2 text-blue-600" />}
                {title}
            </h3>
            <div className="space-y-2">
                {children}
            </div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between items-center text-sm py-1 border-b border-gray-200 last:border-0">
            <span className="text-gray-600 font-medium">{label}</span>
            <span className="text-gray-900">{value}</span>
        </div>
    );
}

// Utility function
function formatKey(key) {
    return key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
