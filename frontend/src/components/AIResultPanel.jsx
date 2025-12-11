/**
 * AI Detection Result Panel
 * --------------------------
 * Professional, detailed display of steganography detection results.
 * 
 * Features:
 * - Visual confidence meter
 * - Risk assessment
 * - Detailed probability breakdown
 * - Model information
 * - Actionable recommendations
 */

import React from 'react';
import clsx from 'clsx';
import {
    Shield,
    ShieldAlert,
    ShieldCheck,
    AlertTriangle,
    CheckCircle,
    Clock,
    Cpu,
    TrendingUp,
    Info,
    ChevronRight,
    Target,
    Activity,
    Zap,
    FileWarning,
    ThumbsUp,
    Eye
} from 'lucide-react';

// Confidence Level Definitions
const getConfidenceLevel = (confidence) => {
    if (confidence >= 0.95) return { level: 'Very High', color: 'emerald', description: 'Extremely confident prediction' };
    if (confidence >= 0.85) return { level: 'High', color: 'green', description: 'Highly reliable prediction' };
    if (confidence >= 0.70) return { level: 'Moderate', color: 'yellow', description: 'Reasonably confident prediction' };
    if (confidence >= 0.55) return { level: 'Low', color: 'orange', description: 'Prediction with some uncertainty' };
    return { level: 'Very Low', color: 'red', description: 'Low confidence, consider re-analysis' };
};

// Risk Assessment
const getRiskAssessment = (prediction, confidence) => {
    if (prediction === 'stego') {
        if (confidence >= 0.90) return { level: 'Critical', color: 'red', icon: ShieldAlert, message: 'High probability of hidden data detected' };
        if (confidence >= 0.70) return { level: 'High', color: 'orange', icon: AlertTriangle, message: 'Likely contains hidden information' };
        return { level: 'Medium', color: 'yellow', icon: FileWarning, message: 'Possible steganographic content' };
    } else {
        if (confidence >= 0.90) return { level: 'Safe', color: 'green', icon: ShieldCheck, message: 'Image appears clean and unmodified' };
        if (confidence >= 0.70) return { level: 'Likely Safe', color: 'emerald', icon: ThumbsUp, message: 'No obvious signs of hidden data' };
        return { level: 'Uncertain', color: 'yellow', icon: Eye, message: 'Manual inspection recommended' };
    }
};

// Confidence Meter Component
function ConfidenceMeter({ confidence, prediction }) {
    const percentage = (confidence * 100).toFixed(1);
    const confidenceInfo = getConfidenceLevel(confidence);

    const colorClasses = {
        emerald: 'from-emerald-500 to-emerald-600',
        green: 'from-green-500 to-green-600',
        yellow: 'from-yellow-500 to-yellow-600',
        orange: 'from-orange-500 to-orange-600',
        red: 'from-red-500 to-red-600'
    };

    return (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-blue-600" />
                    Confidence Score
                </h4>
                <span className={clsx(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    confidenceInfo.color === 'emerald' && "bg-emerald-100 text-emerald-700",
                    confidenceInfo.color === 'green' && "bg-green-100 text-green-700",
                    confidenceInfo.color === 'yellow' && "bg-yellow-100 text-yellow-700",
                    confidenceInfo.color === 'orange' && "bg-orange-100 text-orange-700",
                    confidenceInfo.color === 'red' && "bg-red-100 text-red-700"
                )}>
                    {confidenceInfo.level}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                    className={clsx(
                        "absolute inset-y-0 left-0 bg-gradient-to-r rounded-full transition-all duration-1000 ease-out",
                        colorClasses[confidenceInfo.color]
                    )}
                    style={{ width: `${percentage}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white drop-shadow-md">{percentage}%</span>
                </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">{confidenceInfo.description}</p>
        </div>
    );
}

// Probability Breakdown Component
function ProbabilityBreakdown({ stegoProb, cleanProb }) {
    return (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-800 flex items-center mb-4">
                <Activity className="w-4 h-4 mr-2 text-purple-600" />
                Probability Distribution
            </h4>

            <div className="space-y-4">
                {/* Stego Probability */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-red-700 flex items-center">
                            <ShieldAlert className="w-3 h-3 mr-1" />
                            Steganography
                        </span>
                        <span className="text-sm font-bold text-red-700">{(stegoProb * 100).toFixed(2)}%</span>
                    </div>
                    <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-700"
                            style={{ width: `${stegoProb * 100}%` }}
                        />
                    </div>
                </div>

                {/* Clean Probability */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-green-700 flex items-center">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Clean Image
                        </span>
                        <span className="text-sm font-bold text-green-700">{(cleanProb * 100).toFixed(2)}%</span>
                    </div>
                    <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700"
                            style={{ width: `${cleanProb * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                    <Info className="w-3 h-3 mr-1" />
                    Difference: {Math.abs((stegoProb - cleanProb) * 100).toFixed(2)}%
                </div>
            </div>
        </div>
    );
}

// Risk Assessment Card
function RiskAssessmentCard({ prediction, confidence }) {
    const risk = getRiskAssessment(prediction, confidence);
    const RiskIcon = risk.icon;

    const bgColors = {
        red: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
        orange: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200',
        yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
        green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
        emerald: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'
    };

    const iconColors = {
        red: 'text-red-600',
        orange: 'text-orange-600',
        yellow: 'text-yellow-600',
        green: 'text-green-600',
        emerald: 'text-emerald-600'
    };

    return (
        <div className={clsx("rounded-xl p-5 border-2", bgColors[risk.color])}>
            <div className="flex items-start space-x-4">
                <div className={clsx("p-3 rounded-full bg-white shadow-sm", iconColors[risk.color])}>
                    <RiskIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-lg">Risk Level: {risk.level}</h4>
                    <p className="text-gray-600 text-sm mt-1">{risk.message}</p>
                </div>
            </div>
        </div>
    );
}

// Technical Details Component
function TechnicalDetails({ modelName, duration, timestamp, imageInfo }) {
    const details = [
        { icon: Cpu, label: 'Model', value: modelName, color: 'blue' },
        { icon: Zap, label: 'Processing Time', value: `${duration}ms`, color: 'purple' },
        { icon: Clock, label: 'Analyzed At', value: timestamp, color: 'gray' }
    ];

    if (imageInfo) {
        details.push({ icon: Info, label: 'Image', value: imageInfo, color: 'cyan' });
    }

    return (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-700 text-sm mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Technical Details
            </h4>
            <div className="grid grid-cols-2 gap-3">
                {details.map((detail, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                        <detail.icon className={clsx("w-4 h-4", `text-${detail.color}-500`)} />
                        <span className="text-gray-500">{detail.label}:</span>
                        <span className="font-medium text-gray-800 truncate">{detail.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Recommendations Component
function Recommendations({ prediction, confidence }) {
    const recommendations = prediction === 'stego' ? [
        { text: 'Run LSB Extraction to attempt data recovery', priority: 'high' },
        { text: 'Analyze bit planes in Visual Analysis', priority: 'high' },
        { text: 'Check for embedded strings or patterns', priority: 'medium' },
        { text: 'Try different extraction parameters', priority: 'low' }
    ] : [
        { text: 'Image appears safe for use', priority: 'info' },
        { text: 'Consider running forensics for verification', priority: 'low' },
        { text: 'Check metadata for additional context', priority: 'low' }
    ];

    if (confidence < 0.70) {
        recommendations.unshift({ text: 'Low confidence - consider re-analyzing with different model', priority: 'high' });
    }

    const priorityStyles = {
        high: 'bg-red-100 text-red-700 border-red-200',
        medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        low: 'bg-blue-100 text-blue-700 border-blue-200',
        info: 'bg-green-100 text-green-700 border-green-200'
    };

    return (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-800 flex items-center mb-4">
                <ChevronRight className="w-4 h-4 mr-2 text-indigo-600" />
                Recommended Actions
            </h4>
            <ul className="space-y-2">
                {recommendations.map((rec, idx) => (
                    <li key={idx} className={clsx(
                        "flex items-center p-2 rounded-lg border text-sm",
                        priorityStyles[rec.priority]
                    )}>
                        <ChevronRight className="w-4 h-4 mr-2 flex-shrink-0" />
                        {rec.text}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Main Component
export default function AIResultPanel({ result, modelName, onScrollToForensics }) {
    if (!result) return null;

    const { prediction, confidence, duration, timestamp, raw_score, label } = result;
    const isStego = prediction === 'stego';

    // Use raw_score if available for accurate probability display
    // raw_score is the sigmoid output (probability of stego)
    const stegoProb = raw_score !== undefined ? raw_score : (isStego ? confidence : (1 - confidence));
    const cleanProb = raw_score !== undefined ? (1 - raw_score) : (isStego ? (1 - confidence) : confidence);

    return (
        <div className={clsx(
            "rounded-2xl overflow-hidden border-2 shadow-lg",
            isStego
                ? "bg-gradient-to-br from-red-50 via-white to-orange-50 border-red-300"
                : "bg-gradient-to-br from-green-50 via-white to-emerald-50 border-green-300"
        )}>
            {/* Header */}
            <div className={clsx(
                "px-6 py-5",
                isStego
                    ? "bg-gradient-to-r from-red-600 to-orange-600"
                    : "bg-gradient-to-r from-green-600 to-emerald-600"
            )}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            {isStego ? (
                                <ShieldAlert className="w-8 h-8 text-white" />
                            ) : (
                                <ShieldCheck className="w-8 h-8 text-white" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">
                                {isStego ? 'STEGANOGRAPHY DETECTED' : 'CLEAN IMAGE'}
                            </h3>
                            <p className="text-white/80 text-sm mt-1">
                                {label || (isStego ? 'Có giấu tin' : 'Không giấu tin')} • AI-powered analysis
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-black text-white">
                            {(confidence * 100).toFixed(1)}%
                        </div>
                        <div className="text-white/70 text-sm">Confidence</div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
                {/* Risk Assessment */}
                <RiskAssessmentCard prediction={prediction} confidence={confidence} />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ConfidenceMeter confidence={confidence} prediction={prediction} />
                    <ProbabilityBreakdown stegoProb={stegoProb} cleanProb={cleanProb} />
                </div>

                {/* Technical Details */}
                <TechnicalDetails
                    modelName={modelName}
                    duration={duration}
                    timestamp={timestamp}
                />

                {/* Recommendations */}
                <Recommendations prediction={prediction} confidence={confidence} />

                {/* Action Button */}
                {isStego && onScrollToForensics && (
                    <button
                        onClick={onScrollToForensics}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center"
                    >
                        <Shield className="w-5 h-5 mr-2" />
                        Continue to Forensics Analysis
                    </button>
                )}
            </div>
        </div>
    );
}
