/**
 * Superimposed Analysis Component
 * Overlays color channels and bit planes to reveal hidden patterns
 */

import React, { useState } from 'react';
import { Layers, Play, Zap, Image as ImageIcon, Info } from 'lucide-react';
import { Alert } from './shared/UIComponents';
import { forensicsAPI } from '../../services/forensics';
import clsx from 'clsx';

export default function SuperimposedAnalysis({ file, addToast }) {
    const [config, setConfig] = useState({
        mode: 'both',
        channels: ['R', 'G', 'B'],
        bitPlanes: [0, 1, 2],
        blendMode: 'average'
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleAnalyze = async () => {
        if (!file) {
            setError('Please upload an image first');
            addToast?.('Please upload an image first', 'error');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await forensicsAPI.analyzeSuperimposed(file, config);
            setResult(response.data);
            addToast?.('Superimposed analysis completed successfully!', 'success');
        } catch (err) {
            setError(err.message);
            addToast?.(`Superimposed analysis failed: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleChannel = (channel) => {
        setConfig(prev => ({
            ...prev,
            channels: prev.channels.includes(channel)
                ? prev.channels.filter(c => c !== channel)
                : [...prev.channels, channel]
        }));
    };

    const toggleBitPlane = (bit) => {
        setConfig(prev => ({
            ...prev,
            bitPlanes: prev.bitPlanes.includes(bit)
                ? prev.bitPlanes.filter(b => b !== bit)
                : [...prev.bitPlanes, bit].sort()
        }));
    };

    return (
        <div className="space-y-6">
            {/* Info Banner */}
            <Alert severity="info" title="What is Superimposed Analysis?">
                <p className="text-sm">
                    Superimposed analysis overlays different color channels and bit planes to reveal hidden
                    patterns that are invisible when viewed separately. Perfect for detecting watermarks,
                    hidden messages, and steganography across multiple layers.
                </p>
            </Alert>

            {/* Configuration Panel */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Layers className="w-5 h-5 mr-2 text-blue-600" />
                    Analysis Configuration
                </h3>

                <div className="space-y-6">
                    {/* Mode Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Analysis Mode
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { value: 'channels', label: 'Channels Only' },
                                { value: 'bitplanes', label: 'Bit Planes Only' },
                                { value: 'both', label: 'Both (Recommended)' }
                            ].map(mode => (
                                <button
                                    key={mode.value}
                                    onClick={() => setConfig({ ...config, mode: mode.value })}
                                    className={clsx(
                                        "px-4 py-2 rounded-lg font-medium transition-all text-sm",
                                        config.mode === mode.value
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    )}
                                >
                                    {mode.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Channel Selection */}
                    {(config.mode === 'channels' || config.mode === 'both') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color Channels to Superimpose
                            </label>
                            <div className="flex space-x-2">
                                {['R', 'G', 'B'].map(channel => (
                                    <button
                                        key={channel}
                                        onClick={() => toggleChannel(channel)}
                                        className={clsx(
                                            "flex-1 px-4 py-2 rounded-lg font-medium transition-all",
                                            config.channels.includes(channel)
                                                ? channel === 'R' ? "bg-red-600 text-white"
                                                    : channel === 'G' ? "bg-green-600 text-white"
                                                        : "bg-blue-600 text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        )}
                                    >
                                        {channel}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bit Plane Selection */}
                    {(config.mode === 'bitplanes' || config.mode === 'both') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bit Planes (0 = LSB, 7 = MSB)
                            </label>
                            <div className="grid grid-cols-8 gap-1">
                                {[0, 1, 2, 3, 4, 5, 6, 7].map(bit => (
                                    <button
                                        key={bit}
                                        onClick={() => toggleBitPlane(bit)}
                                        className={clsx(
                                            "p-2 rounded font-medium transition-all text-sm",
                                            config.bitPlanes.includes(bit)
                                                ? bit <= 2 ? "bg-red-600 text-white"
                                                    : "bg-blue-600 text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        )}
                                    >
                                        {bit}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Recommended: 0-2 (LSB) for hidden data detection
                            </p>
                        </div>
                    )}

                    {/* Blend Mode */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Blend Mode
                        </label>
                        <select
                            value={config.blendMode}
                            onChange={(e) => setConfig({ ...config, blendMode: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="average">Average (Recommended)</option>
                            <option value="max">Maximum</option>
                            <option value="xor">XOR (Advanced)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            {config.blendMode === 'average' && 'Averages pixel values - best for general use'}
                            {config.blendMode === 'max' && 'Takes maximum value - enhances bright patterns'}
                            {config.blendMode === 'xor' && 'Bitwise XOR - reveals differences'}
                        </p>
                    </div>

                    {/* Analyze Button */}
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !file || config.channels.length === 0}
                        className={clsx(
                            "w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center",
                            loading || !file || config.channels.length === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg"
                        )}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5 mr-2" />
                                Analyze Superimposed
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <Alert severity="error" title="Analysis Failed">
                    {error}
                </Alert>
            )}

            {/* Results */}
            {result && <SuperimposedResults result={result} onSelectImage={setSelectedImage} />}

            {/* Image Modal */}
            {selectedImage && (
                <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
            )}
        </div>
    );
}

function SuperimposedResults({ result, onSelectImage }) {
    const images = result.superimposed_images || {};
    const imageKeys = Object.keys(images);

    if (imageKeys.length === 0) {
        return (
            <Alert severity="info">
                No superimposed images generated. Try adjusting your configuration.
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
                <div className="flex items-start">
                    <Info className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-blue-900 mb-2">Analysis Complete</h3>
                        <p className="text-sm text-blue-800 mb-2">
                            Mode: <strong>{result.mode}</strong> •
                            Dimensions: <strong>{result.original_dimensions}</strong> •
                            Images Generated: <strong>{imageKeys.length}</strong>
                        </p>
                        {result.channel_analysis && (
                            <p className="text-sm text-blue-800">
                                📌 {result.channel_analysis.recommendation}
                            </p>
                        )}
                        {result.bitplane_analysis && (
                            <p className="text-sm text-blue-800 mt-1">
                                📌 {result.bitplane_analysis.recommendation}
                            </p>
                        )}
                        {result.combined_analysis && (
                            <p className="text-sm text-blue-800 mt-1">
                                📌 {result.combined_analysis.recommendation}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Superimposed Images ({imageKeys.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imageKeys.map(key => (
                        <div
                            key={key}
                            onClick={() => onSelectImage({ key, data: images[key] })}
                            className="cursor-pointer group"
                        >
                            <div className="bg-gray-100 rounded-lg p-2 mb-2 hover:bg-gray-200 transition-colors">
                                <img
                                    src={images[key]}
                                    alt={key}
                                    className="w-full h-32 object-contain"
                                />
                            </div>
                            <p className="text-xs text-gray-600 font-medium truncate group-hover:text-blue-600">
                                {formatImageKey(key)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ImageModal({ image, onClose }) {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="max-w-4xl w-full bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">{formatImageKey(image.key)}</h3>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
                <div className="p-4 bg-gray-50">
                    <img
                        src={image.data}
                        alt={image.key}
                        className="w-full h-auto max-h-[70vh] object-contain"
                    />
                </div>
            </div>
        </div>
    );
}

function formatImageKey(key) {
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/Rgb/g, 'RGB')
        .replace(/Lsb/g, 'LSB')
        .replace(/Msb/g, 'MSB');
}
