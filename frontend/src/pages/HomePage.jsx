/**
 * Home Page - Merged AI Detection + Forensics Analysis
 * Main analysis page combining all features
 */

import React, { useState, useEffect } from 'react';
import { Upload, Shield, Search, Play, Loader2, CheckCircle, AlertTriangle, Layers, Calendar, FileType, HardDrive, Maximize, Hash, Clock, Smartphone, Globe, Box, Lock, Code, ArrowLeft } from 'lucide-react';
import { getModels, predictImage } from '../api';
import { forensicsAPI } from '../services/forensics';
import MetadataViewer from '../components/Forensics/MetadataViewer';
import StringsViewer from '../components/Forensics/StringsViewer';
import VisualAnalysis from '../components/Forensics/VisualAnalysis';
import LSBExtractor from '../components/Forensics/LSBExtractor';
import SuperimposedAnalysis from '../components/Forensics/SuperimposedAnalysis';
import { Alert } from '../components/Forensics/shared/UIComponents';
import AIResultPanel from '../components/AIResultPanel';
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
                    name: selectedFile.name,
                    lastModified: selectedFile.lastModified
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
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <DetailRow
                                                icon={<FileType className="w-5 h-5 text-purple-600" />}
                                                label="Format"
                                                value={imageInfo.type.split('/')[1].toUpperCase()}
                                            />
                                            <DetailRow
                                                icon={<HardDrive className="w-5 h-5 text-blue-600" />}
                                                label="File Size"
                                                value={`${(imageInfo.size / 1024).toFixed(2)} KB`}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <DetailRow
                                                icon={<Maximize className="w-5 h-5 text-green-600" />}
                                                label="Dimensions"
                                                value={`${imageInfo.width} × ${imageInfo.height}`}
                                            />
                                            <DetailRow
                                                icon={<Hash className="w-5 h-5 text-orange-600" />}
                                                label="Aspect Ratio"
                                                value={`${(imageInfo.width / imageInfo.height).toFixed(2)}:1`}
                                            />
                                        </div>
                                        <DetailRow
                                            icon={<Clock className="w-5 h-5 text-pink-600" />}
                                            label="Last Modified"
                                            value={new Date(imageInfo.lastModified || Date.now()).toLocaleString()}
                                            fullWidth
                                        />
                                        <DetailRow
                                            icon={<Shield className="w-5 h-5 text-cyan-600" />}
                                            label="Security Check"
                                            value="Ready for Scan"
                                            fullWidth
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
                                <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg p-6 border border-gray-200 h-full flex flex-col items-center justify-center">
                                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                        <Box className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h4 className="font-semibold text-gray-600 mb-1">Image Preview</h4>
                                    <p className="text-sm text-gray-400 text-center max-w-[200px]">
                                        Selected image details will appear here
                                    </p>
                                    <div className="mt-4 px-3 py-2 bg-blue-50 rounded-lg flex items-center text-xs text-blue-600">
                                        <ArrowLeft className="w-4 h-4 mr-2 animate-bounce-x" />
                                        <span className="font-medium">Use the upload area on the left</span>
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

                        {/* AI Results - Professional Panel */}
                        {aiResult && (
                            <AIResultPanel
                                result={aiResult}
                                modelName={formatModelName(selectedModel)}
                                onScrollToForensics={() => {
                                    document.getElementById('forensics')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            />
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
                            {!forensicsResults[activeForensicsTab] &&
                                activeForensicsTab !== 'lsb' &&
                                activeForensicsTab !== 'superimposed' && (
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
function DetailRow({ icon, label, value, fullWidth }) {
    return (
        <div className={clsx(
            "flex items-center p-3 rounded-lg bg-white/60 hover:bg-white transition-all shadow-sm border border-blue-100",
            fullWidth ? "w-full" : ""
        )}>
            <div className="mr-3 p-2 bg-gray-50 rounded-full">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider block">{label}</span>
                <p className="text-sm font-bold text-gray-900 truncate" title={value}>{value}</p>
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
