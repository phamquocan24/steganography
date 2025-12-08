/**
 * Strings Viewer Component
 * Displays extracted strings with pattern matching and filtering
 */

import React, { useState, useMemo } from 'react';
import { Search, Download, AlertTriangle, FileText, Link, Mail, Key, Shield } from 'lucide-react';
import { Alert, DataTable } from './shared/UIComponents';
import clsx from 'clsx';

export default function StringsViewer({ data }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState('patterns'); // 'patterns' or 'raw'

    // useMemo must be called BEFORE any conditional returns
    const filteredStrings = useMemo(() => {
        if (!data) return [];

        let strings = [];

        if (filter === 'all' || filter === 'ascii') {
            strings = [...strings, ...(data.ascii_strings || [])];
        }
        if (filter === 'all' || filter === 'utf8') {
            strings = [...strings, ...(data.utf8_strings || [])];
        }

        if (searchTerm) {
            strings = strings.filter(s =>
                s.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return strings;
    }, [data, filter, searchTerm]);

    // Conditional return AFTER all hooks
    if (!data) {
        return <EmptyState />;
    }

    return (
        <div className="space-y-4">
            {/* Suspicious Findings */}
            {data.suspicious_findings && data.suspicious_findings.length > 0 && (
                <Alert severity="warning" title={`${data.suspicious_findings.length} Suspicious Finding(s)`}>
                    <div className="space-y-2">
                        {data.suspicious_findings.map((finding, idx) => (
                            <SuspiciousFinding key={idx} finding={finding} />
                        ))}
                    </div>
                </Alert>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBox
                    icon={FileText}
                    label="Total Strings"
                    value={data.statistics.total_strings}
                />
                <StatBox
                    icon={Search}
                    label="Unique"
                    value={data.statistics.unique_strings}
                />
                <StatBox
                    icon={AlertTriangle}
                    label="Suspicious"
                    value={data.suspicious_findings?.length || 0}
                    color="red"
                />
                <StatBox
                    label="Avg Length"
                    value={data.statistics.average_length}
                />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setViewMode('patterns')}
                        className={clsx(
                            "px-4 py-2 rounded-lg font-medium transition-colors",
                            viewMode === 'patterns'
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                    >
                        Patterns
                    </button>
                    <button
                        onClick={() => setViewMode('raw')}
                        className={clsx(
                            "px-4 py-2 rounded-lg font-medium transition-colors",
                            viewMode === 'raw'
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                    >
                        Raw Strings
                    </button>
                </div>

                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                </button>
            </div>

            {/* Content */}
            {viewMode === 'patterns' ? (
                <PatternsView patterns={data.patterns} />
            ) : (
                <RawStringsView
                    strings={filteredStrings}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filter={filter}
                    setFilter={setFilter}
                />
            )}
        </div>
    );
}

function PatternsView({ patterns }) {
    const patternTypes = [
        { key: 'url', icon: Link, label: 'URLs', color: 'blue' },
        { key: 'email', icon: Mail, label: 'Emails', color: 'green' },
        { key: 'ipv4', icon: Shield, label: 'IP Addresses', color: 'purple' },
        { key: 'base64', icon: Key, label: 'Base64 Strings', color: 'yellow' },
        { key: 'hex', label: 'Hex Strings', color: 'gray' },
        { key: 'ctf_flag', icon: AlertTriangle, label: 'CTF Flags', color: 'red' },
        { key: 'jwt', icon: Key, label: 'JWT Tokens', color: 'orange' }
    ];

    const availablePatterns = patternTypes.filter(p =>
        patterns[p.key] && patterns[p.key].length > 0
    );

    if (availablePatterns.length === 0) {
        return (
            <Alert severity="info">
                No special patterns detected. Try viewing raw strings instead.
            </Alert>
        );
    }

    return (
        <div className="space-y-4">
            {availablePatterns.map(pattern => (
                <PatternCard
                    key={pattern.key}
                    pattern={pattern}
                    items={patterns[pattern.key]}
                />
            ))}
        </div>
    );
}

function PatternCard({ pattern, items }) {
    const [expanded, setExpanded] = useState(true);
    const Icon = pattern.icon || FileText;

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center">
                    <Icon className="w-5 h-5 text-blue-600 mr-3" />
                    <h3 className="font-semibold text-gray-900">{pattern.label}</h3>
                    <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {items.length}
                    </span>
                </div>
                <span className="text-gray-400">{expanded ? '−' : '+'}</span>
            </button>

            {expanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    {pattern.key === 'base64' ? (
                        <Base64List items={items} />
                    ) : (
                        <div className="space-y-2">
                            {items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white p-3 rounded border border-gray-200 font-mono text-sm"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function Base64List({ items }) {
    return (
        <div className="space-y-3">
            {items.map((item, idx) => (
                <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-600">
                            Encoded ({item.decoded_length} bytes)
                        </span>
                        <span className={clsx(
                            "px-2 py-0.5 text-xs font-medium rounded",
                            item.confidence === 'high'
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                        )}>
                            {item.confidence}
                        </span>
                    </div>
                    <div className="font-mono text-xs bg-gray-50 p-2 rounded mb-2 overflow-x-auto">
                        {item.encoded}
                    </div>
                    {!item.is_binary && (
                        <>
                            <div className="text-xs font-semibold text-gray-600 mb-1">Decoded:</div>
                            <div className="font-mono text-xs bg-blue-50 p-2 rounded overflow-x-auto">
                                {item.decoded}
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

function RawStringsView({ strings, searchTerm, setSearchTerm, filter, setFilter }) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            {/* Search and Filter */}
            <div className="flex items-center space-x-3 mb-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search strings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">All</option>
                    <option value="ascii">ASCII Only</option>
                    <option value="utf8">UTF-8 Only</option>
                </select>
            </div>

            {/* Strings List */}
            <div className="space-y-1 max-h-96 overflow-y-auto">
                {strings.map((str, idx) => (
                    <div
                        key={idx}
                        className="p-2 bg-gray-50 rounded font-mono text-sm hover:bg-gray-100 transition-colors"
                    >
                        {str}
                    </div>
                ))}
                {strings.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No strings match your search
                    </div>
                )}
            </div>
        </div>
    );
}

function SuspiciousFinding({ finding }) {
    const icons = {
        'CTF Flag Detected': AlertTriangle,
        'Security Keyword': Shield,
        'Multiple Base64 Strings': Key,
        'Private Key Detected': AlertTriangle,
        'JWT Token Detected': Key
    };

    const Icon = icons[finding.type] || AlertTriangle;

    return (
        <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <Icon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-yellow-900 mb-1">{finding.type}</h4>
                <p className="text-sm text-yellow-800">{finding.message}</p>
                {finding.recommendation && (
                    <p className="text-xs text-yellow-700 mt-1 italic">
                        → {finding.recommendation}
                    </p>
                )}
            </div>
        </div>
    );
}

function StatBox({ icon: Icon, label, value, color = 'indigo' }) {
    const colors = {
        indigo: 'bg-blue-50 text-blue-600',
        red: 'bg-red-50 text-red-600',
        green: 'bg-green-50 text-green-600'
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                {Icon && (
                    <div className={clsx("p-3 rounded-full", colors[color])}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No strings data available</p>
        </div>
    );
}
