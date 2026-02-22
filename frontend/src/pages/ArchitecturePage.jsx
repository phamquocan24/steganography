/**
 * Architecture Page - System Architecture & Workflow
 * Detailed technical documentation
 */

import React from 'react';
import { Server, Database, Cpu, Layers, Zap, Shield, CheckCircle, ArrowRight, Code, Image, Activity, Box, Globe, FileText, FileUp, Lock, Aperture, Workflow, Code2 } from 'lucide-react';

export default function ArchitecturePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Hero */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-white mb-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-6">
                            <Box className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-bold mb-2">Kiến trúc Hệ thống</h1>
                            <p className="text-xl text-blue-100">Kiến trúc kỹ thuật & Luồng dữ liệu</p>
                        </div>
                    </div>
                    <p className="text-lg text-blue-50 leading-relaxed">
                        Khám phá thiết kế kỹ thuật của Steganalysis Pro. Hệ thống của chúng tôi kết hợp mạng học sâu tiên tiến với các công cụ phân tích forensics truyền thống.
                    </p>
                </div>

                {/* High-Level Architecture Diagram */}
                <div className="bg-white rounded-xl p-8 shadow-lg mb-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <SectionTitle icon={Layers} title="Tổng quan" />

                    <p className="text-lg text-gray-700 leading-relaxed mb-8">
                        Hệ thống tuân theo <strong>Kiến trúc Microservices Hiện đại</strong>, tách biệt mối quan tâm
                        giữa giao diện người dùng, xử lý API và các công cụ phân tích chuyên sâu.
                        Thiết kế này đảm bảo khả năng mở rộng, khả năng bảo trì và khả năng triển khai các mô hình AI mới
                        mà không làm gián đoạn các dịch vụ cốt lõi.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 items-stretch mb-16">
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 h-full flex flex-col justify-center">
                            <h4 className="font-bold text-blue-900 mb-4 text-lg">Các thành phần chính:</h4>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                                    <div><strong>Frontend (React/Vite):</strong> Giao diện người dùng tương tác & Hiển thị</div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                                    <div><strong>Backend (FastAPI):</strong> Điều phối & Quản lý API</div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                                    <div><strong>AI Engine (TensorFlow):</strong> Suy luận Học sâu</div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                                    <div><strong>Forensics Core:</strong> Xử lý Tín hiệu & Thống kê</div>
                                </li>
                            </ul>
                        </div>

                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-50 blur-xl"></div>
                            <div className="relative w-full h-full min-h-[200px] bg-gray-900 rounded-xl shadow-2xl flex items-center justify-center text-white text-center p-6">
                                <span className="font-mono text-lg flex items-center flex-wrap justify-center gap-2">
                                    <span className="text-blue-300 font-bold">Frontend</span>
                                    <ArrowRight className="mx-1 text-gray-400" />
                                    <span className="text-green-300 font-bold">Backend API</span>
                                    <ArrowRight className="mx-1 text-gray-400" />
                                    <span className="text-purple-300 font-bold">AI/Forensics</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <SectionTitle icon={Cpu} title="Chi tiết Công nghệ (Tech Stack)" />

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                        <TechCard
                            title="Frontend Core"
                            items={["React 18", "Tailwind CSS", "Lucide Icons", "Recharts"]}
                            color="bg-blue-50"
                        />
                        <TechCard
                            title="Backend Services"
                            items={["Python 3.9", "FastAPI", "Uvicorn", "Pydantic"]}
                            color="bg-green-50"
                        />
                        <TechCard
                            title="AI & ML"
                            items={["TensorFlow 2.15", "Keras", "NumPy / SciPy", "OpenCV"]}
                            color="bg-purple-50"
                        />
                        <TechCard
                            title="Forensics Tools"
                            items={["Pillow (PIL)", "PieEXIF", "Python-Magic", "Custom LSB Algos"]}
                            color="bg-orange-50"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Kiến trúc Cấp cao</h2>
                    <div className="space-y-6">
                        <ArchitectureLayer
                            title="Lớp Trình bày (Frontend)"
                            icon={Layers}
                            color="blue"
                            components={[
                                "React 18.2.0 SPA với Vite bundler",
                                "UI phản hồi với Tailwind CSS",
                                "Quản lý trạng thái với React Hooks",
                                "Axios HTTP client cho các cuộc gọi API",
                                "Thông báo toast thời gian thực",
                                "Bộ nhớ cục bộ cho lịch sử"
                            ]}
                        />
                        <ArrowDown />
                        <ArchitectureLayer
                            title="Lớp API (Backend)"
                            icon={Server}
                            color="cyan"
                            components={[
                                "FastAPI REST endpoints",
                                "Xác thực yêu cầu với Pydantic",
                                "Cấu hình middleware CORS",
                                "Xử lý tải lên tệp (multipart/form-data)",
                                "Xử lý lỗi và ghi nhật ký",
                                "Định dạng phản hồi (JSON)"
                            ]}
                        />
                        <ArrowDown />
                        <ArchitectureLayer
                            title="Lớp Dịch vụ (Logic nghiệp vụ)"
                            icon={Cpu}
                            color="blue"
                            components={[
                                "Dịch vụ Mô hình - Phát hiện AI với 5 mô hình",
                                "Trình trích xuất siêu dữ liệu - Trích xuất EXIF/GPS",
                                "Trình trích xuất chuỗi - Khớp mẫu",
                                "Trình phân tích hình ảnh - Xử lý hình ảnh",
                                "Trình phân tích LSB - Trích xuất bit"
                            ]}
                        />
                        <ArrowDown />
                        <ArchitectureLayer
                            title="Lớp Dữ liệu (Lưu trữ)"
                            icon={Database}
                            color="cyan"
                            components={[
                                "Trọng số mô hình (.keras files) - 150-200 MB",
                                "Ảnh tạm thời đã tải lên",
                                "Bộ nhớ cache của các tệp đã trích xuất",
                                "LocalStorage Frontend - Lịch sử người dùng",
                                "Tệp nhật ký - Theo dõi lỗi"
                            ]}
                        />
                    </div>
                </div>

                {/* Analysis Workflow */}
                <div className="bg-white rounded-xl p-8 shadow-lg mb-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <SectionTitle icon={Workflow} title="Quy trình xử lý dữ liệu" />

                    <div className="relative ml-4 space-y-12 mb-20">
                        <WorkflowStep
                            number="1"
                            title="Nhập ảnh & Tiền xử lý"
                            description="Người dùng tải ảnh lên (PNG/JPEG/BMP). Hệ thống xác thực tệp, tạo mã băm (SHA-256) và chuẩn hóa kích thước/định dạng ảnh cho việc phân tích."
                        />
                        <WorkflowStep
                            number="2"
                            title="Phân tích song song"
                            description="Yêu cầu được gửi đến hai luồng song song: (1) Suy luận AI cho việc phát hiện xác suất và (2) Các mô-đun Forensics để trích xuất đặc trưng thủ công."
                        />
                        <WorkflowStep
                            number="3"
                            title="Tổng hợp kết quả & Phản hồi"
                            description="Kết quả từ tất cả các công cụ được tổng hợp thành định dạng JSON thống nhất. Frontend nhận dữ liệu và hiển thị các trực quan hóa tương tác theo thời gian thực."
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Quy trình phân tích</h2>
                    <div className="space-y-4">
                        <WorkflowStep
                            number={1}
                            title="Tải ảnh lên"
                            description="Người dùng tải ảnh lên qua kéo và thả hoặc chọn tệp"
                            technical="Frontend xác thực loại tệp, kích thước (<20MB), tạo bản xem trước, lưu trữ trong trạng thái"
                        />
                        <WorkflowStep
                            number={2}
                            title="Tiền xử lý"
                            description="Ảnh được chuẩn hóa và chuẩn bị cho phân tích"
                            technical="Thay đổi kích thước thành kích thước đầu vào mô hình (256x256), chuẩn hóa giá trị pixel (0-1), áp dụng HPF nếu được bật"
                        />
                        <WorkflowStep
                            number={3}
                            title="Phát hiện AI"
                            description="Các mô hình học sâu phân tích và dự đoán stego so với sạch"
                            technical="Chuyển tiếp qua các lớp CNN, kích hoạt softmax, tính toán điểm tin cậy"
                        />
                        <WorkflowStep
                            number={4}
                            title="Phân tích Forensics"
                            description="Kiểm tra toàn diện với 4 mô-đun song song hoặc tuần tự"
                            technical="Metadata: trích xuất piexif | Chuỗi: khớp regex | Hình ảnh: các phép toán numpy | LSB: thao tác bit"
                        />
                        <WorkflowStep
                            number={5}
                            title="Tổng hợp kết quả"
                            description="Kết quả từ các mô-đun được tổng hợp và định dạng"
                            technical="Định dạng phản hồi JSON, mã hóa base64 cho hình ảnh, tạo URL tải xuống tệp"
                        />
                        <WorkflowStep
                            number={6}
                            title="Trình bày"
                            description="UI hiển thị kết quả với trực quan hóa tương tác"
                            technical="Các thành phần React hiển thị dữ liệu, biểu đồ với biểu đồ tần suất, lightbox cho hình ảnh"
                        />
                    </div>
                </div>

                {/* AI Detection Pipeline */}
                <div className="bg-white rounded-xl p-8 shadow-lg mb-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <SectionTitle icon={Code2} title="Quy trình Phát hiện AI" />

                    <div className="bg-gray-900 rounded-xl p-8 text-blue-100 font-mono text-sm leading-relaxed overflow-x-auto shadow-2xl mb-12">
                        <div className="flex mb-4 text-xs text-gray-500 border-b border-gray-800 pb-2">
                            <span className="mr-8">PIPELINE CONFIG</span>
                            <span>MODEL: ResNet50_Custom</span>
                        </div>
                        <p><span className="text-purple-400">def</span> <span className="text-yellow-300">detect_steganography</span>(image_tensor):</p>
                        <p className="pl-4 text-gray-400"># Giai đoạn 1: Tiền xử lý HPF</p>
                        <p className="pl-4">residuals = <span className="text-blue-400">HighPassFilter</span>(image_tensor)</p>
                        <p className="pl-4 mb-2">features = <span className="text-blue-400">Normalize</span>(residuals)</p>

                        <p className="pl-4 text-gray-400"># Giai đoạn 2: Trích xuất đặc trưng sâu</p>
                        <p className="pl-4">deep_features = <span className="text-green-400">ResNet50_Backbone</span>(features)</p>
                        <p className="pl-4 mb-2">global_pool = <span className="text-green-400">GlobalAveragePooling2D</span>(deep_features)</p>

                        <p className="pl-4 text-gray-400"># Giai đoạn 3: Phân loại</p>
                        <p className="pl-4">probability = <span className="text-red-400">Sigmoid</span>(<span className="text-blue-400">Dense</span>(global_pool))</p>
                        <p className="pl-4 mt-2"><span className="text-purple-400">return</span> {"{"} <span className="text-green-300">"is_stego"</span>: probability &gt; 0.5, <span className="text-green-300">"confidence"</span>: probability {"}"}</p>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Quy trình phát hiện AI</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <h3 className="font-bold text-gray-900 mb-4">Không có HPF</h3>
                            <ol className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">1.</span>
                                    Tải ảnh từ bytes
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">2.</span>
                                    Thay đổi kích thước thành 256×256 pixel
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">3.</span>
                                    Chuẩn hóa giá trị pixel (0-1)
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">4.</span>
                                    Thêm chiều batch
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">5.</span>
                                    Chuyển tiếp qua mô hình
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">6.</span>
                                    Softmax → Điểm tin cậy
                                </li>
                            </ol>
                        </div>

                        <div className="bg-cyan-50 rounded-lg p-6 border-l-4 border-cyan-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <h3 className="font-bold text-gray-900 mb-4">Với Tiền xử lý HPF</h3>
                            <ol className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">1.</span>
                                    Tải ảnh từ bytes
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">2.</span>
                                    Thay đổi kích thước thành 256×256 pixel
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">3.</span>
                                    <strong>Áp dụng lớp HPF (trích xuất thành phần tần số cao)</strong>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">4.</span>
                                    Chuẩn hóa giá trị pixel
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">5.</span>
                                    Thêm chiều batch
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">6.</span>
                                    Chuyển tiếp qua mô hình
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">7.</span>
                                    Softmax → Điểm tin cậy
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Kiến trúc Mô-đun Forensics</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <ModuleCard
                            title="Trình trích xuất Metadata"
                            description="Trích xuất và phân tích siêu dữ liệu ảnh"
                            steps={[
                                "Tải ảnh với PIL/piexif",
                                "Trích xuất thẻ EXIF (máy ảnh, thời gian, cài đặt)",
                                "Phân tích tọa độ GPS nếu có",
                                "Đọc bình luận ảnh",
                                "Phát hiện mẫu đáng ngờ (chuỗi dài, cờ CTF)",
                                "Tính toán mã băm metadata để kiểm tra tính toàn vẹn",
                                "Trả về JSON có cấu trúc"
                            ]}
                        />
                        <ModuleCard
                            title="Trình trích xuất Chuỗi"
                            description="Tìm kiếm chuỗi và mẫu ẩn"
                            steps={[
                                "Đọc ảnh dưới dạng byte thô",
                                "Trích xuất chuỗi (ASCII, UTF-8, UTF-16)",
                                "Áp dụng mẫu regex (URL, email, IP, hex)",
                                "Phát hiện và xác thực chuỗi base64",
                                "Nhận dạng cờ CTF, JWT, khóa API",
                                "Phân tích bảo mật (phát hiện từ khóa)",
                                "Trả về kết quả đã phân loại"
                            ]}
                        />
                        <ModuleCard
                            title="Trình phân tích Trực quan"
                            description="Phân tích ảnh với thị giác máy tính"
                            steps={[
                                "Tải ảnh dưới dạng mảng NumPy",
                                "Phân tách kênh (R, G, B, Alpha)",
                                "Trích xuất 8 bit plane mỗi kênh",
                                "Thực hiện các phép toán kênh (XOR, CỘNG, TRỪ)",
                                "Tính toán biểu đồ tần suất cho mỗi kênh",
                                "Phát hiện bất thường (entropy, tương quan)",
                                "Chuyển đổi kết quả sang PNG base64"
                            ]}
                        />
                        <ModuleCard
                            title="Trình phân tích LSB"
                            description="Trích xuất Bit có trọng số thấp nhất"
                            steps={[
                                "Phân tích cấu hình (kênh, bit, thứ tự)",
                                "Trích xuất bit LSB/MSB từ pixel",
                                "Chuyển đổi bit thành byte",
                                "Phát hiện chữ ký tệp (ZIP, PNG, PDF...)",
                                "Thử giải mã văn bản (đa bảng mã)",
                                "Phân tích entropy cho độ ngẫu nhiên",
                                "Lưu tệp đã trích xuất với ID duy nhất"
                            ]}
                        />
                    </div>
                </div>

                {/* Technology Details */}
                <div className="bg-white rounded-xl p-8 shadow-lg mb-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Chi tiết Công nghệ</h2>
                    <div className="space-y-6">
                        <TechSection
                            title="Deep Learning Stack"
                            items={[
                                { name: "TensorFlow 2.16.1", desc: "Framework ML cốt lõi với Keras API", icon: Cpu },
                                { name: "NumPy 1.26.3", desc: "Các phép toán số và thao tác mảng", icon: Code },
                                { name: "Kiến trúc Mô hình", desc: "CNN, MobileNetV2, ResNet50, VGG16 với transfer learning", icon: Layers },
                                { name: "Lớp Tùy chỉnh", desc: "Lớp tiền xử lý HPF sử dụng Conv2D với hạt nhân cố định", icon: Box },
                                { name: "Huấn luyện", desc: "Adam optimizer, categorical crossentropy, batch size 32", icon: Activity }
                            ]}
                        />
                        <TechSection
                            title="Xử lý Hình ảnh"
                            items={[
                                { name: "Pillow 10.2.0", desc: "Tải ảnh, chuyển đổi định dạng, trích xuất EXIF", icon: Image },
                                { name: "OpenCV 4.11", desc: "Các phép toán ảnh nâng cao, chuyển đổi không gian màu", icon: Aperture },
                                { name: "piexif", desc: "Phân tích metadata EXIF chi tiết", icon: FileText },
                                { name: "NumPy", desc: "Thao tác mảng nhanh cho thao tác bit", icon: Code },
                                { name: "scipy", desc: "Phân tích thống kê, tính toán entropy", icon: Activity }
                            ]}
                        />
                        <TechSection
                            title="Web Framework"
                            items={[
                                { name: "FastAPI", desc: "API REST Async với tài liệu OpenAPI tự động", icon: Zap },
                                { name: "Uvicorn", desc: "Máy chủ ASGI với hỗ trợ tải lại nóng", icon: Server },
                                { name: "Pydantic", desc: "Xác thực và tuần tự hóa dữ liệu", icon: CheckCircle },
                                { name: "python-multipart", desc: "Xử lý tải lên tệp", icon: FileUp },
                                { name: "CORS Middleware", desc: "Yêu cầu chéo nguồn từ frontend React", icon: Globe }
                            ]}
                        />
                    </div>
                </div>

                {/* Security Considerations */}
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Bảo mật & Thực tiễn tốt nhất</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <h3 className="font-bold text-green-900 mb-3">Đã triển khai</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                                    Giới hạn kích thước tệp (frontend 20MB, backend có thể cấu hình)
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                                    Danh sách cho phép thẻ EXIF để ngăn chặn injection metadata
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                                    Ngăn chặn path traversal trong các thao tác tệp
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                                    Xác thực đầu vào với xử lý lỗi toàn diện
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                                    Dọn dẹp tệp tạm thời sau khi tải xuống
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                                    Ghi nhật ký cho các vết kiểm toán
                                </li>
                            </ul>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <h3 className="font-bold text-yellow-900 mb-3">Cải tiến trong tương lai</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>• Hệ thống xác thực & ủy quyền</li>
                                <li>• Giới hạn tốc độ các endpoint API</li>
                                <li>• Lưu trữ mã hóa cho tệp đã tải lên</li>
                                <li>• Quản lý khóa API</li>
                                <li>• Ghi nhật ký nâng cao với ELK stack</li>
                                <li>• Bảo mật container với Docker</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div >
        </div >
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
                {technical && (
                    <p className="text-sm text-gray-600 bg-gray-50 rounded p-3 font-mono hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        {technical}
                    </p>
                )}
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
                {items.map((item, idx) => {
                    const Icon = item.icon || Shield;
                    return (
                        <div key={idx} className="flex items-start bg-gray-50 rounded p-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <Icon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="font-semibold text-gray-900">{item.name}:</span>
                                <span className="text-gray-700 ml-2">{item.desc}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function SectionTitle({ icon: Icon, title }) {
    return (
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Icon className="w-8 h-8 mr-3 text-blue-600" />
            {title}
        </h2>
    );
}

function TechCard({ title, items, color }) {
    return (
        <div className={`${color} rounded-xl p-6 border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
            <h3 className="font-bold text-gray-900 mb-4">{title}</h3>
            <ul className="space-y-2">
                {items.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}
