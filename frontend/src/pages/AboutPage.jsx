/**
 * About Page - Full Page Version
 * Comprehensive information about the system
 */

import React from 'react';
import { Shield, CheckCircle, Cpu, Database, Zap, Users, Award, Target, Layers } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-white mb-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-6">
                            <Shield className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-bold mb-2">Steganalysis Pro</h1>
                            <p className="text-xl text-blue-100">Advanced AI-Powered Steganography Detection & Forensics Platform</p>
                        </div>
                    </div>
                    <p className="text-lg text-blue-50 leading-relaxed">
                        Công cụ phát hiện steganography và phân tích forensics toàn diện, kết hợp
                        Deep Learning tiên tiến với các kỹ thuật phân tích hình ảnh chuyên sâu.
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center mb-4">
                            <Target className="w-8 h-8 text-blue-600 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">Mission</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            Cung cấp giải pháp phát hiện steganography chính xác và đáng tin cậy nhất
                            cho cộng đồng An ninh mạng, CTF players, và Digital Forensics investigators.
                            Chúng tôi cam kết phát triển công nghệ AI tiên tiến để bảo vệ thông tin và
                            phát hiện các mối đe dọa ẩn giấu.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center mb-4">
                            <Award className="w-8 h-8 text-cyan-600 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900">Vision</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            Trở thành nền tảng phân tích steganography hàng đầu toàn cầu, được tin dùng
                            bởi các chuyên gia bảo mật, researchers, và tổ chức giáo dục. Xây dựng một
                            hệ sinh thái open-source mạnh mẽ phục vụ cộng đồng nghiên cứu An ninh mạng.
                        </p>
                    </div>
                </div>

                {/* Key Features */}
                <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Features</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Zap}
                            title="AI Detection"
                            description="5 mô hình Deep Learning tiên tiến (CNN, MobileNetV2, ResNet50, VGG16) với HPF preprocessing"
                            badge="AI Powered"
                        />
                        <FeatureCard
                            icon={Database}
                            title="Metadata Analysis"
                            description="Trích xuất toàn bộ EXIF, GPS, camera info, phát hiện patterns đáng ngờ trong metadata"
                            badge="50+ EXIF tags"
                        />
                        <FeatureCard
                            icon={Cpu}
                            title="String Extraction"
                            description="Phát hiện URL, email, base64, hex, CTF flags với multi-encoding support"
                            badge="7 pattern types"
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Visual Analysis"
                            description="Channel decomposition, 8-level bit plane extraction, anomaly detection"
                            badge="Entropy analysis"
                        />
                        <FeatureCard
                            icon={Layers}
                            title="LSB Extraction"
                            description="Configurable LSB/MSB extraction, file type detection, text decoding"
                            badge="1-8 bits/channel"
                        />
                        <FeatureCard
                            icon={Users}
                            title="User-Friendly"
                            description="Giao diện trực quan, responsive design, real-time analysis, toast notifications"
                            badge="Professional UI/UX"
                        />
                    </div>
                </div>

                {/* AI Models */}
                <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">AI Models & Technology</h2>
                    <div className="space-y-4">
                        <ModelRow
                            name="ResNet50 (HPF Enabled)"
                            description="Residual Network với 50 layers, sử dụng HPF preprocessing"
                        />
                        <ModelRow
                            name="MobileNetV2 (HPF Enabled)"
                            description="Lightweight model tối ưu cho real-time detection"
                        />
                        <ModelRow
                            name="VGG16 (HPF Enabled)"
                            description="Deep network với 16 layers, stable và reliable"
                        />
                        <ModelRow
                            name="MobileNetV2 (HPF Disabled)"
                            description="Baseline model không sử dụng preprocessing"
                        />
                        <ModelRow
                            name="Baseline CNN"
                            description="Custom CNN architecture cho training từ scratch"
                        />
                    </div>
                    <p className="text-sm text-gray-600 mt-6">
                        * HPF (High-Pass Filter) là kỹ thuật preprocessing giúp model tập trung vào
                        high-frequency components của ảnh, nơi thường chứa dấu hiệu steganography.
                    </p>
                </div>

                {/* Technology Stack */}
                <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Technology Stack</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Frontend</h3>
                            <TechList items={[
                                "React 18.2.0 - UI Framework",
                                "Vite 5.1.4 - Build Tool",
                                "Tailwind CSS 3.4.1 - Styling",
                                "Lucide React - Icons",
                                "Axios - HTTP Client"
                            ]} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Backend</h3>
                            <TechList items={[
                                "FastAPI - REST API Framework",
                                "TensorFlow 2.16.1 - Deep Learning",
                                "NumPy - Numerical Computing",
                                "OpenCV - Image Processing",
                                "Pillow - Image Manipulation"
                            ]} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">AI/ML</h3>
                            <TechList items={[
                                "Keras - Model Building",
                                "MobileNetV2 - Transfer Learning",
                                "ResNet50 - Deep Residual Network",
                                "VGG16 - Classic CNN",
                                "Custom HPF Layer - Preprocessing"
                            ]} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Forensics</h3>
                            <TechList items={[
                                "python-magic - File Type Detection",
                                "chardet - Encoding Detection",
                                "piexif - EXIF Parsing",
                                "scipy - Entropy Calculation",
                                "hashlib - Hash Computing"
                            ]} />
                        </div>
                    </div>
                </div>

                {/* Use Cases */}
                <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Use Cases</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <UseCaseCard
                            title="CTF Competitions"
                            description="Phát hiện hidden flags, extract embedded files, phân tích stego challenges"
                            icon="🏆"
                        />
                        <UseCaseCard
                            title="Digital Forensics"
                            description="Điều tra hình ảnh, timeline reconstruction, evidence extraction"
                            icon="🔍"
                        />
                        <UseCaseCard
                            title="Security Research"
                            description="Phân tích malware payloads, detect C2 communication, research stego techniques"
                            icon="🛡️"
                        />
                        <UseCaseCard
                            title="Academic Research"
                            description="Nghiên cứu steganography algorithms, dataset creation, model training"
                            icon="📚"
                        />
                        <UseCaseCard
                            title="Corporate Security"
                            description="Data leak prevention, insider threat detection, compliance monitoring"
                            icon="🏢"
                        />
                        <UseCaseCard
                            title="Education & Training"
                            description="Cybersecurity education, hands-on labs, student projects"
                            icon="🎓"
                        />
                    </div>
                </div>

                {/* Team & Credits */}
                <div className="bg-white rounded-xl p-8 shadow-lg">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Development & Credits</h2>
                    <div className="prose max-w-none text-gray-700">
                        <p className="mb-4">
                            <strong>Developed by:</strong> ... - Student at University of Information Technology (UIT)
                        </p>
                        <p className="mb-4">
                            <strong>Supervisor:</strong> [Tên giảng viên hướng dẫn]
                        </p>
                        <p className="mb-4">
                            <strong>Project Type:</strong> Graduation Thesis (Đồ án tốt nghiệp)
                        </p>
                        <p className="mb-4">
                            <strong>Duration:</strong> [Thời gian thực hiện]
                        </p>
                        <p className="mb-6">
                            <strong>Version:</strong> 1.0.0 | <strong>Last Updated:</strong> December 2025
                        </p>

                        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Acknowledgments</h3>
                            <ul className="list-disc list-inside space-y-2">
                                <li>University of Information Technology (UIT) - VNU-HCM</li>
                                <li>Faculty of Information Security</li>
                                <li>Open-source community (TensorFlow, React, FastAPI)</li>
                                <li>CTF community for testing and feedback</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Components
function FeatureCard({ icon: Icon, title, description, badge }) {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-100 hover-lift">
            <div className="flex items-center mb-3">
                <Icon className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="font-bold text-gray-900">{title}</h3>
            </div>
            <p className="text-sm text-gray-700 mb-3">{description}</p>
            <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                {badge}
            </span>
        </div>
    );
}

function ModelRow({ name, description }) {
    return (
        <div className="p-4 bg-gray-50 rounded-lg hover-lift">
            <h4 className="font-semibold text-gray-900 mb-1">{name}</h4>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
}

function TechList({ items }) {
    return (
        <ul className="space-y-2">
            {items.map((item, idx) => (
                <li key={idx} className="flex items-start text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                </li>
            ))}
        </ul>
    );
}

function UseCaseCard({ title, description, icon }) {
    return (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200 hover-lift">
            <div className="text-4xl mb-3">{icon}</div>
            <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
}
