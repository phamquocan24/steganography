/**
 * Guide/Documentation Page
 * Comprehensive user guide and feature documentation
 */

import React, { useState } from 'react';
import { Book, Play, Upload, Search, FileText, Image, Binary, CheckCircle, AlertCircle, Info, Layers, Zap, Database, Cpu, Shield } from 'lucide-react';

export default function GuidePage() {
    const [activeSection, setActiveSection] = useState('getting-started');

    const sections = [
        { id: 'getting-started', label: 'Getting Started', icon: Play },
        { id: 'ai-detection', label: 'AI Detection', icon: Zap },
        { id: 'metadata', label: 'Metadata Analysis', icon: Database },
        { id: 'strings', label: 'String Extraction', icon: Search },
        { id: 'visual', label: 'Visual Analysis', icon: Image },
        { id: 'superimposed', label: 'Superimposed Analysis', icon: Layers },
        { id: 'lsb', label: 'LSB Extraction', icon: Binary },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
            <div className="max-w-7xl mx-auto py-12 px-4">
                {/* Hero */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-white mb-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center mb-4">
                        <Book className="w-12 h-12 mr-4" />
                        <div>
                            <h1 className="text-5xl font-bold mb-2">User Guide & Documentation</h1>
                            <p className="text-xl text-blue-100">
                                Hướng dẫn chi tiết sử dụng tất cả tính năng của Steganalysis Pro
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-xl p-4 shadow-lg sticky top-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <h3 className="font-bold text-gray-900 mb-4">Contents</h3>
                            <nav className="space-y-2">
                                {sections.map(section => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-all flex items-center ${activeSection === section.id
                                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                                            : 'text-gray-700 hover:bg-blue-50'
                                            }`}
                                    >
                                        <section.icon className="w-4 h-4 mr-2" />
                                        {section.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-3">
                        <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            {activeSection === 'getting-started' && <GettingStarted />}
                            {activeSection === 'ai-detection' && <AIDetectionGuide />}
                            {activeSection === 'metadata' && <MetadataGuide />}
                            {activeSection === 'strings' && <StringsGuide />}
                            {activeSection === 'visual' && <VisualGuide />}
                            {activeSection === 'superimposed' && <SuperimposedGuide />}
                            {activeSection === 'lsb' && <LSBGuide />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Section Components
function GettingStarted() {
    return (
        <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Getting Started</h2>

            <div className="bg-blue-50 rounded-lg p-6 mb-6 border-l-4 border-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Welcome!</h3>
                <p className="text-gray-700">
                    Steganalysis Pro là nền tảng phát hiện steganography và phân tích forensics toàn diện.
                    Hướng dẫn này sẽ giúp bạn sử dụng hiệu quả tất cả các tính năng.
                </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Step-by-Step Guide</h3>

            <Step number={1} title="Upload Your Image">
                <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
                    <li>Click vào "Upload Image" area để chọn file</li>
                    <li>Hoặc drag & drop image trực tiếp vào khung</li>
                    <li>Supported formats: PNG, JPEG, BMP, GIF</li>
                    <li>Maximum size: 20MB</li>
                    <li>Preview sẽ hiện ngay sau khi upload</li>
                </ul>
            </Step>

            <Step number={2} title="Choose Analysis Type">
                <div className="mt-3 space-y-3">
                    <div className="bg-gray-50 rounded p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <strong className="text-blue-600">AI Detection:</strong>
                        <p className="text-sm text-gray-700 mt-1">
                            Sử dụng deep learning models để phát hiện steganography. Nhanh và chính xác cao.
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <strong className="text-cyan-600">Forensics Analysis:</strong>
                        <p className="text-sm text-gray-700 mt-1">
                            Phân tích chi tiết với 4 modules: Metadata, Strings, Visual, LSB. Cung cấp thông tin sâu.
                        </p>
                    </div>
                </div>
            </Step>

            <Step number={3} title="Review Results">
                <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
                    <li>AI Detection: Xem prediction (Stego/Clean) và confidence score</li>
                    <li>Forensics: Navigate qua các tabs để xem từng loại analysis</li>
                    <li>Download extracted files nếu có</li>
                    <li>Check history để xem lại các analyses trước</li>
                </ul>
            </Step>

            <div className="bg-yellow-50 rounded-lg p-6 mt-8 border-l-4 border-yellow-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start">
                    <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-yellow-900 mb-2">Pro Tips</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-yellow-900">
                            <li>Sử dụng "Analyze All" trong Forensics để chạy tất cả modules cùng lúc</li>
                            <li>LSB extraction hoạt động tốt nhất với PNG images</li>
                            <li>Check metadata trước khi extract strings để tìm hints</li>
                            <li>Visual analysis rất hữu ích cho low-level steganography</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AIDetectionGuide() {
    return (
        <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">AI Detection Module</h2>

            <p className="text-gray-700 mb-6">
                AI Detection sử dụng 5 deep learning models đã được huấn luyện để phát hiện steganography
                trong images với độ chính xác cao (lên đến 95.8%).
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Available Models</h3>

            <ModelCard
                name="ResNet50 (HPF Enabled)"
                accuracy="95.8%"
                description="Model mạnh nhất với 50-layer residual network. Sử dụng HPF preprocessing để tăng độ chính xác. Recommended cho production use."
                useCases={["CTF competitions", "High-stakes analysis", "Research purposes"]}
            />

            <ModelCard
                name="MobileNetV2 (HPF Enabled)"
                accuracy="94.2%"
                description="Lightweight model tối ưu cho speed. Vẫn giữ accuracy cao nhờ HPF. Tốt cho real-time analysis."
                useCases={["Quick scans", "Batch processing", "Mobile deployment"]}
            />

            <ModelCard
                name="VGG16 (HPF Enabled)"
                accuracy="93.5%"
                description="Classic deep network, stable và reliable. Good balance giữa accuracy và stability."
                useCases={["General purpose", "Stable predictions", "Educational use"]}
            />

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">How to Use</h3>

            <GuideSteps>
                <li>Upload image (PNG, JPEG, BMP recommended)</li>
                <li>Select model từ dropdown (mặc định: ResNet50)</li>
                <li>Click "Analyze Image" button</li>
                <li>Chờ kết quả (thường 1-3 giây)</li>
                <li>Review prediction và confidence score</li>
            </GuideSteps>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Understanding Results</h3>

            <ResultBox
                type="stego"
                confidence={87.5}
                interpretation="Model detected steganography với high confidence. Recommended: Run forensics analysis để extract hidden data."
            />

            <ResultBox
                type="clean"
                confidence={92.3}
                interpretation="Image is likely clean (no steganography). Nhưng vẫn có thể check forensics for manual verification."
            />

            <div className="bg-blue-50 rounded-lg p-6 mt-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    What is HPF?
                </h4>
                <p className="text-sm text-blue-900 mb-2">
                    <strong>High-Pass Filter (HPF)</strong> là preprocessing technique loại bỏ low-frequency
                    components (nội dung ảnh) và giữ lại high-frequency components (noise, textures).
                </p>
                <p className="text-sm text-blue-900">
                    Steganography thường thay đổi LSBs, tạo ra high-frequency noise. HPF giúp model
                    "nhìn thấy" những thay đổi này rõ hơn, tăng accuracy đáng kể (5-8%).
                </p>
            </div>
        </div>
    );
}

function MetadataGuide() {
    return (
        <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Metadata Analysis</h2>

            <p className="text-gray-700 mb-6">
                Metadata là thông tin "ẩn" trong file image, bao gồm EXIF data, GPS coordinates, comments,
                và software info. Attackers thường giấu data trong các field này.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">What Gets Extracted?</h3>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <DataTypeCard
                    title="Basic Information"
                    items={["File format", "Dimensions (width × height)", "Color mode (RGB, grayscale)", "File size"]}
                />
                <DataTypeCard
                    title="EXIF Data"
                    items={["Camera make & model", "Capture datetime", "Exposure settings (ISO, shutter, aperture)", "Software used"]}
                />
                <DataTypeCard
                    title="GPS Coordinates"
                    items={["Latitude & longitude", "Altitude", "Timestamp", "Google Maps link"]}
                />
                <DataTypeCard
                    title="Comments & Custom Fields"
                    items={["User comments", "Artist info", "Copyright", "Custom metadata fields"]}
                />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Suspicious Pattern Detection</h3>

            <p className="text-gray-700 mb-4">
                System tự động detect các patterns đáng ngờ:
            </p>

            <SuspiciousPatternList>
                <li><strong>Long Comments:</strong> Comments &gt; 200 characters (có thể chứa encoded data)</li>
                <li><strong>CTF Flags:</strong> Patterns như CTF{"{"}, FLAG{"{"}, flag{"{"}</li>
                <li><strong>URLs:</strong> Hidden links trong metadata</li>
                <li><strong>Base64 Strings:</strong> Encoded data trong comments/descriptions</li>
                <li><strong>Excessive Metadata:</strong> Quá nhiều custom fields (&gt;30)</li>
            </SuspiciousPatternList>

            <div className="bg-green-50 rounded-lg p-6 mt-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h4 className="font-bold text-green-900 mb-3">✅ Best Practices</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-green-900">
                    <li>Always check GPS tab - attackers often hide coords</li>
                    <li>Read all comments carefully</li>
                    <li>Cross-reference camera info với image content</li>
                    <li>Check for unusual software names</li>
                    <li>Export metadata for documentation</li>
                </ul>
            </div>
        </div>
    );
}

function StringsGuide() {
    return (
        <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">String Extraction</h2>

            <p className="text-gray-700 mb-6">
                String extraction reads image file as raw bytes và searches for readable text strings.
                Rất hiệu quả cho plaintext steganography và embedded messages.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Supported Encodings</h3>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
                <EncodingCard name="ASCII" desc="Standard 7-bit characters (a-z, 0-9)" />
                <EncodingCard name="UTF-8" desc="Universal encoding, supports emojis, tiếng Việt" />
                <EncodingCard name="UTF-16" desc="16-bit encoding, often used by Windows" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Pattern Matching</h3>

            <p className="text-gray-700 mb-4">
                System tự động detect 7 loại patterns:
            </p>

            <PatternGrid>
                <PatternItem icon="🌐" name="URLs" example="https://example.com/secret" />
                <PatternItem icon="📧" name="Emails" example="user@domain.com" />
                <PatternItem icon="🔢" name="IP Addresses" example="192.168.1.1" />
                <PatternItem icon="🔐" name="Base64" example="SGVsbG8gV29ybGQ=" />
                <PatternItem icon="#️⃣" name="Hex Strings" example="0x4142434445" />
                <PatternItem icon="🚩" name="CTF Flags" example="FLAG{hidden_message}" />
                <PatternItem icon="🔑" name="JWT Tokens" example="eyJhbGciOiJIUzI1..." />
            </PatternGrid>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Base64 Auto-Decoding</h3>

            <p className="text-gray-700 mb-4">
                Khi detect được base64 strings, system tự động attempt decode và hiển thị:
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <p className="font-mono text-sm text-gray-900 mb-2">
                    <strong>Encoded:</strong> U2VjcmV0IE1lc3NhZ2U=
                </p>
                <p className="font-mono text-sm text-green-700">
                    <strong>Decoded:</strong> Secret Message
                </p>
                <p className="text-xs text-gray-600 mt-2">Confidence: High | Is Binary: No</p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Search & Filter</h3>

            <GuideSteps>
                <li>Use search box để find specific strings</li>
                <li>Filter by encoding (ASCII, UTF-8, All)</li>
                <li>Toggle between "Patterns View" và "Raw Strings"</li>
                <li>Click on string để view context</li>
                <li>Copy findings để document</li>
            </GuideSteps>
        </div>
    );
}

function VisualGuide() {
    return (
        <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Visual Analysis</h2>

            <p className="text-gray-700 mb-6">
                Visual Analysis sử dụng computer vision techniques để phân tích image ở level thấp,
                revealing hidden patterns invisible to human eyes.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Channel Decomposition</h3>

            <p className="text-gray-700 mb-4">
                Tách image thành các color channels riêng biệt:
            </p>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
                <ChannelCard name="Red" color="bg-red-100 text-red-700" />
                <ChannelCard name="Green" color="bg-green-100 text-green-700" />
                <ChannelCard name="Blue" color="bg-blue-100 text-blue-700" />
                <ChannelCard name="Alpha" color="bg-gray-100 text-gray-700" />
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <strong className="text-blue-900">Why This Matters:</strong>
                <p className="text-sm text-blue-900 mt-2">
                    Steganography thường chỉ modify một channel cụ thể. Decomposition giúp identify
                    channel nào có anomalies.
                </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Bit Plane Extraction</h3>

            <p className="text-gray-700 mb-4">
                Mỗi pixel có 8 bits (0-7). Bit plane extraction visualizes từng bit level:
            </p>

            <BitPlaneExplanation />

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Anomaly Detection</h3>

            <p className="text-gray-700 mb-4">
                System tự động detect 3 loại anomalies:
            </p>

            <AnomalyList>
                <li>
                    <strong>High LSB Entropy:</strong> LSB layers có randomness cao (entropy &gt; 0.95)
                    → Possible steganography
                </li>
                <li>
                    <strong>Non-Random LSB Patterns:</strong> LSB không random nhưng có patterns
                    → Structured hidden data
                </li>
                <li>
                    <strong>Low Channel Correlation:</strong> Channels không correlate normally
                    → Manual modifications
                </li>
            </AnomalyList>

            <div className="bg-yellow-50 rounded-lg p-6 mt-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h4 className="font-bold text-yellow-900 mb-3 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Interpretation Guide
                </h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-yellow-900">
                    <li>Green alerts = Normal patterns, low risk</li>
                    <li>Yellow alerts = Moderate anomalies, worth investigating</li>
                    <li>Red alerts = Strong indicators, high confidence stego</li>
                    <li>Check histogram spikes for LSB manipulation</li>
                </ul>
            </div>
        </div>
    );
}

function SuperimposedGuide() {
    return (
        <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Superimposed Analysis</h2>

            <div className="bg-cyan-50 rounded-lg p-6 mb-6 border-l-4 border-cyan-600">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <Layers className="w-6 h-6 mr-2 text-cyan-600" />
                    What is Superimposed Analysis?
                </h3>
                <p className="text-gray-700">
                    Superimposed analysis overlays (chồng) multiple color channels hoặc bit planes lại với nhau
                    để phát hiện hidden patterns mà không thể thấy khi xem riêng lẻ từng thành phần.
                </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">How It Works</h3>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 hover-lift">
                    <h4 className="font-bold text-blue-900 mb-2">Channel Superposition</h4>
                    <p className="text-sm text-gray-700">
                        Kết hợp nhiều color channels (R, G, B) thành một ảnh duy nhất bằng các blend modes
                        như average, max, hoặc XOR.
                    </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 hover-lift">
                    <h4 className="font-bold text-purple-900 mb-2">Bit Plane Superposition</h4>
                    <p className="text-sm text-gray-700">
                        Overlay nhiều bit planes (0-7) để tạo combined image từ LSB hoặc MSB layers,
                        revealing hidden data patterns.
                    </p>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Configuration</h3>

            <ConfigOption
                name="Analysis Mode"
                description="Choose what to analyze"
                options={['Channels Only', 'Bit Planes Only', 'Both (Recommended)']}
            />

            <ConfigOption
                name="Channels to Superimpose"
                description="Select color channels"
                options={['R (Red)', 'G (Green)', 'B (Blue)', 'All RGB']}
            />

            <ConfigOption
                name="Bit Planes"
                description="Select which bit positions (0=LSB, 7=MSB)"
                options={['0-2 (LSB recommended)', '3-5 (Mid planes)', '6-7 (MSB)']}
            />

            <ConfigOption
                name="Blend Mode"
                description="How to combine layers"
                options={[
                    'Average - Mean of all selected',
                    'Max - Maximum value',
                    'XOR - Bitwise XOR (detects differences)'
                ]}
            />

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Understanding Results</h3>

            <ResultsGuide>
                <ResultItem
                    title="Channel Superposition Images"
                    description="Xem combined images từ R+G+B hoặc các combinations khác. Tìm visible patterns, text, hoặc watermarks."
                />
                <ResultItem
                    title="Bit Plane Overlays"
                    description="Images kết hợp từ nhiều bit planes. LSB combinations thường reveal hidden data."
                />
                <ResultItem
                    title="Combined Analysis"
                    description="Khi chọn 'Both', xem tổng hợp từ tất cả RGB LSB planes để phát hiện multi-layer hiding."
                />
            </ResultsGuide>

            <div className="bg-yellow-50 rounded-lg p-6 mt-6 border-l-4 border-yellow-600">
                <h4 className="font-bold text-yellow-900 mb-2 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Pro Tips
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                    <li>Start with "Both" mode và LSB planes (0-2) cho general detection</li>
                    <li>Use XOR blend mode để highlight differences between channels</li>
                    <li>Tìm QR codes, text, hoặc geometric patterns trong combined images</li>
                    <li>Compare với Visual Analysis results để understand layer structure</li>
                    <li>Multi-channel hiding techniques sẽ reveal patterns khi superimposed</li>
                </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-6 mt-6 border-l-4 border-green-600">
                <h4 className="font-bold text-green-900 mb-2">Use Cases</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                    <li><strong>Watermark Detection:</strong> Hidden watermarks across multiple channels</li>
                    <li><strong>CTF Challenges:</strong> Flags embedded using multi-layer techniques</li>
                    <li><strong>Forensics:</strong> Detect sophisticated steganography methods</li>
                    <li><strong>Research:</strong> Analyze advanced hiding algorithms</li>
                </ul>
            </div>
        </div>
    );
}

function LSBGuide() {
    return (
        <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">LSB Extraction</h2>

            <p className="text-gray-700 mb-6">
                LSB (Least Significant Bit) extraction reads the lowest bits of pixel values để extract
                hidden data. Most common steganography technique.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Configuration Options</h3>

            <ConfigOption
                name="Channels"
                description="Which color channels to extract from"
                options={["RGB (All channels)", "R (Red only)", "G (Green only)", "B (Blue only)", "RG, RB, GB (Combinations)"]}
            />

            <ConfigOption
                name="Bit Order"
                description="Extract from least or most significant bits"
                options={["LSB (Least Significant Bit) - Most common", "MSB (Most Significant Bit) - Less common"]}
            />

            <ConfigOption
                name="Bits per Channel"
                description="How many bits to extract per channel (1-8)"
                options={["1 bit: Subtle, less data", "2-3 bits: Balanced", "4+ bits: Visible distortion, more data"]}
            />

            <ConfigOption
                name="Max Bytes"
                description="Maximum data to extract (safety limit)"
                options={["256 KB - Quick test", "1 MB - Standard", "5+ MB - Deep extraction"]}
            />

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Understanding Results</h3>

            <ResultsGuide>
                <ResultItem
                    title="Confidence Score"
                    description="0-100 score based on file signatures, text detection, entropy. >60 = Likely contains data."
                />
                <ResultItem
                    title="File Type Detection"
                    description="System checks magic bytes để identify file type (ZIP, PNG, PDF, etc.)"
                />
                <ResultItem
                    title="Text Decoding"
                    description="Attempts decode as text in multiple encodings (UTF-8, ASCII, Latin-1)"
                />
                <ResultItem
                    title="Entropy Analysis"
                    description="Measures randomness. High entropy = encrypted/compressed data."
                />
            </ResultsGuide>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Best Practices</h3>

            <div className="bg-green-50 rounded-lg p-6 mb-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h4 className="font-bold text-green-900 mb-3">✅ Recommended Workflow</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-green-900">
                    <li>Start với RGB channels, LSB, 1 bit per channel</li>
                    <li>Nếu không detect anything, try individual channels (R, G, B)</li>
                    <li>Increase bits per channel nếu cần more data</li>
                    <li>Try MSB nếu LSB fails</li>
                    <li>Always download extracted file để verify</li>
                    <li>Check entropy - high entropy = likely meaningful data</li>
                </ol>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <strong className="text-blue-900">💡 Pro Tip:</strong>
                <p className="text-sm text-blue-900 mt-2">
                    Visual analysis trước để identify suspicious channels, sau đó target LSB extraction
                    vào channel đó. Saves time và increases success rate.
                </p>
            </div>
        </div>
    );
}

// Smaller Helper Components
function Step({ number, title, children }) {
    return (
        <div className="mb-6 flex">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white flex items-center justify-center font-bold mr-4">
                {number}
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
                {children}
            </div>
        </div>
    );
}

function ModelCard({ name, accuracy, description, useCases }) {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 mb-4 border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-gray-900 text-lg">{name}</h4>
                <span className="px-3 py-1 bg-green-600 text-white text-sm font-bold rounded-full">
                    {accuracy}
                </span>
            </div>
            <p className="text-sm text-gray-700 mb-3">{description}</p>
            <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Best For:</p>
                <div className="flex flex-wrap gap-2">
                    {useCases.map((use, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {use}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function GuideSteps({ children }) {
    return <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">{children}</ol>;
}

function ResultBox({ type, confidence, interpretation }) {
    const isStego = type === 'stego';
    return (
        <div className={`rounded-lg p-6 mb-4 border-2 ${isStego ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex justify-between items-center mb-3">
                <span className={`font-bold text-lg ${isStego ? 'text-red-700' : 'text-green-700'}`}>
                    Prediction: {isStego ? 'STEGO DETECTED' : 'CLEAN IMAGE'}
                </span>
                <span className="px-4 py-2 bg-gray-900 text-white rounded-full font-bold">
                    {confidence}%
                </span>
            </div>
            <p className="text-sm text-gray-700">{interpretation}</p>
        </div >
    );
}

function DataTypeCard({ title, items }) {
    return (
        <div className="bg-gray-50 rounded-lg p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
            <ul className="space-y-1">
                {items.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SuspiciousPatternList({ children }) {
    return <ul className="space-y-3 text-gray-700">{children}</ul>;
}

function EncodingCard({ name, desc }) {
    return (
        <div className="bg-blue-50 rounded-lg p-4 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h4 className="font-bold text-blue-900 mb-2">{name}</h4>
            <p className="text-xs text-gray-700">{desc}</p>
        </div>
    );
}

function PatternGrid({ children }) {
    return <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">{children}</div>;
}

function PatternItem({ icon, name, example }) {
    return (
        <div className="bg-gray-50 rounded-lg p-3 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-2xl mb-2">{icon}</div>
            <p className="font-semibold text-sm text-gray-900">{name}</p>
            <p className="text-xs text-gray-600 mt-1 font-mono">{example}</p>
        </div>
    );
}

function ChannelCard({ name, color }) {
    return (
        <div className={`rounded-lg p-4 text-center font-bold ${color}`}>
            {name}
        </div>
    );
}

function BitPlaneExplanation() {
    return (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="grid grid-cols-8 gap-2 mb-4">
                {[7, 6, 5, 4, 3, 2, 1, 0].map(bit => (
                    <div key={bit} className={`text-center p-3 rounded ${bit === 0 ? 'bg-red-100 border-2 border-red-500' : 'bg-gray-200'}`}>
                        <div className="font-bold text-gray-900">{bit}</div>
                        <div className="text-xs text-gray-600">{bit === 7 ? 'MSB' : bit === 0 ? 'LSB' : ''}</div>
                    </div>
                ))}
            </div>
            <p className="text-sm text-gray-700">
                <strong>LSB (Bit 0):</strong> Changing this bit causes minimal visual change (±1 pixel value).
                Perfect for hiding data. <strong>MSB (Bit 7):</strong> Significant visual impact.
            </p>
        </div>
    );
}

function AnomalyList({ children }) {
    return <ul className="space-y-3 text-gray-700">{children}</ul>;
}

function ConfigOption({ name, description, options }) {
    return (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-5 mb-6 border-l-4 border-blue-500 hover-lift">
            <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {name}
            </h4>
            <p className="text-sm text-gray-600 mb-3 ml-4">{description}</p>
            <ul className="space-y-2 ml-4">
                {options.map((opt, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                        <span className="text-blue-500 mr-2 mt-1">▸</span>
                        <span>{opt}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ResultsGuide({ children }) {
    return <div className="space-y-4">{children}</div>;
}

function ResultItem({ title, description }) {
    return (
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h5 className="font-bold text-gray-900 mb-1">{title}</h5>
            <p className="text-sm text-gray-700">{description}</p>
        </div>
    );
}
