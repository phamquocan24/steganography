/**
 * Main App Component with React Router
 * Professional routing system for all pages
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { X, Trash2, Clock, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { ToastContainer, useToast } from './components/Toast';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ArchitecturePage from './pages/ArchitecturePage';
import GuidePage from './pages/GuidePage';
import clsx from 'clsx';

function App() {
    // Toast notifications
    const { toasts, addToast, removeToast } = useToast();

    // History and stats
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({ total: 0, stego: 0, clean: 0 });
    const [showHistory, setShowHistory] = useState(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

    useEffect(() => {
        // Load history from localStorage
        const saved = localStorage.getItem('stego_history');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setHistory(parsed);
                updateStats(parsed);
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    const updateStats = (historyData) => {
        const total = historyData.length;
        const stego = historyData.filter(item => item.prediction === 'stego').length;
        const clean = total - stego;
        setStats({ total, stego, clean });
    };

    const handleUpdateHistory = (aiResult) => {
        const MAX_HISTORY = 200; // Increased from 50
        const newHistory = [aiResult, ...history].slice(0, MAX_HISTORY);
        setHistory(newHistory);
        updateStats(newHistory);
        localStorage.setItem('stego_history', JSON.stringify(newHistory));
        addToast('Saved to history', 'success');
    };

    const deleteHistoryItem = (index) => {
        const updatedHistory = history.filter((_, i) => i !== index);
        setHistory(updatedHistory);
        updateStats(updatedHistory);
        localStorage.setItem('stego_history', JSON.stringify(updatedHistory));
        addToast('Deleted from history', 'info');
    };

    const clearAllHistory = () => {
        if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử?')) {
            setHistory([]);
            setStats({ total: 0, stego: 0, clean: 0 });
            localStorage.removeItem('stego_history');
            addToast('History cleared', 'success');
        }
    };

    const viewHistoryDetail = (item) => {
        setSelectedHistoryItem(item);
    };

    return (
        <Router>
            <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
                {/* Fixed Header */}
                <Header
                    stats={stats}
                    showHistory={showHistory}
                    setShowHistory={setShowHistory}
                    historyCount={history.length}
                />

                {/* Scrollable Main Content */}
                <main className="flex-1 overflow-y-auto scrollbar-custom">
                    <Routes>
                        <Route path="/" element={<HomePage addToast={addToast} onUpdateHistory={handleUpdateHistory} />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/architecture" element={<ArchitecturePage />} />
                        <Route path="/guide" element={<GuidePage />} />
                    </Routes>

                    {/* Footer inside scrollable area */}
                    <Footer />
                </main>

                {/* History Sidebar */}
                {showHistory && (
                    <HistorySidebar
                        history={history}
                        onClose={() => setShowHistory(false)}
                        onDelete={deleteHistoryItem}
                        onClearAll={clearAllHistory}
                        onViewDetail={viewHistoryDetail}
                    />
                )}

                {/* History Detail Modal */}
                {selectedHistoryItem && (
                    <HistoryDetailModal
                        item={selectedHistoryItem}
                        onClose={() => setSelectedHistoryItem(null)}
                    />
                )}

                {/* Toast Notifications */}
                <ToastContainer toasts={toasts} removeToast={removeToast} />
            </div>
        </Router>
    );
}

// History Sidebar Component
function HistorySidebar({ history, onClose, onDelete, onClearAll, onViewDetail }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end" onClick={onClose}>
            <div
                className="bg-white w-full max-w-2xl h-full overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-2xl font-bold">Analysis History</h2>
                        <p className="text-blue-100 text-sm">
                            {history.length} {history.length === 1 ? 'analysis' : 'analyses'} (Max 200)
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {history.length > 0 && (
                            <button
                                onClick={onClearAll}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear All
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* History List */}
                <div className="p-6">
                    {history.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-semibold">No History Yet</p>
                            <p className="text-sm">Your analysis history will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((item, index) => (
                                <HistoryItem
                                    key={index}
                                    item={item}
                                    onDelete={() => onDelete(index)}
                                    onViewDetail={() => onViewDetail(item)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function HistoryItem({ item, onDelete, onViewDetail }) {
    return (
        <div className={clsx(
            "rounded-lg p-4 border-2 transition-all hover:shadow-md cursor-pointer",
            item.prediction === 'stego'
                ? "bg-red-50 border-red-200 hover:border-red-300"
                : "bg-green-50 border-green-200 hover:border-green-300"
        )}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center flex-1" onClick={onViewDetail}>
                    {item.prediction === 'stego' ? (
                        <AlertTriangle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                    ) : (
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                    )}
                    <span className={clsx(
                        "font-bold",
                        item.prediction === 'stego' ? "text-red-700" : "text-green-700"
                    )}>
                        {item.prediction === 'stego' ? 'STEGO DETECTED' : 'CLEAN IMAGE'}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewDetail();
                        }}
                        className="p-1.5 hover:bg-blue-100 rounded transition-colors"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="p-1.5 hover:bg-red-100 rounded transition-colors"
                        title="Delete"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm" onClick={onViewDetail}>
                <div>
                    <span className="text-gray-600">File:</span>
                    <span className="ml-2 font-medium truncate block">{item.filename}</span>
                </div>
                <div>
                    <span className="text-gray-600">Confidence:</span>
                    <span className="ml-2 font-bold">{(item.confidence * 100).toFixed(2)}%</span>
                </div>
                <div>
                    <span className="text-gray-600">Time:</span>
                    <span className="ml-2 font-medium text-xs">{item.timestamp}</span>
                </div>
                <div>
                    <span className="text-gray-600">Duration:</span>
                    <span className="ml-2 font-medium">{item.duration}ms</span>
                </div>
            </div>
        </div>
    );
}

// History Detail Modal
function HistoryDetailModal({ item, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={clsx(
                    "p-6 text-white",
                    item.prediction === 'stego'
                        ? "bg-gradient-to-r from-red-600 to-orange-600"
                        : "bg-gradient-to-r from-green-600 to-emerald-600"
                )}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">
                                {item.prediction === 'stego' ? 'STEGO DETECTED' : 'CLEAN IMAGE'}
                            </h2>
                            <p className="text-white/80">Analysis Details</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* File Info */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">File Information</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <DetailRow label="Filename" value={item.filename} />
                            <DetailRow label="Dimensions" value={item.imageDimensions || 'N/A'} />
                            <DetailRow label="Size" value={item.imageSize ? `${(item.imageSize / 1024).toFixed(2)} KB` : 'N/A'} />
                        </div>
                    </div>

                    {/* Analysis Results */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Analysis Results</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <DetailRow label="Prediction" value={item.prediction.toUpperCase()} />
                            <DetailRow label="Confidence" value={`${(item.confidence * 100).toFixed(2)}%`} bold />
                            <DetailRow label="Model Used" value={item.model || 'N/A'} />
                            <DetailRow label="Duration" value={`${item.duration}ms`} />
                            <DetailRow label="Timestamp" value={item.timestamp} />
                        </div>
                    </div>

                    {/* Probabilities */}
                    {item.probabilities && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Model Probabilities</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="space-y-3">
                                    <ProbabilityBar label="Stego" value={item.probabilities.stego || 0} color="red" />
                                    <ProbabilityBar label="Clean" value={item.probabilities.clean || 0} color="green" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function DetailRow({ label, value, bold }) {
    return (
        <div className="flex justify-between items-center py-1">
            <span className="text-gray-600">{label}:</span>
            <span className={clsx("text-gray-900", bold && "font-bold")}>{value}</span>
        </div>
    );
}

function ProbabilityBar({ label, value, color }) {
    const percentage = (value * 100).toFixed(2);
    const colors = {
        red: 'bg-red-600',
        green: 'bg-green-600'
    };

    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{label}</span>
                <span className="font-bold text-gray-900">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                    className={clsx("h-3 rounded-full transition-all", colors[color])}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

export default App;
