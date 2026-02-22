/**
 * Professional Footer Component
 * Enhanced with newsletter subscription
 */

import React, { useState } from 'react';
import { Shield, Github, Mail, Send, CheckCircle, Zap, Database, Search, Eye, Layers, FileText, Book, Code, Server } from 'lucide-react';
import clsx from 'clsx';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            // Simulate subscription
            setSubscribed(true);
            setTimeout(() => {
                setSubscribed(false);
                setEmail('');
            }, 3000);
        }
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold">Steganalysis Pro</h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Nền tảng phát hiện steganography bằng AI tiên tiến và phân tích forensics toàn diện.
                        </p>
                    </div>

                    {/* Features */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Tính năng</h3>
                        <ul className="space-y-2">
                            <FooterLink href="/#ai-detection">
                                <Zap className="w-4 h-4 inline mr-2" /> Phát hiện AI
                            </FooterLink>
                            <FooterLink href="/#forensics">
                                <Shield className="w-4 h-4 inline mr-2" /> Phân tích Forensics
                            </FooterLink>
                            <FooterLink href="/#metadata">
                                <Database className="w-4 h-4 inline mr-2" /> Trích xuất Metadata
                            </FooterLink>
                            <FooterLink href="/#strings">
                                <Search className="w-4 h-4 inline mr-2" /> Phân tích Chuỗi
                            </FooterLink>
                            <FooterLink href="/#visual">
                                <Eye className="w-4 h-4 inline mr-2" /> Forensics Trực quan
                            </FooterLink>
                            <FooterLink href="/#superimposed">
                                <Layers className="w-4 h-4 inline mr-2" /> Phân tích Chồng lớp
                            </FooterLink>
                            <FooterLink href="/#lsb">
                                <FileText className="w-4 h-4 inline mr-2" /> Trích xuất LSB
                            </FooterLink>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Tài nguyên</h3>
                        <ul className="space-y-2">
                            <FooterLink href="/guide">
                                <Book className="w-4 h-4 inline mr-2" /> Tài liệu
                            </FooterLink>
                            <FooterLink href="https://github.com" target="_blank">
                                <Github className="w-4 h-4 inline mr-2" /> GitHub
                            </FooterLink>
                            <FooterLink href="http://localhost:8000/docs" target="_blank">
                                <Code className="w-4 h-4 inline mr-2" /> Tài liệu API
                            </FooterLink>
                            <FooterLink href="/architecture">
                                <Server className="w-4 h-4 inline mr-2" /> Kiến trúc
                            </FooterLink>
                        </ul>
                    </div>

                    {/* Support - Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Hỗ trợ</h3>
                        <p className="text-gray-400 text-sm mb-3">
                            Đăng ký để nhận cập nhật mới nhất
                        </p>
                        <form onSubmit={handleSubscribe} className="space-y-2">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Nhập email của bạn"
                                    className={clsx(
                                        "w-full px-4 py-2 pr-10 bg-gray-800 border rounded-lg text-white placeholder-gray-500 transition-all",
                                        subscribed
                                            ? "border-green-500 focus:ring-green-500"
                                            : "border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                                    )}
                                    disabled={subscribed}
                                    required
                                />
                                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            </div>
                            <button
                                type="submit"
                                disabled={subscribed}
                                className={clsx(
                                    "w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center",
                                    subscribed
                                        ? "bg-green-600 cursor-default"
                                        : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg hover:scale-105 hover:-translate-y-0.5"
                                )}
                            >
                                {subscribed ? (
                                    <>
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Đã đăng ký!
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Đăng ký
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <TechBadge>React</TechBadge>
                            <TechBadge>FastAPI</TechBadge>
                            <TechBadge>TensorFlow</TechBadge>
                            <TechBadge>Python</TechBadge>
                        </div>
                        <div className="text-sm text-gray-400">
                            © {currentYear} Steganalysis Pro. Đã đăng ký bản quyền.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children, target }) {
    const isExternal = target === '_blank';

    return (
        <li>
            <a
                href={href}
                target={target}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="text-gray-400 hover:text-white transition-colors text-sm flex items-center"
            >
                {children}
            </a>
        </li>
    );
}

function TechBadge({ children }) {
    return (
        <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700">
            {children}
        </span>
    );
}
