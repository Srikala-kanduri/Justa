import React from 'react';

export default function Footer() {
    return (
        <footer id="contact" className="bg-orange-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">J</span>
                            </div>
                            <span className="text-xl font-bold text-gray-800">JUSTA</span>
                        </div>
                        <div className="flex space-x-3">
                            <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
                                f
                            </a>
                            <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700">
                                in
                            </a>
                            <a href="#" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500">
                                t
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-600 hover:text-orange-500">About</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-orange-500">Contact</a></li>
                           
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Features</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-600 hover:text-orange-500">AI Estimation</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-orange-500">Event Management</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-orange-500">Analytics</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-orange-500">NGO Integration</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-600 hover:text-orange-500">Documentation</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-orange-500">Blog</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-orange-500">Guides</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-orange-500">Affiliates</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-orange-200 pt-8 text-center">
                    <p className="text-gray-600 text-sm">All rights reserved 2025 • @Justa</p>
                </div>
            </div>
        </footer>
    );
}