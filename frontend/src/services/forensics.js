/**
 * Forensics Analysis API Service
 * Technology: Axios for HTTP requests
 */

import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/forensics';

export const forensicsAPI = {
    // Metadata extraction
    extractMetadata: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await axios.post(`${API_BASE}/metadata`, formData);
        return data.data;
    },

    // String extraction
    extractStrings: async (file, options = {}) => {
        const formData = new FormData();
        formData.append('file', file);
        const params = new URLSearchParams({
            min_length: options.minLength || 4,
            max_strings: options.maxStrings || 1000
        });
        const { data } = await axios.post(`${API_BASE}/strings?${params}`, formData);
        return data.data;
    },

    // Visual analysis
    analyzeVisual: async (file, options = {}) => {
        const formData = new FormData();
        formData.append('file', file);
        const params = new URLSearchParams({
            include_bit_planes: options.includeBitPlanes ?? true,
            include_operations: options.includeOperations ?? true,
            include_histograms: options.includeHistograms ?? true
        });
        const { data } = await axios.post(`${API_BASE}/visual?${params}`, formData);
        return data.data;
    },

    // LSB extraction
    extractLSB: async (file, config = {}) => {
        const formData = new FormData();
        formData.append('file', file);
        const params = new URLSearchParams({
            channels: config.channels || 'RGB',
            bit_order: config.bitOrder || 'LSB',
            bits_per_channel: config.bitsPerChannel || 1,
            max_bytes: config.maxBytes || 1024 * 1024
        });
        const { data } = await axios.post(`${API_BASE}/lsb/extract?${params}`, formData);
        return data.data;
    },

    // Superimposed analysis
    analyzeSuperimposed: async (file, config = {}) => {
        const formData = new FormData();
        formData.append('file', file);
        const params = new URLSearchParams({
            mode: config.mode || 'both',
            channels: (config.channels || ['R', 'G', 'B']).join(','),
            bit_planes: (config.bitPlanes || [0, 1, 2]).join(','),
            blend_mode: config.blendMode || 'average'
        });
        const { data } = await axios.post(`${API_BASE}/superimposed?${params}`, formData);
        return data.data;
    },

    // Complete analysis
    analyzeAll: async (file, quickMode = false) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await axios.post(
            `${API_BASE}/analyze-all?quick_mode=${quickMode}`,
            formData,
            { timeout: 60000 }
        );
        return data;
    },

    // Download file
    downloadFile: (fileId, filename) => {
        const url = `${API_BASE}/download/${fileId}`;
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    }
};
