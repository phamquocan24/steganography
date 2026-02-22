/**
 * Visual Analysis Component
 * Displays channel decomposition, bit planes, and operations
 */

import React, { useState } from 'react';
import { Image as ImageIcon, Layers, GitCompare, BarChart3, AlertTriangle, Maximize2 } from 'lucide-react';
import { ImageGrid, Alert } from './shared/UIComponents';
import clsx from 'clsx';

export default function VisualAnalysis({ data }) {
    const [view, setView] = useState('channels'); // channels, bitplanes, operations, histograms
    const [selectedBit, setSelectedBit] = useState(0);
    const [selectedChannel, setSelectedChannel] = useState('red');
    const [lightboxImage, setLightboxImage] = useState(null);

    if (!data) {
        return <EmptyState />;
    }

    const views = [
        { id: 'channels', label: 'Kênh', icon: Layers },
        { id: 'bitplanes', label: 'Mặt phẳng bit', icon: GitCompare },
        { id: 'operations', label: 'Phép toán', icon: GitCompare },
        { id: 'histograms', label: 'Biểu đồ tần suất', icon: BarChart3 }
    ];

    return (
        <div className="space-y-4">
            {/* Anomaly Warnings */}
            {data.anomaly_analysis?.findings?.length > 0 && (
                <Alert severity="warning" title={`${data.anomaly_analysis.findings.length} Bất thường được phát hiện`}>
                    <div className="space-y-2">
                        {data.anomaly_analysis.findings.map((finding, idx) => (
                            <AnomalyFinding key={idx} finding={finding} />
                        ))}
                    </div>
                </Alert>
            )}

            {/* Image Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-4 gap-4 text-center">
                    <InfoStat label="Chế độ" value={data.image_info?.mode || 'N/A'} />
                    <InfoStat label="Kích thước" value={data.image_info?.size ? `${data.image_info.size.width}×${data.image_info.size.height}` : 'N/A'} />
                    <InfoStat label="Kênh màu" value={data.image_info?.channels || 'N/A'} />
                    <InfoStat label="Kiểu dữ liệu" value={data.image_info?.dtype || 'N/A'} />
                </div>
            </div>

            {/* View Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-4">
                    {views.map(v => (
                        <button
                            key={v.id}
                            onClick={() => setView(v.id)}
                            className={clsx(
                                "flex items-center px-4 py-2 border-b-2 font-medium text-sm transition-colors",
                                view === v.id
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <v.icon className="w-4 h-4 mr-2" />
                            {v.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* View Content */}
            <div>
                {view === 'channels' && (
                    <ChannelsView
                        channels={data.channels}
                        onImageClick={setLightboxImage}
                    />
                )}
                {view === 'bitplanes' && data.bit_planes && (
                    <BitPlanesView
                        bitPlanes={data.bit_planes}
                        selectedBit={selectedBit}
                        setSelectedBit={setSelectedBit}
                        selectedChannel={selectedChannel}
                        setSelectedChannel={setSelectedChannel}
                        onImageClick={setLightboxImage}
                    />
                )}
                {view === 'operations' && data.operations && (
                    <OperationsView
                        operations={data.operations}
                        onImageClick={setLightboxImage}
                    />
                )}
                {view === 'histograms' && data.histograms && (
                    <HistogramsView histograms={data.histograms} />
                )}
            </div>

            {/* Lightbox */}
            {lightboxImage && (
                <Lightbox
                    image={lightboxImage}
                    onClose={() => setLightboxImage(null)}
                />
            )}
        </div>
    );
}

function ChannelsView({ channels, onImageClick }) {
    if (!channels) return <EmptyState />;

    const channelList = Object.entries(channels).map(([name, src]) => ({
        src,
        label: name.charAt(0).toUpperCase() + name.slice(1) + ' Channel'
    }));

    return (
        <div>
            <ImageGrid
                images={channelList}
                columns={channels.alpha ? 4 : 3}
                onImageClick={onImageClick}
            />
        </div>
    );
}

function BitPlanesView({ bitPlanes, selectedBit, setSelectedBit, selectedChannel, setSelectedChannel, onImageClick }) {
    const channels = Object.keys(bitPlanes);
    const channelData = bitPlanes[selectedChannel];

    if (!channelData) return <EmptyState />;

    const bitImages = Object.entries(channelData).map(([bit, src]) => ({
        src,
        label: `Bit ${bit.replace('bit_', '')} - ${bit === 'bit_0' ? 'LSB' : bit === 'bit_7' ? 'MSB' : 'Giữa'}`,
        bitLevel: parseInt(bit.replace('bit_', ''))
    }));

    return (
        <div className="space-y-4">
            {/* Channel Selector */}
            <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700">Kênh:</label>
                <div className="flex space-x-2">
                    {channels.map(ch => (
                        <button
                            key={ch}
                            onClick={() => setSelectedChannel(ch)}
                            className={clsx(
                                "px-4 py-2 rounded-lg font-medium transition-colors",
                                selectedChannel === ch
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            )}
                        >
                            {ch.charAt(0).toUpperCase() + ch.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bit Plane Slider */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                        Mức bit: {selectedBit} {selectedBit === 0 ? '(LSB)' : selectedBit === 7 ? '(MSB)' : ''}
                    </label>
                    <span className="text-xs text-gray-500">Trượt để xem các mặt phẳng bit khác nhau</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="7"
                    value={selectedBit}
                    onChange={(e) => setSelectedBit(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 (LSB)</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7 (MSB)</span>
                </div>
            </div>

            {/* Selected Bit Plane Display */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                    Kênh {selectedChannel.charAt(0).toUpperCase() + selectedChannel.slice(1)} - Bit {selectedBit}
                </h3>
                <div
                    className="aspect-square bg-gray-100 rounded overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => onImageClick(bitImages.find(b => b.bitLevel === selectedBit))}
                >
                    <img
                        src={channelData[`bit_${selectedBit}`]}
                        alt={`Bit ${selectedBit}`}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            {/* All Bit Planes Grid */}
            <div>
                <h3 className="font-semibold text-gray-800 mb-3">Tất cả mặt phẳng bit</h3>
                <ImageGrid
                    images={bitImages}
                    columns={4}
                    onImageClick={onImageClick}
                />
            </div>
        </div>
    );
}

function OperationsView({ operations, onImageClick }) {
    if (!operations) return <EmptyState />;

    const operationsList = [
        { key: 'xor_rg', label: 'R ⊕ G (XOR)', description: 'Làm nổi bật sự khác biệt giữa đỏ và xanh lá' },
        { key: 'xor_rb', label: 'R ⊕ B (XOR)', description: 'Làm nổi bật sự khác biệt giữa đỏ và xanh dương' },
        { key: 'xor_gb', label: 'G ⊕ B (XOR)', description: 'Làm nổi bật sự khác biệt giữa xanh lá và xanh dương' },
        { key: 'xor_rgb', label: 'R ⊕ G ⊕ B (XOR)', description: 'XOR tổng hợp của tất cả các kênh' },
        { key: 'add_rg', label: 'R + G', description: 'Tổng của kênh đỏ và xanh lá' },
        { key: 'sub_rg', label: '|R - G|', description: 'Khác biệt tuyệt đối giữa đỏ và xanh lá' },
        { key: 'sub_rb', label: '|R - B|', description: 'Khác biệt tuyệt đối giữa đỏ và xanh dương' },
        { key: 'and_rg', label: 'R & G (AND)', description: 'Bitwise AND của đỏ và xanh lá' },
        { key: 'or_rg', label: 'R | G (OR)', description: 'Bitwise OR của đỏ và xanh lá' }
    ];

    const availableOps = operationsList.filter(op => operations[op.key]);

    const images = availableOps.map(op => ({
        src: operations[op.key],
        label: op.label,
        description: op.description
    }));

    return (
        <div className="space-y-4">
            <Alert severity="info">
                Các phép toán trên kênh có thể tiết lộ các mẫu ẩn và bất thường. Phép toán XOR đặc biệt hữu ích để phát hiện giấu tin.
            </Alert>
            <ImageGrid
                images={images}
                columns={3}
                onImageClick={onImageClick}
            />
        </div>
    );
}

function HistogramsView({ histograms }) {
    if (!histograms) return <EmptyState />;

    const channels = Object.entries(histograms).filter(([key]) => key !== 'combined');

    return (
        <div className="space-y-6">
            <Alert severity="info">
                Biểu đồ tần suất hiển thị phân bố giá trị pixel. Các mẫu bất thường có thể chỉ ra dữ liệu ẩn.
            </Alert>

            {channels.map(([channel, data]) => (
                <div key={channel} className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 capitalize">
                        Biểu đồ tần suất kênh {channel}
                    </h3>
                    <HistogramChart data={data} color={getChannelColor(channel)} />
                </div>
            ))}

            {histograms.combined && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Biểu đồ tần suất tổng hợp</h3>
                    <HistogramChart data={histograms.combined} color="#6366f1" />
                </div>
            )}
        </div>
    );
}

function HistogramChart({ data, color }) {
    const max = Math.max(...data);
    const scale = 100 / max;

    return (
        <div className="h-48 flex items-end space-x-px">
            {data.map((value, idx) => (
                <div
                    key={idx}
                    className="flex-1 transition-all hover:opacity-70"
                    style={{
                        height: `${value * scale}%`,
                        backgroundColor: color,
                        minWidth: '1px'
                    }}
                    title={`Value ${idx}: ${value}`}
                />
            ))}
        </div>
    );
}

function AnomalyFinding({ finding }) {
    const severityColors = {
        high: 'bg-red-50 border-red-200 text-red-800',
        medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        low: 'bg-blue-50 border-blue-200 text-blue-800'
    };

    return (
        <div className={clsx('p-3 rounded-lg border', severityColors[finding.severity] || severityColors.medium)}>
            <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                    <h4 className="font-semibold mb-1">{finding.type}</h4>
                    <p className="text-sm">{finding.message}</p>
                    {finding.recommendation && (
                        <p className="text-xs mt-1 italic">→ {finding.recommendation}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function Lightbox({ image, onClose }) {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="relative max-w-4xl max-h-full">
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                >
                    <span className="text-2xl">✕</span>
                </button>
                <img
                    src={image.src}
                    alt={image.label}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                />
                <p className="text-white text-center mt-4 font-medium">{image.label}</p>
            </div>
        </div>
    );
}

function InfoStat({ label, value }) {
    return (
        <div>
            <p className="text-xs text-gray-600">{label}</p>
            <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="text-center py-12 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Không có dữ liệu phân tích trực quan</p>
        </div>
    );
}

function getChannelColor(channel) {
    const colors = {
        red: '#ef4444',
        green: '#22c55e',
        blue: '#3b82f6',
        alpha: '#6b7280',
        grayscale: '#6b7280'
    };
    return colors[channel] || '#6366f1';
}
