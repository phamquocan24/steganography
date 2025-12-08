/**
 * Home Page - Merged AI Detection + Forensics Analysis
 * Main analysis page combining all features
 */

import React, { useState, useEffect } from 'react';
import { Upload, Shield, Search, Play, Loader2, CheckCircle, AlertTriangle, Layers } from 'lucide-react';
import { getModels, predictImage } from '../api';
import { forensicsAPI } from '../services/forensics';
import MetadataViewer from '../components/Forensics/MetadataViewer';
import StringsViewer from '../components/Forensics/StringsViewer';
import VisualAnalysis from '../components/Forensics/VisualAnalysis';
import LSBExtractor from '../components/Forensics/LSBExtractor';
import SuperimposedAnalysis from '../components/Forensics/SuperimposedAnalysis';
import { Alert } from '../components/Forensics/shared/UIComponents';
import clsx from 'clsx';

export default function HomePage({ addToast, onUpdateHistory }) {
    // AI Detection states
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [aiResult, setAiResult] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);

    // Forensics states
    const [forensicsResults, setForensicsResults] = useState({
        metadata: null,
        strings: null,
        visual: null,
        lsb: null,
        superimposed: null
    });
    const [forensicsLoading, setForensicsLoading] = useState(false);
    const [activeForensicsTab, setActiveForensicsTab] = useState('metadata');

    // Shared states
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [imageInfo, setImageInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadModels();
    }, []);

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
            setAiResult(null);
            setForensicsResults({ metadata: null, strings: null, visual: null, lsb: null, superimposed: null });
            setError(null);

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

            addToast(`Uploaded: ${selectedFile.name}`, 'info');
        }
    };

    const handleAIAnalysis = async () => {
        if (!file) return;
        setAiLoading(true);
        setError(null);

        try {
            const startTime = Date.now();
            const data = await predictImage(file, selectedModel);
            const duration = Date.now() - startTime;

            const enrichedData = {
                ...data,
                duration,
                filename: file.name,
                timestamp: new Date().toLocaleString('vi-VN'),
                imageSize: imageInfo.size,
                imageDimensions: `${imageInfo.width}×${imageInfo.height}`,
                model: selectedModel
            };

            setAiResult(enrichedData);

            // Save to history
            if (onUpdateHistory) {
                onUpdateHistory(enrichedData);
            }

            addToast(
                `AI Analysis: ${data.prediction === 'stego' ? 'Stego Detected!' : 'Clean Image'}`,
                data.prediction === 'stego' ? 'warning' : 'success'
            );
        } catch (error) {
            setError(error.message);
            addToast("AI Analysis failed: " + error.message, 'error');
        } finally {
            setAiLoading(false);
        }
    };

    const handleForensicsAnalysis = async (module) => {
        if (!file) {
            setError('Please upload an image first');
            return;
        }

        setForensicsLoading(true);
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

            // APIs already return data, not axios response
            setForensicsResults(prev => ({ ...prev, [module]: response }));
            addToast(`${module.charAt(0).toUpperCase() + module.slice(1)} analysis completed`, 'success');
        } catch (err) {
            setError(err.message);
            addToast(`Forensics analysis failed: ${err.message}`, 'error');
        } finally {
            setForensicsLoading(false);
        }
    };

    const handleAnalyzeAll = async () => {
        if (!file) {
            setError('Please upload an image first');
            return;
        }

        setForensicsLoading(true);
        setError(null);

        try {
            const response = await forensicsAPI.analyzeAll(file, false);
            setForensicsResults({
                metadata: response.metadata,
                strings: response.strings,
                visual: response.visual,
                lsb: response.lsb
            });
            addToast('Complete forensics analysis finished!', 'success');
        } catch (err) {
            setError(err.message);
            addToast(`Analysis failed: ${err.message}`, 'error');
        } finally {
            setForensicsLoading(false);
        }
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

    const forensicsTabs = [
        { id: 'metadata', label: 'Metadata', icon: Shield },
        { id: 'strings', label: 'Strings', icon: Search },
        { id: 'visual', label: 'Visual', icon: Search },
        { id: 'superimposed', label: 'Superimposed', icon: Layers },
        { id: 'lsb', label: 'LSB', icon: Search }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Upload Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Image for Analysis</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Left: Upload + Preview */}
                        <div className="space-y-4">
                            {!preview ? (
                                /* Upload Area */
                                <label className="block cursor-pointer">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all">
                                        <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                        <p className="text-sm text-gray-600 mb-2">
                                            Click to upload image
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPEG, BMP, GIF (Max 20MB)
                                        </p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                </label>
                            ) : (
                                /* Preview with Remove Button */
                                <div className="relative bg-gray-100 rounded-lg p-4">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-64 object-contain rounded"
                                    />
                                    {/* Red X Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setFile(null);
                                            setPreview(null);
                                            setImageInfo(null);
                                            setAiResult(null);
                                            setForensicsResults({ metadata: null, strings: null, visual: null, lsb: null, superimposed: null });
                                        }}
                                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                                        title="Remove image"
                                    >
                                        <span className="text-lg font-bold">×</span>
                                    </button>
                                    <p className="text-xs text-gray-600 text-center mt-3">
                                        Click the red button to change image
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right: Detailed Image Information */}
                        <div>
                            {imageInfo ? (
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border-2 border-blue-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                        <Shield className="w-5 h-5 mr-2 text-blue-600" />
                                        Image Details
                                    </h3>
                                    <div className="space-y-3">
                                        <DetailRow
                                            icon="📄"
                                            label="Filename"
                                            value={imageInfo.name}
                                            highlight={true}
                                        />
                                        <DetailRow
                                            icon="🎨"
                                            label="Format"
                                            value={imageInfo.type.split('/')[1].toUpperCase()}
                                        />
                                        <DetailRow
                                            icon="📐"
                                            label="Dimensions"
                                            value={`${imageInfo.width} × ${imageInfo.height} pixels`}
                                        />
                                        <DetailRow
                                            icon="💾"
                                            label="File Size"
                                            value={`${(imageInfo.size / 1024).toFixed(2)} KB (${imageInfo.size.toLocaleString()} bytes)`}
                                        />
                                        <DetailRow
                                            icon="📊"
                                            label="Aspect Ratio"
                                            value={`${(imageInfo.width / imageInfo.height).toFixed(2)}:1`}
                                        />
                                        <DetailRow
                                            icon="🕒"
                                            label="Upload Time"
                                            value={new Date().toLocaleString('vi-VN')}
                                        />
                                        <div className="pt-3 mt-3 border-t border-blue-200">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-700 font-medium">Status:</span>
                                                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-bold flex items-center">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Ready for Analysis
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 h-full flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        <Upload className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p className="font-medium">No image uploaded</p>
                                        <p className="text-sm mt-1">Upload an image to see details</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {error && (
                    <Alert severity="error" title="Error">
                        {error}
                    </Alert>
                )}

                {/* AI Detection Section */}
                <div id="ai-detection"></div>
                {file && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                <Shield className="w-6 h-6 mr-2 text-blue-600" />
                                AI Steganography Detection
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Model
                                </label>
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    disabled={aiLoading}
                                >
                                    {models.map(model => (
                                        <option key={model} value={model}>
                                            {formatModelName(model)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={handleAIAnalysis}
                                    disabled={aiLoading || !file}
                                    className="w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
                                >
                                    {aiLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5 mr-2" />
                                            Run AI Detection
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* AI Results */}
                        {aiResult && (
                            <div className={clsx(
                                "rounded-lg p-6 border-2",
                                aiResult.prediction === 'stego'
                                    ? "bg-red-50 border-red-200"
                                    : "bg-green-50 border-green-200"
                            )}>
                                <div className="flex items-center justify-between mb-4">
                                    {aiResult.prediction === 'stego' ? (
                                        <AlertTriangle className="w-8 h-8 text-red-600" />
                                    ) : (
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    )}
                                    <span className={clsx(
                                        "px-4 py-2 rounded-full font-bold text-lg",
                                        aiResult.prediction === 'stego'
                                            ? "bg-red-600 text-white"
                                            : "bg-green-600 text-white"
                                    )}>
                                        {aiResult.prediction === 'stego' ? 'STEGO DETECTED' : 'CLEAN IMAGE'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Confidence:</span>
                                        <span className="font-bold ml-2">{(aiResult.confidence * 100).toFixed(2)}%</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Model:</span>
                                        <span className="font-bold ml-2">{formatModelName(selectedModel)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Analysis Time:</span>
                                        <span className="font-bold ml-2">{aiResult.duration}ms</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Timestamp:</span>
                                        <span className="font-bold ml-2">{aiResult.timestamp}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Forensics Section */}
                <div id="forensics"></div>
                {file && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <Search className="w-6 h-6 mr-2 text-blue-600" />
                                    Forensics Analysis
                                </h2>
                                <button
                                    onClick={handleAnalyzeAll}
                                    disabled={forensicsLoading}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-medium flex items-center"
                                >
                                    {forensicsLoading ? (
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    ) : (
                                        <Play className="w-5 h-5 mr-2" />
                                    )}
                                    Analyze All
                                </button>
                            </div>
                        </div>

                        {/* Forensics Tabs */}
                        <div className="border-b border-gray-200 bg-gray-50">
                            <nav className="flex">
                                {forensicsTabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveForensicsTab(tab.id)}
                                        className={clsx(
                                            "flex-1 flex items-center justify-center px-6 py-4 font-medium text-sm transition-all border-b-2",
                                            activeForensicsTab === tab.id
                                                ? "border-blue-600 text-blue-600 bg-white"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                        )}
                                    >
                                        <tab.icon className="w-5 h-5 mr-2" />
                                        {tab.label}
                                        {forensicsResults[tab.id] && (
                                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                                ✓
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Forensics Content */}
                        <div className="p-6">
                            {!forensicsResults[activeForensicsTab] && activeForensicsTab !== 'lsb' && (
                                <div className="text-center py-12">
                                    <button
                                        onClick={() => handleForensicsAnalysis(activeForensicsTab)}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center"
                                        disabled={forensicsLoading}
                                    >
                                        <Play className="w-5 h-5 mr-2" />
                                        Analyze {forensicsTabs.find(t => t.id === activeForensicsTab)?.label}
                                    </button>
                                </div>
                            )}

                            {activeForensicsTab === 'metadata' && <MetadataViewer data={forensicsResults.metadata} />}
                            {activeForensicsTab === 'strings' && <StringsViewer data={forensicsResults.strings} />}
                            {activeForensicsTab === 'visual' && <VisualAnalysis data={forensicsResults.visual} />}
                            {activeForensicsTab === 'superimposed' && (
                                <SuperimposedAnalysis
                                    file={file}
                                    addToast={addToast}
                                />
                            )}
                            {activeForensicsTab === 'lsb' && (
                                <LSBExtractor
                                    file={file}
                                    onExtract={(data) => setForensicsResults(prev => ({ ...prev, lsb: data }))}
                                    addToast={addToast}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!file && (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Image Uploaded</h3>
                        <p className="text-gray-500">Upload an image to start AI detection and forensics analysis</p>
                    </div>
                )}

                {/* Hidden anchor points for navigation */}
                <div id="metadata" className="invisible h-0"></div>
                <div id="strings" className="invisible h-0"></div>
                <div id="visual" className="invisible h-0"></div>
                <div id="superimposed" className="invisible h-0"></div>
                <div id="lsb" className="invisible h-0"></div>
            </div>
        </div>
    );
}

// Helper Component for Image Info
function DetailRow({ icon, label, value, highlight }) {
    return (
        <div className={clsx(
            "flex items-start p-3 rounded-lg transition-all",
            highlight ? "bg-white shadow-sm" : "hover:bg-white/50"
        )}>
            <span className="text-xl mr-3 flex-shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
                <span className="text-xs text-gray-600 font-medium block mb-1">{label}</span>
                <p className={clsx(
                    "text-sm font-semibold truncate",
                    highlight ? "text-blue-900" : "text-gray-900"
                )} title={value}>{value}</p>
            </div>
        </div>
    );
}

// Legacy InfoRow for backward compatibility
function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-start">
            <span className="mr-2">{icon}</span>
            <div className="flex-1 min-w-0">
                <span className="text-gray-600">{label}:</span>
                <p className="font-medium text-gray-900 truncate">{value}</p>
            </div>
        </div>
    );
}
