/**
 * Forensics Layout Component
 * Main container for all forensics analysis modules
 */

import React, { useState } from 'react';
import { Shield, FileSearch, Layers, Binary, Upload, Play, Loader2 } from 'lucide-react';
import { forensicsAPI } from '../../services/forensics';
import MetadataViewer from './MetadataViewer';
import StringsViewer from './StringsViewer';
import VisualAnalysis from './VisualAnalysis';
import LSBExtractor from './LSBExtractor';
import { Alert } from './shared/UIComponents';
import clsx from 'clsx';

export default function ForensicsLayout() {
    const [activeTab, setActiveTab] = useState('metadata');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Results for each module
    const [results, setResults] = useState({
        metadata: null,
        strings: null,
        visual: null,
        lsb: null
    });

    const tabs = [
        { id: 'metadata', label: 'Siêu dữ liệu', icon: FileSearch },
        { id: 'strings', label: 'Chuỗi ký tự', icon: FileSearch },
        { id: 'visual', label: 'Phân tích trực quan', icon: Layers },
        { id: 'lsb', label: 'Trích xuất LSB', icon: Binary }
    ];

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            // Reset results when new file is uploaded
            setResults({ metadata: null, strings: null, visual: null, lsb: null });
        }
    };

    const analyzeModule = async (module) => {
        if (!file) {
            setError('Vui lòng tải ảnh lên trước');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let response;
            switch (module) {
                case 'metadata':
                    response = await forensicsAPI.extractMetadata(file);
                    break;
                case 'strings':
                    response = await forensicsAPI.extractStrings(file);
                    break;
                case 'visual':
                    response = await forensicsAPI.analyzeVisual(file);
                    break;
                default:
                    return;
            }

            setResults(prev => ({ ...prev, [module]: response.data }));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const analyzeAll = async () => {
        if (!file) {
            setError('Vui lòng tải ảnh lên trước');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await forensicsAPI.analyzeAll(file, false);
            setResults({
                metadata: response.metadata,
                strings: response.strings,
                visual: response.visual,
                lsb: response.lsb
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <Shield className="w-8 h-8 text-blue-600 mr-3" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Phân tích điều tra số
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Phân tích điều tra hình ảnh và phát hiện giấu tin toàn diện
                                </p>
                            </div>
                        </div>

                        {file && (
                            <button
                                onClick={analyzeAll}
                                disabled={loading}
                                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                ) : (
                                    <Play className="w-5 h-5 mr-2" />
                                )}
                                Phân tích tất cả
                            </button>
                        )}
                    </div>

                    {/* File Upload */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Upload Area */}
                        <div>
                            <label className="block">
                                <div className={clsx(
                                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
                                    file
                                        ? "border-green-300 bg-green-50"
                                        : "border-gray-300 hover:border-indigo-400 hover:bg-blue-50"
                                )}>
                                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                    <p className="text-sm text-gray-600 mb-2">
                                        {file ? file.name : 'Nhấp để tải ảnh lên'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPEG, BMP, GIF (Tối đa 20MB)
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            </label>
                        </div>

                        {/* Image Preview */}
                        {preview && (
                            <div className="bg-gray-100 rounded-lg p-4">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-48 object-contain rounded"
                                />
                                <p className="text-xs text-gray-600 text-center mt-2">
                                    {(file.size / 1024).toFixed(1)} KB • {file.type}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert severity="error" title="Lỗi phân tích">
                        {error}
                    </Alert>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Tab Headers */}
                    <div className="border-b border-gray-200 bg-gray-50">
                        <nav className="flex">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={clsx(
                                        "flex-1 flex items-center justify-center px-6 py-4 font-medium text-sm transition-all border-b-2",
                                        activeTab === tab.id
                                            ? "border-blue-600 text-blue-600 bg-white"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    <tab.icon className="w-5 h-5 mr-2" />
                                    {tab.label}
                                    {results[tab.id] && (
                                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                            ✓
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {loading ? (
                            <LoadingState />
                        ) : !file ? (
                            <EmptyState />
                        ) : (
                            <>
                                {/* Quick Analyze Button for current tab */}
                                {!results[activeTab] && activeTab !== 'lsb' && (
                                    <div className="mb-6 text-center">
                                        <button
                                            onClick={() => analyzeModule(activeTab)}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center"
                                        >
                                            <Play className="w-5 h-5 mr-2" />
                                            Phân tích {tabs.find(t => t.id === activeTab)?.label}
                                        </button>
                                    </div>
                                )}

                                {/* Module Content */}
                                {activeTab === 'metadata' && (
                                    <MetadataViewer data={results.metadata} />
                                )}
                                {activeTab === 'strings' && (
                                    <StringsViewer data={results.strings} />
                                )}
                                {activeTab === 'visual' && (
                                    <VisualAnalysis data={results.visual} />
                                )}
                                {activeTab === 'lsb' && (
                                    <LSBExtractor
                                        file={file}
                                        onExtract={(data) => setResults(prev => ({ ...prev, lsb: data }))}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="text-center py-16">
            <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Đang phân tích ảnh...</p>
            <p className="text-sm text-gray-500 mt-2">Việc này có thể mất vài phút</p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="text-center py-16 text-gray-500">
            <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Chưa tải ảnh lên
            </h3>
            <p className="text-sm">
                Tải ảnh lên để bắt đầu phân tích điều tra số
            </p>
        </div>
    );
}
