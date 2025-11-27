import React, { useState, useEffect } from 'react';
import { Upload, AlertTriangle, CheckCircle, History, Info, X, FileImage, Zap, Settings, BarChart3, Shield, Clock, TrendingUp, Trash2, Image as ImageIcon, Activity, Database } from 'lucide-react';
import { getModels, predictImage } from './api';
import clsx from 'clsx';

function App() {
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [imageInfo, setImageInfo] = useState(null);
    const [stats, setStats] = useState({ total: 0, stego: 0, clean: 0 });

    useEffect(() => {
        loadModels();
        const savedHistory = localStorage.getItem('stego_history');
        if (savedHistory) {
            const parsed = JSON.parse(savedHistory);
            setHistory(parsed);
            updateStats(parsed);
        }
    }, []);

    const updateStats = (historyData) => {
        const total = historyData.length;
        const stego = historyData.filter(h => h.prediction === 'stego').length;
        const clean = total - stego;
        setStats({ total, stego, clean });
    };

    const loadModels = async () => {
        try {
            const data = await getModels();
            setModels(data);
            if (data.length > 0) setSelectedModel(data[0]);
        } catch (error) {
            console.error("Failed to load models", error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreview(url);
            setResult(null);

            const img = new Image();
            img.onload = () => {
                setImageInfo({
                    width: img.width,
                    height: img.height,
                    size: selectedFile.size,
                    type: selectedFile.type,
                    name: selectedFile.name
                });
            };
            img.src = url;
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const startTime = Date.now();
            const data = await predictImage(file, selectedModel);
            const duration = Date.now() - startTime;

            const enrichedData = {
                ...data,
                duration: duration,
                filename: file.name,
                timestamp: new Date().toLocaleString('vi-VN'),
                imageSize: imageInfo.size,
                imageDimensions: `${imageInfo.width}×${imageInfo.height}`
            };

            setResult(enrichedData);

            const updatedHistory = [enrichedData, ...history].slice(0, 50);
            setHistory(updatedHistory);
            updateStats(updatedHistory);
            localStorage.setItem('stego_history', JSON.stringify(updatedHistory));

        } catch (error) {
            alert("Phân tích thất bại: " + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    const deleteHistoryItem = (index) => {
        const updatedHistory = history.filter((_, i) => i !== index);
        setHistory(updatedHistory);
        updateStats(updatedHistory);
        localStorage.setItem('stego_history', JSON.stringify(updatedHistory));
    };

    const clearAllHistory = () => {
        if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử?')) {
            setHistory([]);
            setStats({ total: 0, stego: 0, clean: 0 });
            localStorage.removeItem('stego_history');
        }
    };

    const getRiskLevel = (confidence, isStego) => {
        if (!isStego) return { level: 'An toàn', color: 'green', icon: CheckCircle };
        if (confidence > 0.9) return { level: 'Rất cao', color: 'red', icon: AlertTriangle };
        if (confidence > 0.7) return { level: 'Cao', color: 'orange', icon: Info };
        return { level: 'Trung bình', color: 'yellow', icon: Info };
    };

    const formatBytes = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const formatModelName = (modelFileName) => {
        const name = modelFileName.replace('model_', '').replace('.keras', '');
        const modelMap = {
            'Baseline_CNN': 'Baseline CNN',
            'MobileNetV2_HPF_Enabled': 'MobileNetV2 (HPF Enabled)',
            'MobileNetV2_HPF_Disabled': 'MobileNetV2 (HPF Disabled)',
            'ResNet50_HPF_Enabled': 'ResNet50 (HPF Enabled)',
            'VGG16_HPF_Enabled': 'VGG16 (HPF Enabled)'
        };
        return modelMap[name] || name;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Steganalysis <span className="text-indigo-600">Pro</span>
                                </h1>
                                <p className="text-xs text-gray-500">Deep Learning Steganography Detection</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="hidden md:flex items-center space-x-3 mr-4">
                                <div className="text-center px-3 py-1 bg-gray-50 rounded-lg">
                                    <div className="text-xs text-gray-500">Tổng</div>
                                    <div className="text-sm font-bold text-gray-900">{stats.total}</div>
                                </div>
                                <div className="text-center px-3 py-1 bg-red-50 rounded-lg">
                                    <div className="text-xs text-red-600">Stego</div>
                                    <div className="text-sm font-bold text-red-700">{stats.stego}</div>
                                </div>
                                <div className="text-center px-3 py-1 bg-green-50 rounded-lg">
                                    <div className="text-xs text-green-600">Clean</div>
                                    <div className="text-sm font-bold text-green-700">{stats.clean}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowHistory(true)}
                                className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                <History className="w-4 h-4 mr-2" />
                                Lịch sử ({history.length})
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sidebar History */}
            <div className={clsx(
                "fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-hidden",
                showHistory ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-bold text-white flex items-center">
                                <History className="w-5 h-5 mr-2" /> Lịch sử ({history.length})
                            </h2>
                            <button onClick={() => setShowHistory(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>
                        {history.length > 0 && (
                            <button
                                onClick={clearAllHistory}
                                className="w-full flex items-center justify-center px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Xóa tất cả
                            </button>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {history.map((item, idx) => (
                            <div key={idx} className="group p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all bg-white relative">
                                <button
                                    onClick={() => deleteHistoryItem(idx)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    title="Xóa"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                                <div className="flex justify-between items-start mb-2 pr-6">
                                    <span className={clsx(
                                        "px-2 py-0.5 rounded text-xs font-bold uppercase",
                                        item.prediction === 'stego' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                    )}>
                                        {item.prediction === 'stego' ? 'STEGO' : 'CLEAN'}
                                    </span>
                                    <span className="text-xs text-gray-500">{item.timestamp}</span>
                                </div>
                                <p className="text-sm font-medium text-gray-700 truncate mb-1" title={item.filename}>{item.filename}</p>
                                <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                                    <span>Tin cậy: <strong>{(item.confidence * 100).toFixed(1)}%</strong></span>
                                    <span className="text-gray-400">{item.imageDimensions}</span>
                                </div>
                                {item.duration && (
                                    <div className="text-xs text-gray-500">
                                        Thời gian: {item.duration}ms
                                    </div>
                                )}
                            </div>
                        ))}
                        {history.length === 0 && (
                            <div className="text-center py-12">
                                <Database className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-400">Chưa có lịch sử phân tích</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* Left: Upload & Config */}
                        <div className="lg:col-span-7 space-y-4">
                            {/* Config */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                    <Settings className="w-4 h-4 mr-2 text-indigo-600" /> Cấu hình phân tích
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Model AI</label>
                                        <select
                                            value={selectedModel}
                                            onChange={(e) => setSelectedModel(e.target.value)}
                                            className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            {models.map(m => <option key={m} value={m}>{formatModelName(m)}</option>)}
                                            {models.length === 0 && <option>Đang tải...</option>}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Trạng thái hệ thống</label>
                                        <div className="flex items-center h-10 px-3 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                            <span className="text-sm font-medium text-green-700">Sẵn sàng</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Upload */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                <div
                                    className={clsx(
                                        "border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer",
                                        file ? "border-indigo-300 bg-indigo-50/30" : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                                    )}
                                    onClick={() => document.getElementById('file-upload').click()}
                                >
                                    {preview ? (
                                        <div className="relative">
                                            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setResult(null); setImageInfo(null); }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <h4 className="text-base font-semibold text-gray-800 mb-1">Tải ảnh lên để phân tích</h4>
                                            <p className="text-sm text-gray-500">Hỗ trợ JPEG, PNG (Max 10MB)</p>
                                        </div>
                                    )}
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>

                                {imageInfo && (
                                    <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                                        <div className="bg-gray-50 p-2 rounded text-center">
                                            <div className="text-gray-500 mb-1">Chiều rộng</div>
                                            <div className="font-semibold text-gray-700">{imageInfo.width}px</div>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded text-center">
                                            <div className="text-gray-500 mb-1">Chiều cao</div>
                                            <div className="font-semibold text-gray-700">{imageInfo.height}px</div>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded text-center">
                                            <div className="text-gray-500 mb-1">Dung lượng</div>
                                            <div className="font-semibold text-gray-700">{formatBytes(imageInfo.size)}</div>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded text-center">
                                            <div className="text-gray-500 mb-1">Định dạng</div>
                                            <div className="font-semibold text-gray-700">{imageInfo.type.split('/')[1].toUpperCase()}</div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleAnalyze}
                                    disabled={!file || loading}
                                    className={clsx(
                                        "w-full mt-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center",
                                        file && !loading
                                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02]"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    )}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Đang phân tích...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-5 h-5 mr-2" />
                                            Phân tích ngay
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Right: Results */}
                        <div className="lg:col-span-5">
                            {result ? (
                                <div className="space-y-4">
                                    {/* Main Result */}
                                    <div className={clsx(
                                        "rounded-xl shadow-lg border-2 p-4",
                                        result.prediction === 'stego'
                                            ? "bg-gradient-to-br from-red-50 to-orange-50 border-red-200"
                                            : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                                    )}>
                                        <div className="flex items-center justify-between mb-3">
                                            {React.createElement(getRiskLevel(result.confidence, result.prediction === 'stego').icon, {
                                                className: clsx(
                                                    "w-8 h-8",
                                                    result.prediction === 'stego' ? "text-red-600" : "text-green-600"
                                                )
                                            })}
                                            <span className={clsx(
                                                "px-3 py-1 rounded-full text-xs font-bold uppercase",
                                                result.prediction === 'stego' ? "bg-red-600 text-white" : "bg-green-600 text-white"
                                            )}>
                                                {result.prediction === 'stego' ? 'CÓ GIẤU TIN' : 'KHÔNG GIẤU TIN'}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{result.label}</h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            {result.prediction === 'stego'
                                                ? 'Ảnh này có khả năng chứa thông tin giấu tin'
                                                : 'Ảnh này không phát hiện dấu hiệu giấu tin'}
                                        </p>

                                        {/* Confidence Bar */}
                                        <div className="mb-3">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-gray-700">Độ tin cậy</span>
                                                <span className="font-bold text-gray-900">{(result.confidence * 100).toFixed(2)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    className={clsx(
                                                        "h-full rounded-full transition-all duration-500",
                                                        result.prediction === 'stego' ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-green-500 to-emerald-500"
                                                    )}
                                                    style={{ width: `${result.confidence * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Risk Level */}
                                        <div className="flex items-center justify-between p-2.5 bg-white/60 rounded-lg">
                                            <span className="text-sm font-medium text-gray-700">Mức độ rủi ro</span>
                                            <span className={clsx(
                                                "px-2 py-1 rounded text-xs font-bold",
                                                result.prediction === 'stego'
                                                    ? result.confidence > 0.9 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                                                    : "bg-green-100 text-green-700"
                                            )}>
                                                {getRiskLevel(result.confidence, result.prediction === 'stego').level}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Detailed Stats */}
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                            <BarChart3 className="w-4 h-4 mr-2 text-indigo-600" /> Chi tiết phân tích
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between p-2 bg-gray-50 rounded">
                                                <span className="text-gray-600">Raw Score</span>
                                                <span className="font-mono font-semibold text-gray-900">{result.raw_score.toFixed(6)}</span>
                                            </div>
                                            <div className="flex justify-between p-2 bg-gray-50 rounded">
                                                <span className="text-gray-600">Model sử dụng</span>
                                                <span className="font-semibold text-gray-900">{formatModelName(result.model)}</span>
                                            </div>
                                            <div className="flex justify-between p-2 bg-gray-50 rounded">
                                                <span className="text-gray-600">Thời gian xử lý</span>
                                                <span className="font-semibold text-gray-900">{result.duration}ms</span>
                                            </div>
                                            <div className="flex justify-between p-2 bg-gray-50 rounded">
                                                <span className="text-gray-600">Kích thước ảnh</span>
                                                <span className="font-semibold text-gray-900">{result.imageDimensions}</span>
                                            </div>
                                            <div className="flex justify-between p-2 bg-gray-50 rounded">
                                                <span className="text-gray-600">Dung lượng</span>
                                                <span className="font-semibold text-gray-900">{formatBytes(result.imageSize)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recommendation */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                                        <div className="flex items-start">
                                            <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                            <div className="text-sm text-blue-800">
                                                <p className="font-semibold mb-1">Khuyến nghị</p>
                                                <p className="text-blue-700 text-xs">
                                                    {result.prediction === 'stego'
                                                        ? 'Nên kiểm tra nguồn gốc ảnh và sử dụng công cụ trích xuất để phân tích sâu hơn. Độ tin cậy cao cho thấy có khả năng chứa dữ liệu ẩn.'
                                                        : 'Ảnh an toàn, không phát hiện dấu hiệu bất thường. Có thể sử dụng an tâm.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center h-full flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <FileImage className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có kết quả</h3>
                                    <p className="text-sm text-gray-500 mb-4">Vui lòng tải ảnh lên và nhấn phân tích</p>
                                    <div className="grid grid-cols-2 gap-3 w-full max-w-xs text-xs">
                                        <div className="bg-indigo-50 p-3 rounded-lg">
                                            <Activity className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                                            <div className="text-gray-600">Phân tích nhanh</div>
                                        </div>
                                        <div className="bg-purple-50 p-3 rounded-lg">
                                            <Shield className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                                            <div className="text-gray-600">Độ chính xác cao</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                        <div className="flex items-center space-x-2 mb-2 md:mb-0">
                            <Shield className="w-4 h-4 text-indigo-600" />
                            <span>© 2025 Steganalysis Pro - Powered by Deep Learning</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                                <Activity className="w-4 h-4 mr-1 text-green-600" />
                                Hệ thống hoạt động bình thường
                            </span>
                            <span className="text-gray-400">|</span>
                            <span>Version 1.0.0</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
