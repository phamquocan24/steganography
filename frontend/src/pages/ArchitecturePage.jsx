/**
 * Architecture Page - System Architecture & Workflow
 * Detailed technical documentation
 */

import React from 'react';
import { Server, Database, Cpu, Layers, Zap, Shield, CheckCircle, ArrowRight } from 'lucide-react';

export default function ArchitecturePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Hero */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-white mb-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <h1 className="text-5xl font-bold mb-4">System Architecture</h1>
                    <p className="text-xl text-blue-100">
                        Kiến trúc hệ thống, workflow phân tích, và technical components
                    </p>
                </div>

                {/* High-Level Architecture Diagram */}
                <div className="bg-white rounded-xl p-8 shadow-lg mb-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">High-Level Architecture</h2>
                    <div className="space-y-6">
                        <ArchitectureLayer
                            title="Presentation Layer (Frontend)"
                            icon={Layers}
                            color="blue"
                            components={[
                                "React 18.2.0 SPA with Vite bundler",
                                "Responsive UI với Tailwind CSS",
                                "State management với React Hooks",
                                "Axios HTTP client cho API calls",
                                "Real-time toast notifications",
                                "Local storage for history"
                            ]}
                        />
                        <ArrowDown />
                        <ArchitectureLayer
                            title="API Layer (Backend)"
                            icon={Server}
                            color="cyan"
                            components={[
                                "FastAPI REST endpoints",
                                "Request validation với Pydantic",
                                "CORS middleware configuration",
                                "File upload handling (multipart/form-data)",
                                "Error handling và logging",
                                "Response formatting (JSON)"
                            ]}
                        />
                        <ArrowDown />
                        <ArchitectureLayer
                            title="Service Layer (Business Logic)"
                            icon={Cpu}
                            color="blue"
                            components={[
                                "Model Service - AI detection với 5 models",
                                "Metadata Extractor - EXIF/GPS extraction",
                                "String Extractor - Pattern matching",
                                "Visual Analyzer - Image processing",
                                "LSB Analyzer - Bit extraction"
                            ]}
                        />
                        <ArrowDown />
                        <ArchitectureLayer
                            title="Data Layer (Storage)"
                            icon={Database}
                            color="cyan"
                            components={[
                                "Model weights (.keras files) - 150-200 MB",
                                "Temporary uploaded images",
                                "Extracted files cache",
                                "Frontend LocalStorage - User history",
                                "Logging files - Error tracking"
                            ]}
                        />
                    </div>
                </div>

                {/* Analysis Workflow */}
                <div className="bg-white rounded-xl p-8 shadow-lg mb-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Analysis Workflow</h2>
                    <div className="space-y-4">
                        <WorkflowStep
                            number={1}
                            title="Image Upload"
                            description="User uploads image via drag-and-drop hoặc file selector"
                            technical="Frontend validates file type, size (<20MB), creates preview, stores in state"
                        />
                        <WorkflowStep
                            number={2}
                            title="Preprocessing"
                            description="Image được chuẩn hóa và prepared cho analysis"
                            technical="Resize to model input size (256x256), normalize pixel values (0-1), apply HPF if enabled"
                        />
                        <WorkflowStep
                            number={3}
                            title="AI Detection"
                            description="Deep learning models phân tích và predict stego vs clean"
                            technical="Forward pass qua CNN layers, softmax activation, confidence score calculation"
                        />
                        <WorkflowStep
                            number={4}
                            title="Forensics Analysis"
                            description="Comprehensive examination với 4 modules song song hoặc tuần tự"
                            technical="Metadata: piexif extraction | Strings: regex matching | Visual: numpy operations | LSB: bit manipulation"
                        />
                        <WorkflowStep
                            number={5}
                            title="Results Aggregation"
                            description="Kết quả từ các modules được tổng hợp và formatted"
                            technical="JSON response formatting, base64 encoding cho images, file download URLs generation"
                        />
                        <WorkflowStep
                            number={6}
                            title="Presentation"
                            description="UI displays results với interactive visualization"
                            technical="React components render data, charts với histogram plotting, lightbox cho images"
                        />
                    </div>
                </div>

                {/* AI Detection Pipeline */}
                <div className="bg-white rounded-xl p-8 shadow-lg mb-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">AI Detection Pipeline</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <h3 className="font-bold text-gray-900 mb-4">Without HPF</h3>
                            <ol className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">1.</span>
                                    Load image from bytes
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">2.</span>
                                    Resize to 256×256 pixels
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">3.</span>
                                    Normalize pixel values (0-1)
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">4.</span>
                                    Add batch dimension
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">5.</span>
                                    Forward pass qua model
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">6.</span>
                                    Softmax → Confidence scores
                                </li>
                            </ol>
                        </div>

                        <div className="bg-cyan-50 rounded-lg p-6 border-l-4 border-cyan-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <h3 className="font-bold text-gray-900 mb-4">With HPF Preprocessing</h3>
                            <ol className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">1.</span>
                                    Load image from bytes
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">2.</span>
                                    Resize to 256×256 pixels
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">3.</span>
                                    <strong>Apply HPF layer (extract high-freq components)</strong>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">4.</span>
                                    Normalize pixel values
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">5.</span>
                                    Add batch dimension
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">6.</span>
                                    Forward pass qua model
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">7.</span>
                                    Softmax → Confidence scores
                                </li>
                            </ol>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                        💡 <strong>HPF (High-Pass Filter):</strong> Loại bỏ low-frequency components (nội dung ảnh),
                        giữ lại high-frequency components (noise, edges) - nơi steganography thường ẩn dữ liệu.
                    </p>
                </div>

                {/* Forensics Modules */}
                <div className="bg-white rounded-xl p-8 shadow-lg mb-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Forensics Modules Architecture</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <ModuleCard
                            title="Metadata Extractor"
                            description="Extracts và analyzes image metadata"
                            steps={[
                                "Load image with PIL/piexif",
                                "Extract EXIF tags (camera, datetime, settings)",
                                "Parse GPS coordinates if available",
                                "Read image comments",
                                "Detect suspicious patterns (long strings, CTF flags)",
                                "Calculate metadata hash for integrity",
                                "Return structured JSON"
                            ]}
                        />
                        <ModuleCard
                            title="String Extractor"
                            description="Finds hidden strings and patterns"
                            steps={[
                                "Read image as raw bytes",
                                "Extract strings (ASCII, UTF-8, UTF-16)",
                                "Apply regex patterns (URL, email, IP, hex)",
                                "Detect và validate base64 strings",
                                "Identify CTF flags, JWTs, API keys",
                                "Security analysis (keyword detection)",
                                "Return categorized findings"
                            ]}
                        />
                        <ModuleCard
                            title="Visual Analyzer"
                            description="Image analysis với computer vision"
                            steps={[
                                "Load image as NumPy array",
                                "Channel decomposition (R, G, B, Alpha)",
                                "Extract 8 bit planes per channel",
                                "Perform channel operations (XOR, ADD, SUB)",
                                "Calculate histograms for each channel",
                                "Anomaly detection (entropy, correlation)",
                                "Convert results to base64 PNGs"
                            ]}
                        />
                        <ModuleCard
                            title="LSB Analyzer"
                            description="Least Significant Bit extraction"
                            steps={[
                                "Parse configuration (channels, bits, order)",
                                "Extract LSB/MSB bits từ pixels",
                                "Convert bits to bytes",
                                "File signature detection (ZIP, PNG, PDF...)",
                                "Attempt text decoding (multi-encoding)",
                                "Entropy analysis for randomness",
                                "Save extracted file với unique ID"
                            ]}
                        />
                    </div>
                </div>

                {/* Technology Details */}
                <div className="bg-white rounded-xl p-8 shadow-lg mb-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Technology Deep Dive</h2>
                    <div className="space-y-6">
                        <TechSection
                            title="Deep Learning Stack"
                            items={[
                                { name: "TensorFlow 2.16.1", desc: "Core ML framework với Keras API" },
                                { name: "NumPy 1.26.3", desc: "Numerical operations và array manipulation" },
                                { name: "Model Architectures", desc: "CNN, MobileNetV2, ResNet50, VGG16 với transfer learning" },
                                { name: "Custom Layers", desc: "HPF preprocessing layer sử dụng Conv2D với fixed kernels" },
                                { name: "Training", desc: "Adam optimizer, categorical crossentropy, batch size 32" }
                            ]}
                        />
                        <TechSection
                            title="Image Processing"
                            items={[
                                { name: "Pillow 10.2.0", desc: "Image loading, format conversion, EXIF extraction" },
                                { name: "OpenCV 4.11", desc: "Advanced image operations, color space conversion" },
                                { name: "piexif", desc: "Detailed EXIF metadata parsing" },
                                { name: "NumPy", desc: "Fast array operations cho bit manipulation" },
                                { name: "scipy", desc: "Statistical analysis, entropy calculation" }
                            ]}
                        />
                        <TechSection
                            title="Web Framework"
                            items={[
                                { name: "FastAPI", desc: "Async REST API với automatic OpenAPI documentation" },
                                { name: "Uvicorn", desc: "ASGI server với hot-reload support" },
                                { name: "Pydantic", desc: "Data validation và serialization" },
                                { name: "python-multipart", desc: "File upload handling" },
                                { name: "CORS Middleware", desc: "Cross-origin requests từ React frontend" }
                            ]}
                        />
                    </div>
                </div>

                {/* Security Considerations */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Security & Best Practices</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <h3 className="font-bold text-green-900 mb-3">Implemented</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                                    File size limits (20MB frontend, configurable backend)
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                                    EXIF tag whitelisting để prevent metadata injection
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                                    Path traversal prevention trong file operations
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                                    Input validation với comprehensive error handling
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                                    Temporary file cleanup after downloads
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                                    Logging for audit trails
                                </li>
                            </ul>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <h3 className="font-bold text-yellow-900 mb-3">Future Enhancements</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>• Authentication & authorization system</li>
                                <li>• Rate limiting API endpoints</li>
                                <li>• Encrypted storage cho uploaded files</li>
                                <li>• API key management</li>
                                <li>• Advanced logging với ELK stack</li>
                                <li>• Container security với Docker</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Components
function ArchitectureLayer({ title, icon: Icon, color, components }) {
    const colors = {
        blue: 'from-blue-50 to-blue-100 border-blue-200',
        cyan: 'from-cyan-50 to-cyan-100 border-cyan-200'
    };

    return (
        <div className={`bg-gradient-to-r ${colors[color]} border rounded-lg p-6`}>
            <div className="flex items-center mb-4">
                <Icon className="w-8 h-8 text-gray-700 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            </div>
            <ul className="space-y-2">
                {components.map((comp, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        {comp}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ArrowDown() {
    return (
        <div className="flex justify-center">
            <div className="w-0.5 h-8 bg-gradient-to-b from-blue-300 to-cyan-300" />
        </div>
    );
}

function WorkflowStep({ number, title, description, technical }) {
    return (
        <div className="flex">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white flex items-center justify-center font-bold text-lg">
                {number}
            </div>
            <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="text-gray-700 mb-2">{description}</p>
                <p className="text-sm text-gray-600 bg-gray-50 rounded p-3 font-mono hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    {technical}
                </p>
            </div>
        </div>
    );
}

function ModuleCard({ title, description, steps }) {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">{description}</p>
            <ol className="space-y-2 text-sm text-gray-700">
                {steps.map((step, idx) => (
                    <li key={idx} className="flex items-start">
                        <span className="font-semibold text-blue-600 mr-2">{idx + 1}.</span>
                        {step}
                    </li>
                ))}
            </ol>
        </div>
    );
}

function TechSection({ title, items }) {
    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="space-y-3">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-start bg-gray-50 rounded p-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <span className="font-semibold text-gray-900">{item.name}:</span>
                            <span className="text-gray-700 ml-2">{item.desc}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
