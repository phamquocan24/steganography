/**
 * LSB Extractor Component
 * Interactive LSB extraction with configuration and results
 */

import React, { useState } from 'react';
import { Download, Settings, FileText, AlertCircle, CheckCircle, Zap, Activity } from 'lucide-react';
import { Alert, StatCard } from './shared/UIComponents';
import { forensicsAPI } from '../../services/forensics';
import clsx from 'clsx';

export default function LSBExtractor({ file, onExtract, addToast }) {
    const [config, setConfig] = useState({
        channels: 'RGB',
        bitOrder: 'LSB',
        bitsPerChannel: 1,
        maxBytes: 1024 * 1024 // 1MB
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleExtract = async () => {
        if (!file) {
            setError('Please upload an image first');
            addToast?.('Please upload an image first', 'error');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await forensicsAPI.extractLSB(file, config);
            setResult(result);
            onExtract?.(result);

            // Success toast
            const assessment = result.assessment;
            if (assessment.contains_hidden_data) {
                addToast?.(`LSB extraction succeeded! Confidence: ${assessment.confidence_score}`, 'success');
            } else {
                addToast?.('LSB extraction completed (low confidence)', 'info');
            }
        } catch (err) {
            setError(err.message);
            addToast?.(`LSB extraction failed: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Configuration Panel */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-blue-600" />
                    Extraction Configuration
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    {/* Channels */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Channels
                        </label>
                        <select
                            value={config.channels}
                            onChange={(e) => setConfig({ ...config, channels: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="RGB">RGB (All channels)</option>
                            <option value="R">Red only</option>
                            <option value="G">Green only</option>
                            <option value="B">Blue only</option>
                            <option value="RG">Red + Green</option>
                            <option value="RB">Red + Blue</option>
                            <option value="GB">Green + Blue</option>
                        </select>
                    </div>

                    {/* Bit Order */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bit Order
                        </label>
                        <select
                            value={config.bitOrder}
                            onChange={(e) => setConfig({ ...config, bitOrder: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="LSB">LSB (Least Significant Bit)</option>
                            <option value="MSB">MSB (Most Significant Bit)</option>
                        </select>
                    </div>

                    {/* Bits per Channel */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bits per Channel: {config.bitsPerChannel}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="8"
                            value={config.bitsPerChannel}
                            onChange={(e) => setConfig({ ...config, bitsPerChannel: parseInt(e.target.value) })}
                            className="w-full accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>1</span>
                            <span>4</span>
                            <span>8</span>
                        </div>
                    </div>

                    {/* Max Bytes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Bytes to Extract
                        </label>
                        <select
                            value={config.maxBytes}
                            onChange={(e) => setConfig({ ...config, maxBytes: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value={256 * 1024}>256 KB</option>
                            <option value={512 * 1024}>512 KB</option>
                            <option value={1024 * 1024}>1 MB</option>
                            <option value={5 * 1024 * 1024}>5 MB</option>
                            <option value={10 * 1024 * 1024}>10 MB</option>
                        </select>
                    </div>
                </div>

                {/* Extract Button */}
                <button
                    onClick={handleExtract}
                    disabled={loading || !file}
                    className={clsx(
                        "w-full mt-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center",
                        loading || !file
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:scale-[1.02]"
                    )}
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Extracting...
                        </>
                    ) : (
                        <>
                            <Zap className="w-5 h-5 mr-2" />
                            Extract LSB Data
                        </>
                    )}
                </button>
            </div>

            {/* Error */}
            {error && (
                <Alert severity="error" title="Extraction Failed">
                    {error}
                </Alert>
            )}

            {/* Results */}
            {result && <ExtractionResults result={result} />}
        </div>
    );
}

function ExtractionResults({ result }) {
    if (!result) return null;

    const assessment = result.assessment || {};
    const fileDetection = result.file_detection || {};
    const textAnalysis = result.text_analysis || {};
    const entropyAnalysis = result.entropy_analysis || {};
    const dataInfo = result.data_info || {};

    return (
        <div className="space-y-6">
            {/* Overall Assessment */}
            <div className={clsx(
                "rounded-lg border-2 p-6",
                assessment.contains_hidden_data
                    ? "bg-green-50 border-green-200"
                    : "bg-yellow-50 border-yellow-200"
            )}>
                <div className="flex items-center justify-between mb-4">
                    {assessment.contains_hidden_data ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                        <AlertCircle className="w-8 h-8 text-yellow-600" />
                    )}
                    <span className={clsx(
                        "px-4 py-2 rounded-full font-bold text-sm",
                        assessment.contains_hidden_data
                            ? "bg-green-600 text-white"
                            : "bg-yellow-600 text-white"
                    )}>
                        {assessment.likelihood}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {assessment.contains_hidden_data ? 'Hidden Data Detected!' : 'Low Confidence'}
                </h3>

                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Confidence Score</span>
                        <span className="font-bold">{assessment.confidence_score}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className={clsx(
                                "h-3 rounded-full transition-all",
                                assessment.confidence_score >= 60 ? "bg-green-600" : "bg-yellow-600"
                            )}
                            style={{ width: `${assessment.confidence_score}%` }}
                        />
                    </div>
                </div>

                {assessment.indicators.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Indicators:</h4>
                        <ul className="space-y-1">
                            {assessment.indicators.map((indicator, idx) => (
                                <li key={idx} className="flex items-start text-sm text-gray-700">
                                    <span className="text-green-600 mr-2">✓</span>
                                    {indicator}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Data Statistics - Row 1 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    icon={FileText}
                    label="Extracted Size"
                    value={(dataInfo.size_kb || 0) + ' KB'}
                />
                <StatCard
                    label="Entropy"
                    value={entropyAnalysis.normalized_entropy?.toFixed(3) || 'N/A'}
                    color={entropyAnalysis.is_high_entropy ? 'red' : 'green'}
                />
                <StatCard
                    label="Randomness"
                    value={entropyAnalysis.assessment?.split(' ')[0] || 'Unknown'}
                />
                <StatCard
                    label="Chi-Square"
                    value={entropyAnalysis.chi_square?.toFixed(1) || 'N/A'}
                    color={entropyAnalysis.is_random ? 'blue' : 'orange'}
                    subtitle={entropyAnalysis.is_random ? 'Random' : 'Patterned'}
                />
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Download Card */}
                {result.file_download?.available && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-gray-800 flex items-center">
                                    <Download className="w-5 h-5 mr-2 text-blue-600" />
                                    Extracted Data
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    {(result.file_download?.size_bytes / 1024).toFixed(2)} KB • {dataInfo.md5_hash?.slice(0, 8) || 'N/A'}...
                                </p>
                            </div>
                            <button
                                onClick={() => forensicsAPI.downloadFile(
                                    result.file_download?.file_id,
                                    result.file_download?.filename
                                )}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </button>
                        </div>
                    </div>
                )}

                {/* Serial Correlation Card */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold text-gray-800 flex items-center">
                                <Activity className="w-5 h-5 mr-2 text-purple-600" />
                                Serial Correlation
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                                Pattern detection score
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-purple-700">
                                {entropyAnalysis.serial_correlation?.toFixed(4) || 'N/A'}
                            </span>
                            <p className={clsx(
                                "text-xs font-medium",
                                Math.abs(entropyAnalysis.serial_correlation || 0) < 0.1
                                    ? "text-green-600"
                                    : "text-orange-600"
                            )}>
                                {Math.abs(entropyAnalysis.serial_correlation || 0) < 0.1
                                    ? '✓ No pattern detected'
                                    : '⚠ Pattern detected'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* File Detection */}
            {fileDetection.detected && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-blue-600" />
                        File Detection
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <InfoRow label="Type" value={fileDetection.type} />
                        <InfoRow label="MIME" value={fileDetection.mime} />
                        <InfoRow label="Extension" value={fileDetection.ext} />
                        <InfoRow label="Confidence" value={fileDetection.confidence} />
                    </div>
                </div>
            )}

            {/* Text Analysis */}
            {textAnalysis.is_text && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Decoded Text</h3>
                    <div className="bg-gray-50 rounded p-4 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                        {textAnalysis.best_encoding.full_text}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Encoding: {textAnalysis.best_encoding.encoding} •
                        Length: {textAnalysis.best_encoding.length} characters •
                        Confidence: {textAnalysis.best_encoding.confidence}
                    </p>
                </div>
            )}

            {/* Recommendations */}
            {assessment.recommendations && assessment.recommendations.length > 0 && (
                <Alert severity="info" title="Recommendations">
                    <ul className="list-disc list-inside space-y-1">
                        {assessment.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                        ))}
                    </ul>
                </Alert>
            )}

            {/* Raw Data Preview */}
            <details className="bg-white rounded-lg border border-gray-200 p-6">
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                    View Raw Data Preview
                </summary>
                <div className="mt-4 bg-gray-50 rounded p-4 font-mono text-xs overflow-x-auto">
                    {dataInfo.first_32_bytes_hex || 'N/A'}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <InfoRow label="MD5" value={dataInfo.md5_hash || 'N/A'} />
                    <InfoRow label="SHA256" value={dataInfo.sha256_hash || 'N/A'} />
                </div>
            </details>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div>
            <span className="text-gray-600">{label}:</span>{' '}
            <span className="font-semibold text-gray-900">{value}</span>
        </div>
    );
}
