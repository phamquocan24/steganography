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
        { id: 'ai-detection', label: 'Phát hiện AI', icon: Zap },
        { id: 'metadata', label: 'Phân tích Metadata', icon: Database },
        { id: 'strings', label: 'Trích xuất chuỗi', icon: Search },
        { id: 'visual', label: 'Phân tích trực quan', icon: Image },
        { id: 'superimposed', label: 'Phân tích chồng lớp', icon: Layers },
        { id: 'lsb', label: 'Trích xuất LSB', icon: Binary },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
            <div className="max-w-7xl mx-auto py-12 px-4">
                {/* Hero */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-white mb-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center mb-4">
                        <Book className="w-12 h-12 mr-4" />
                        <div>
                            <h1 className="text-5xl font-bold mb-2">Hướng dẫn Người dùng & Tài liệu</h1>
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
                            <h3 className="font-bold text-gray-900 mb-4">Mục lục</h3>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Bắt đầu</h2>

            <div className="bg-blue-50 rounded-lg p-6 mb-6 border-l-4 border-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Chào mừng!</h3>
                <p className="text-gray-700">
                    Steganalysis Pro là nền tảng phát hiện steganography và phân tích forensics toàn diện.
                    Hướng dẫn này sẽ giúp bạn sử dụng hiệu quả tất cả các tính năng.
                </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Hướng dẫn từng bước</h3>

            <Step number={1} title="Tải ảnh lên">
                <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
                    <li>Nhấp vào khu vực "Tải ảnh lên" để chọn tệp</li>
                    <li>Hoặc kéo & thả ảnh trực tiếp vào khung</li>
                    <li>Định dạng hỗ trợ: PNG, JPEG, BMP, GIF</li>
                    <li>Kích thước tối đa: 20MB</li>
                    <li>Bản xem trước sẽ hiện ngay sau khi tải lên</li>
                </ul>
            </Step>

            <Step number={2} title="Chọn loại phân tích">
                <div className="mt-3 space-y-3">
                    <div className="bg-gray-50 rounded p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <strong className="text-cyan-600">Phát hiện AI:</strong>
                        <p className="text-sm text-gray-700 mt-1">
                            Sử dụng các mô hình học sâu để phát hiện steganography. Nhanh và chính xác cao.
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <strong className="text-cyan-600">Phân tích điều tra số (Forensics):</strong>
                        <p className="text-sm text-gray-700 mt-1">
                            Phân tích chi tiết với 4 mô-đun: Metadata, Chuỗi ký tự, Trực quan, LSB. Cung cấp thông tin chuyên sâu.
                        </p>
                    </div>
                </div>
            </Step>

            <Step number={3} title="Xem kết quả">
                <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
                    <li>Phát hiện AI: Xem dự đoán (Có tin giấu/Ảnh sạch) và điểm tin cậy</li>
                    <li>Điều tra số: Chuyển qua các tab để xem từng loại phân tích</li>
                    <li>Tải xuống các tệp đã trích xuất nếu có</li>
                    <li>Kiểm tra lịch sử để xem lại các lần phân tích trước</li>
                </ul>
            </Step>

            <div className="bg-yellow-50 rounded-lg p-6 mt-8 border-l-4 border-yellow-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start">
                    <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-yellow-900 mb-2">Mẹo chuyên nghiệp</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-yellow-900">
                            <li>Sử dụng "Phân tích tất cả" trong phần Điều tra số để chạy tất cả các mô-đun cùng lúc</li>
                            <li>Trích xuất LSB hoạt động tốt nhất với ảnh PNG</li>
                            <li>Kiểm tra siêu dữ liệu trước khi trích xuất chuỗi để tìm manh mối</li>
                            <li>Phân tích trực quan rất hữu ích cho các kỹ thuật steganography mức thấp</li>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Mô-đun Phát hiện AI</h2>

            <p className="text-gray-700 mb-6">
                Phát hiện AI sử dụng 5 mô hình học sâu đã được huấn luyện để phát hiện steganography
                trong ảnh với độ chính xác cao.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Các mô hình khả dụng</h3>

            <ModelCard
                name="ResNet50 (Bật HPF)"
                description="Mô hình mạnh nhất với mạng residual 50 lớp. Sử dụng tiền xử lý HPF để tăng độ chính xác. Khuyên dùng cho sử dụng thực tế."
                useCases={["Cuộc thi CTF", "Phân tích quan trọng", "Dự án nghiên cứu"]}
            />

            <ModelCard
                name="MobileNetV2 (Bật HPF)"
                description="Mô hình nhẹ tối ưu tốc độ. Vẫn giữ độ chính xác cao nhờ HPF. Tốt cho phân tích thời gian thực."
                useCases={["Quét nhanh", "Xử lý hàng loạt", "Triển khai di động"]}
            />

            <ModelCard
                name="VGG16 (Bật HPF)"
                description="Mạng sâu cổ điển, ổn định và đáng tin cậy. Cân bằng tốt giữa độ chính xác và sự ổn định."
                useCases={["Mục đích chung", "Dự đoán ổn định", "Sử dụng giáo dục"]}
            />

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Cách sử dụng</h3>

            <GuideSteps>
                <li>Tải ảnh lên (khuyên dùng PNG, JPEG, BMP)</li>
                <li>Chọn mô hình từ danh sách (mặc định: ResNet50)</li>
                <li>Nhấp nút "Chạy phát hiện AI"</li>
                <li>Chờ kết quả (thường 1-3 giây)</li>
                <li>Xem dự đoán và điểm tin cậy</li>
            </GuideSteps>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Hiểu kết quả</h3>

            <ResultBox
                type="stego"
                interpretation="Mô hình phát hiện steganography với độ tin cậy cao. Khuyên nghị: Chạy phân tích điều tra số để trích xuất dữ liệu ẩn."
            />

            <ResultBox
                type="clean"
                interpretation="Ảnh có thể là ảnh sạch (không có steganography). Nhưng vẫn có thể kiểm tra forensics để xác minh thủ công."
            />

            <div className="bg-blue-50 rounded-lg p-6 mt-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    HPF là gì?
                </h4>
                <p className="text-sm text-blue-900 mb-2">
                    <strong>High-Pass Filter (HPF)</strong> là kỹ thuật tiền xử lý loại bỏ các thành phần tần số thấp
                    (nội dung ảnh) và giữ lại các thành phần tần số cao (nhiễu, kết cấu).
                </p>
                <p className="text-sm text-blue-900">
                    Steganography thường thay đổi các LSB, tạo ra nhiễu tần số cao. HPF giúp mô hình
                    "nhìn thấy" những thay đổi này rõ hơn, tăng độ chính xác đáng kể (5-8%).
                </p>
            </div>
        </div>
    );
}

function MetadataGuide() {
    return (
        <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Phân tích Metadata</h2>

            <p className="text-gray-700 mb-6">
                Metadata là thông tin "ẩn" trong tệp hình ảnh, bao gồm dữ liệu EXIF, tọa độ GPS, bình luận,
                và thông tin phần mềm. Kẻ tấn công thường giấu dữ liệu trong các trường này.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Dữ liệu được trích xuất?</h3>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <DataTypeCard
                    title="Thông tin cơ bản"
                    items={["Định dạng tệp", "Kích thước (rộng × cao)", "Chế độ màu (RGB, thang độ xám)", "Dung lượng tệp"]}
                />
                <DataTypeCard
                    title="Dữ liệu EXIF"
                    items={["Hãng & mẫu máy ảnh", "Thời gian chụp", "Thiết lập phơi sáng (ISO, tốc độ, khẩu độ)", "Phần mềm sử dụng"]}
                />
                <DataTypeCard
                    title="Tọa độ GPS"
                    items={["Vĩ độ & kinh độ", "Độ cao", "Mốc thời gian", "Liên kết Google Maps"]}
                />
                <DataTypeCard
                    title="Bình luận & Trường tùy chỉnh"
                    items={["Bình luận người dùng", "Thông tin nghệ sĩ", "Bản quyền", "Trường metadata tùy chỉnh"]}
                />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Phát hiện mẫu đáng ngờ</h3>

            <p className="text-gray-700 mb-4">
                Hệ thống tự động phát hiện các mẫu đáng ngờ:
            </p>

            <SuspiciousPatternList>
                <li><strong>Bình luận dài:</strong> Bình luận &gt; 200 ký tự (có thể chứa dữ liệu mã hóa)</li>
                <li><strong>Cờ CTF:</strong> Các mẫu như CTF{"{"}, FLAG{"{"}, flag{"{"}</li>
                <li><strong>URLs:</strong> Liên kết ẩn trong metadata</li>
                <li><strong>Chuỗi Base64:</strong> Dữ liệu mã hóa trong bình luận/mô tả</li>
                <li><strong>Metadata quá nhiều:</strong> Quá nhiều trường tùy chỉnh (&gt;30)</li>
            </SuspiciousPatternList>

            <div className="bg-green-50 rounded-lg p-6 mt-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h4 className="font-bold text-green-900 mb-3">✅ Thực tiễn tốt nhất</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-green-900">
                    <li>Luôn kiểm tra tab GPS - kẻ tấn công thường giấu tọa độ</li>
                    <li>Đọc kỹ tất cả bình luận</li>
                    <li>Đối chiếu thông tin máy ảnh với nội dung ảnh</li>
                    <li>Kiểm tra tên phần mềm bất thường</li>
                    <li>Xuất metadata để làm tài liệu</li>
                </ul>
            </div>
        </div>
    );
}

function StringsGuide() {
    return (
        <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Trích xuất chuỗi ký tự</h2>

            <p className="text-gray-700 mb-6">
                Trích xuất chuỗi đọc tệp hình ảnh dưới dạng byte thô và tìm kiếm các chuỗi văn bản có thể đọc được.
                Rất hiệu quả cho steganography văn bản thuần túy và tin nhắn nhúng.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Bảng mã hỗ trợ</h3>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
                <EncodingCard name="ASCII" desc="Ký tự 7-bit chuẩn (a-z, 0-9)" />
                <EncodingCard name="UTF-8" desc="Bảng mã phổ biến, hỗ trợ emoji, tiếng Việt" />
                <EncodingCard name="UTF-16" desc="Bảng mã 16-bit, thường dùng bởi Windows" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Khớp mẫu</h3>

            <p className="text-gray-700 mb-4">
                Hệ thống tự động phát hiện 7 loại mẫu:
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

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Tự động giải mã Base64</h3>

            <p className="text-gray-700 mb-4">
                Khi phát hiện chuỗi base64, hệ thống tự động thử giải mã và hiển thị:
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

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Tìm kiếm & Lọc</h3>

            <GuideSteps>
                <li>Sử dụng hộp tìm kiếm để tìm chuỗi cụ thể</li>
                <li>Lọc theo bảng mã (ASCII, UTF-8, Tất cả)</li>
                <li>Chuyển đổi giữa "Xem theo mẫu" và "Chuỗi thô"</li>
                <li>Nhấp vào chuỗi để xem ngữ cảnh</li>
                <li>Sao chép kết quả để làm tài liệu</li>
            </GuideSteps>
        </div>
    );
}

function VisualGuide() {
    return (
        <div className="prose max-w-none">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Phân tích trực quan</h2>

            <p className="text-gray-700 mb-6">
                Phân tích trực quan sử dụng các kỹ thuật thị giác máy tính để phân tích hình ảnh ở mức thấp,
                tiết lộ các mẫu ẩn mà mắt thường không thấy được.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Phân tách kênh màu</h3>

            <p className="text-gray-700 mb-4">
                Tách hình ảnh thành các kênh màu riêng biệt:
            </p>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
                <ChannelCard name="Đỏ (Red)" color="bg-red-100 text-red-700" />
                <ChannelCard name="Lục (Green)" color="bg-green-100 text-green-700" />
                <ChannelCard name="Lam (Blue)" color="bg-blue-100 text-blue-700" />
                <ChannelCard name="Alpha" color="bg-gray-100 text-gray-700" />
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <strong className="text-blue-900">Tại sao điều này quan trọng:</strong>
                <p className="text-sm text-blue-900 mt-2">
                    Steganography thường chỉ chỉnh sửa một kênh cụ thể. Phân tách giúp xác định
                    kênh nào có bất thường.
                </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Trích xuất Bit Plane</h3>

            <p className="text-gray-700 mb-4">
                Mỗi pixel có 8 bit (0-7). Trích xuất bit plane hiển thị trực quan từng mức bit:
            </p>

            <BitPlaneExplanation />

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Phát hiện bất thường</h3>

            <p className="text-gray-700 mb-4">
                Hệ thống tự động phát hiện 3 loại bất thường:
            </p>

            <AnomalyList>
                <li>
                    <strong>Entropy LSB cao:</strong> Các lớp LSB có độ ngẫu nhiên cao (entropy &gt; 0.95)
                    → Khả năng có steganography
                </li>
                <li>
                    <strong>Mẫu LSB không ngẫu nhiên:</strong> LSB không ngẫu nhiên nhưng có các mẫu
                    → Dữ liệu ẩn có cấu trúc
                </li>
                <li>
                    <strong>Tương quan kênh thấp:</strong> Các kênh không tương quan bình thường
                    → Chỉnh sửa thủ công
                </li>
            </AnomalyList>

            <div className="bg-yellow-50 rounded-lg p-6 mt-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h4 className="font-bold text-yellow-900 mb-3 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Hướng dẫn diễn giải
                </h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-yellow-900">
                    <li>Cảnh báo xanh = Mẫu bình thường, rủi ro thấp</li>
                    <li>Cảnh báo vàng = Bất thường trung bình, đáng để điều tra</li>
                    <li>Cảnh báo đỏ = Dấu hiệu mạnh, độ tin cậy stego cao</li>
                    <li>Kiểm tra các gai biểu đồ histogram để tìm sự thao túng LSB</li>
                </ul>
            </div>
        </div>
    );
}

function SuperimposedGuide() {
    return (
        <div className="prose max-w-none">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Phân tích chồng lớp</h2>

            <div className="bg-cyan-50 rounded-lg p-6 mb-6 border-l-4 border-cyan-600">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <Layers className="w-6 h-6 mr-2 text-cyan-600" />
                    Phân tích chồng lớp là gì?
                </h3>
                <p className="text-gray-700">
                    Phân tích chồng lớp phủ (chồng) nhiều kênh màu hoặc các bit plane lại với nhau
                    để phát hiện các mẫu ẩn mà không thể thấy khi xem riêng lẻ từng thành phần.
                </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Cách hoạt động</h3>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 hover-lift">
                    <h4 className="font-bold text-blue-900 mb-2">Chồng lớp kênh màu</h4>
                    <p className="text-sm text-gray-700">
                        Kết hợp nhiều kênh màu (R, G, B) thành một ảnh duy nhất bằng các chế độ hòa trộn
                        như trung bình, tối đa, hoặc XOR.
                    </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 hover-lift">
                    <h4 className="font-bold text-purple-900 mb-2">Chồng lớp Bit Plane</h4>
                    <p className="text-sm text-gray-700">
                        Phủ nhiều bit plane (0-7) để tạo ảnh kết hợp từ các lớp LSB hoặc MSB,
                        tiết lộ các mẫu dữ liệu ẩn.
                    </p>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Cấu hình</h3>

            <ConfigOption
                name="Chế độ phân tích"
                description="Chọn nội dung để phân tích"
                options={['Chỉ kênh màu', 'Chỉ Bit Planes', 'Cả hai (Khuyên dùng)']}
            />

            <ConfigOption
                name="Kênh cần chồng lớp"
                description="Chọn các kênh màu"
                options={['R (Đỏ)', 'G (Lục)', 'B (Lam)', 'Tất cả RGB']}
            />

            <ConfigOption
                name="Bit Planes"
                description="Chọn vị trí bit (0=LSB, 7=MSB)"
                options={['0-2 (LSB - khuyên dùng)', '3-5 (Mid planes)', '6-7 (MSB)']}
            />

            <ConfigOption
                name="Chế độ hòa trộn (Blend Mode)"
                description="Cách kết hợp các lớp"
                options={[
                    'Trung bình - Trung bình cộng của tất cả',
                    'Tối đa - Giá trị lớn nhất',
                    'XOR - Bitwise XOR (phát hiện sự khác biệt)'
                ]}
            />

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Hiểu kết quả</h3>

            <ResultsGuide>
                <ResultItem
                    title="Ảnh chồng lớp kênh màu"
                    description="Xem ảnh kết hợp từ R+G+B hoặc các tổ hợp khác. Tìm các mẫu hiển thị, văn bản, hoặc hình mờ."
                />
                <ResultItem
                    title="Lớp phủ Bit Plane"
                    description="Ảnh kết hợp từ nhiều bit plane. Các tổ hợp LSB thường tiết lộ dữ liệu ẩn."
                />
                <ResultItem
                    title="Phân tích kết hợp"
                    description="Khi chọn 'Cả hai', xem tổng hợp từ tất cả các lớp RGB LSB để phát hiện giấu tin đa lớp."
                />
            </ResultsGuide>

            <div className="bg-yellow-50 rounded-lg p-6 mt-6 border-l-4 border-yellow-600">
                <h4 className="font-bold text-yellow-900 mb-2 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Mẹo chuyên nghiệp
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                    <li>Bắt đầu với chế độ "Cả hai" và các lớp LSB (0-2) để phát hiện tổng quát</li>
                    <li>Sử dụng chế độ hòa trộn XOR để làm nổi bật sự khác biệt giữa các kênh</li>
                    <li>Tìm mã QR, văn bản, hoặc các mẫu hình học trong ảnh kết hợp</li>
                    <li>So sánh với kết quả Phân tích trực quan để hiểu cấu trúc lớp</li>
                    <li>Các kỹ thuật giấu tin đa kênh sẽ lộ ra các mẫu khi chồng lớp</li>
                </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-6 mt-6 border-l-4 border-green-600">
                <h4 className="font-bold text-green-900 mb-2">Trường hợp sử dụng</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                    <li><strong>Phát hiện hình mờ:</strong> Hình mờ ẩn trên nhiều kênh</li>
                    <li><strong>Thử thách CTF:</strong> Cờ được nhúng bằng kỹ thuật đa lớp</li>
                    <li><strong>Điều tra số:</strong> Phát hiện các phương pháp steganography tinh vi</li>
                    <li><strong>Nghiên cứu:</strong> Phân tích các thuật toán giấu tin tiên tiến</li>
                </ul>
            </div>
        </div>
    );
}

function LSBGuide() {
    return (
        <div className="prose max-w-none">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Trích xuất LSB</h2>

            <p className="text-gray-700 mb-6">
                Trích xuất LSB (Least Significant Bit) đọc các bit thấp nhất của giá trị pixel để trích xuất
                dữ liệu ẩn. Kỹ thuật steganography phổ biến nhất.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Tùy chọn cấu hình</h3>

            <ConfigOption
                name="Kênh"
                description="Trích xuất từ kênh màu nào"
                options={["RGB (Tất cả kênh)", "R (Chỉ Đỏ)", "G (Chỉ Lục)", "B (Chỉ Lam)", "RG, RB, GB (Kết hợp)"]}
            />

            <ConfigOption
                name="Thứ tự Bit"
                description="Trích xuất từ bit thấp nhất hay cao nhất"
                options={["LSB (Bit trọng số thấp nhất) - Phổ biến nhất", "MSB (Bit trọng số cao nhất) - Ít phổ biến"]}
            />

            <ConfigOption
                name="Số Bit trên mỗi kênh"
                description="Số bit trích xuất trên mỗi kênh (1-8)"
                options={["1 bit: Tinh vi, ít dữ liệu", "2-3 bits: Cân bằng", "4+ bits: Biến dạng rõ, nhiều dữ liệu"]}
            />

            <ConfigOption
                name="Dung lượng tối đa"
                description="Dữ liệu tối đa để trích xuất (giới hạn an toàn)"
                options={["256 KB - Kiểm tra nhanh", "1 MB - Tiêu chuẩn", "5+ MB - Trích xuất sâu"]}
            />

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Hiểu kết quả</h3>

            <ResultsGuide>
                <ResultItem
                    title="Điểm tin cậy"
                    description="Điểm 0-100 dựa trên chữ ký tệp, phát hiện văn bản, entropy. >60 = Có khả năng chứa dữ liệu."
                />
                <ResultItem
                    title="Phát hiện loại tệp"
                    description="Hệ thống kiểm tra magic bytes để xác định loại tệp (ZIP, PNG, PDF, v.v.)"
                />
                <ResultItem
                    title="Giải mã văn bản"
                    description="Thử giải mã dưới dạng văn bản trong nhiều bảng mã (UTF-8, ASCII, Latin-1)"
                />
                <ResultItem
                    title="Phân tích Entropy"
                    description="Đo độ ngẫu nhiên. Entropy cao = dữ liệu mã hóa/nén."
                />
            </ResultsGuide>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Thực tiễn tốt nhất</h3>

            <div className="bg-green-50 rounded-lg p-6 mb-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h4 className="font-bold text-green-900 mb-3">✅ Quy trình đề xuất</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-green-900">
                    <li>Bắt đầu với kênh RGB, LSB, 1 bit mỗi kênh</li>
                    <li>Nếu không phát hiện gì, thử từng kênh riêng lẻ (R, G, B)</li>
                    <li>Tăng số bit mỗi kênh nếu cần thêm dữ liệu</li>
                    <li>Thử MSB nếu LSB thất bại</li>
                    <li>Luôn tải xuống tệp đã trích xuất để xác minh</li>
                    <li>Kiểm tra entropy - entropy cao = có khả năng là dữ liệu có ý nghĩa</li>
                </ol>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <strong className="text-blue-900">💡 Mẹo chuyên nghiệp:</strong>
                <p className="text-sm text-blue-900 mt-2">
                    Phân tích trực quan trước để xác định các kênh đáng ngờ, sau đó nhắm mục tiêu trích xuất LSB
                    vào kênh đó. Tiết kiệm thời gian và tăng tỷ lệ thành công.
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

function ModelCard({ name, description, useCases }) {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 mb-4 border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-gray-900 text-lg">{name}</h4>
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

function ResultBox({ type, interpretation }) {
    const isStego = type === 'stego';
    return (
        <div className={`rounded-lg p-6 mb-4 border-2 ${isStego ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex justify-between items-center mb-3">
                <span className={`font-bold text-lg ${isStego ? 'text-red-700' : 'text-green-700'}`}>
                    Dự đoán: {isStego ? 'PHÁT HIỆN GIẤU TIN' : 'ẢNH SẠCH'}
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
