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
                            <p className="text-xl text-blue-100">Nền tảng phát hiện Giấu tin & Điều tra số hỗ trợ bởi AI tiên tiến</p>
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
                            <h2 className="text-2xl font-bold text-gray-900">Sứ mệnh</h2>
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
                            <h2 className="text-2xl font-bold text-gray-900">Tầm nhìn</h2>
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Tính năng chính</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Zap}
                            title="Phát hiện bằng AI"
                            description="5 mô hình Deep Learning tiên tiến (CNN, MobileNetV2, ResNet50, VGG16) với tiền xử lý HPF"
                            badge="Hỗ trợ AI"
                        />
                        <FeatureCard
                            icon={Database}
                            title="Phân tích Metadata"
                            description="Trích xuất toàn bộ EXIF, GPS, thông tin camera, phát hiện mẫu đáng ngờ trong metadata"
                            badge="50+ thẻ EXIF"
                        />
                        <FeatureCard
                            icon={Cpu}
                            title="Trích xuất chuỗi ký tự"
                            description="Phát hiện URL, email, base64, hex, cờ CTF với hỗ trợ đa mã hóa"
                            badge="7 loại mẫu"
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Phân tích trực quan"
                            description="Phân tách kênh màu, trích xuất 8 bit-plane, phát hiện bất thường"
                            badge="Phân tích Entropy"
                        />
                        <FeatureCard
                            icon={Layers}
                            title="Trích xuất LSB"
                            description="Trích xuất LSB/MSB có cấu hình, phát hiện loại tệp, giải mã văn bản"
                            badge="1-8 bit/kênh"
                        />
                        <FeatureCard
                            icon={Users}
                            title="Thân thiện người dùng"
                            description="Giao diện trực quan, thiết kế responsive, phân tích thời gian thực, thông báo toast"
                            badge="UI/UX Chuyên nghiệp"
                        />
                    </div>
                </div>

                {/* AI Models */}
                <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Mô hình AI & Công nghệ</h2>
                    <div className="space-y-4">
                        <ModelRow
                            name="ResNet50 (HPF Enabled)"
                            description="Mạng Residual với 50 lớp, sử dụng tiền xử lý HPF"
                        />
                        <ModelRow
                            name="MobileNetV2 (HPF Enabled)"
                            description="Mô hình nhẹ tối ưu cho phát hiện thời gian thực"
                        />
                        <ModelRow
                            name="VGG16 (HPF Enabled)"
                            description="Mạng sâu với 16 lớp, ổn định và đáng tin cậy"
                        />
                        <ModelRow
                            name="MobileNetV2 (HPF Disabled)"
                            description="Mô hình cơ sở không sử dụng tiền xử lý"
                        />
                        <ModelRow
                            name="Baseline CNN"
                            description="Kiến trúc CNN tùy chỉnh để huấn luyện từ đầu"
                        />
                    </div>
                    <p className="text-sm text-gray-600 mt-6">
                        * HPF (High-Pass Filter) là kỹ thuật tiền xử lý giúp mô hình tập trung vào
                        các thành phần tần số cao của ảnh, nơi thường chứa dấu hiệu giấu tin.
                    </p>
                </div>

                {/* Technology Stack */}
                <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Ngăn xếp Công nghệ</h2>
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Trường hợp sử dụng</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <UseCaseCard
                            title="Cuộc thi CTF"
                            description="Phát hiện cờ ẩn, trích xuất tệp nhúng, phân tích thử thách stego"
                            icon="🏆"
                        />
                        <UseCaseCard
                            title="Điều tra số (Digital Forensics)"
                            description="Điều tra hình ảnh, tái dựng dòng thời gian, trích xuất bằng chứng"
                            icon="🔍"
                        />
                        <UseCaseCard
                            title="Nghiên cứu bảo mật"
                            description="Phân tích tải trọng mã độc, phát hiện giao tiếp C2, nghiên cứu kỹ thuật giấu tin"
                            icon="🛡️"
                        />
                        <UseCaseCard
                            title="Nghiên cứu học thuật"
                            description="Nghiên cứu thuật toán giấu tin, tạo tập dữ liệu, huấn luyện mô hình"
                            icon="📚"
                        />
                        <UseCaseCard
                            title="Bảo mật doanh nghiệp"
                            description="Ngăn chặn rò rỉ dữ liệu, phát hiện mối đe dọa nội bộ, giám sát tuân thủ"
                            icon="🏢"
                        />
                        <UseCaseCard
                            title="Giáo dục & Đào tạo"
                            description="Giáo dục an ninh mạng, phòng thí nghiệm thực hành, dự án sinh viên"
                            icon="🎓"
                        />
                    </div>
                </div>

                {/* Team & Credits */}
                <div className="bg-white rounded-xl p-8 shadow-lg">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Phát triển & Ghi nhận</h2>
                    <div className="prose max-w-none text-gray-700">
                        <p className="mb-4">
                            <strong>Phát triển bởi:</strong> ... - Sinh viên Đại học Công nghệ Thông tin (UIT)
                        </p>
                        <p className="mb-4">
                            <strong>Giảng viên hướng dẫn:</strong> [Tên giảng viên hướng dẫn]
                        </p>
                        <p className="mb-4">
                            <strong>Loại dự án:</strong> Đồ án tốt nghiệp
                        </p>
                        <p className="mb-4">
                            <strong>Thời gian thực hiện:</strong> [Thời gian thực hiện]
                        </p>
                        <p className="mb-6">
                            <strong>Phiên bản:</strong> 1.0.0 | <strong>Cập nhật lần cuối:</strong> Tháng 3/2026
                        </p>

                        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Lời cảm ơn</h3>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Trường Đại Học An Ninh Nhân Dân - Bắc Ninh</li>
                                <li>Khoa An toàn thông tin</li>
                                <li>Cộng đồng mã nguồn mở (TensorFlow, React, FastAPI)</li>
                                <li>Cộng đồng CTF đã hỗ trợ thử nghiệm và phản hồi</li>
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
