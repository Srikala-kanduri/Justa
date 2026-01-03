
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronLeft, ChevronRight, Star, ClipboardList, BarChart3, Brain, HeartHandshake, Sparkles } from 'lucide-react';
import Footer from '../components/footer';
import heroImage from '../assets/hero-image.png';
import technologyImage from '../assets/technology-image.png';
import simpleSolutionsImage from '../assets/simple-solutions-image.png';

export default function JustaLandingPage() {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const services = [
        {
            icon: "🔍",
            title: "Smart Estimation",
            description: "AI-driven food quantity predictions based on event type, attendee count, and meal preferences—ensuring precise planning with zero guesswork.",
            color: "bg-yellow-400"
        },
        {
            icon: "📊",
            title: "Data Analytics",
            description: "Visual insights to track food usage and wastage, helping you make smarter decisions for future events.",
            color: "bg-green-400"
        },
        {
            icon: "🎯",
            title: "Event Management",
            description: "Manage multiple events seamlessly with real-time updates and dynamic quantity adjustments.",
            color: "bg-purple-400"
        },
        {
            icon: "🤝",
            title: "NGO Integration",
            description: "Redistribute surplus food by connecting with nearby donation centers and promoting social responsibility.",
            color: "bg-orange-500"
        }
    ];

    const testimonials = [
        {
            name: "Srikala Kanduri",
            role: "Event Manager",
            company: "Tech College",
            image: "👤",
            rating: 5,
            text: "JUSTA has transformed how we plan our college events. The AI-powered estimation is incredibly accurate and we've reduced food waste by 60%!"
        },
        {
            name: "Rahul Sharma",
            role: "Hostel Warden",
            company: "City University",
            image: "👤",
            rating: 5,
            text: "This platform made our hostel food management so efficient. No more guesswork, just data-driven decisions that save costs and resources."
        },
        {
            name: "Priya Mehta",
            role: "Community Leader",
            company: "NGO Alliance",
            image: "👤",
            rating: 5,
            text: "The surplus food donation feature is brilliant! We've been able to help numerous food banks through this seamless integration."
        }
    ];

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">J</span>
                                </div>
                                <span className="text-xl font-bold text-gray-800">JUSTA</span>
                            </div>
                        </div>

                        <div className="hidden md:flex space-x-8">
                            <a href="#home" className="text-orange-500 font-medium">Home</a>
                            
                            <a href="#services" className="text-gray-600 hover:text-orange-500">Services</a>
                            <a href="#contact" className="text-gray-600 hover:text-orange-500">Contact us</a>
                            
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            
                            <button onClick={() => navigate('/login')} className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition">
                                Login/Sign up
                            </button>
                        </div>

                        <div className="md:hidden">
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <a href="#home" className="block px-3 py-2 text-orange-500 font-medium">Home</a>
                            <a href="#about" className="block px-3 py-2 text-gray-600">About us</a>
                            <a href="#services" className="block px-3 py-2 text-gray-600">Services</a>
                            <a href="#contact" className="block px-3 py-2 text-gray-600">Contact us</a>
                            <a href="#blog" className="block px-3 py-2 text-gray-600">Blog</a>
                            <button onClick={() => navigate('/login')} className="w-full mt-2 text-gray-600 hover:text-orange-500 font-medium py-2 rounded-md border border-gray-200">
                                Log in
                            </button>
                            <button onClick={() => navigate('/login')} className="w-full mt-2 bg-orange-500 text-white px-6 py-2 rounded-md">
                                Sign up
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <div className="space-y-6">
                            <div className="flex space-x-2">
                                <span className="w-3 h-3 bg-orange-400 rounded-full opacity-60"></span>
                                <span className="w-3 h-3 bg-orange-400 rounded-full opacity-40"></span>
                                <span className="w-3 h-3 bg-orange-400 rounded-full opacity-20"></span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                <span className="text-orange-500">JUSTA</span> — Building smarter and more responsible events
                            </h1>

                            <p className="text-gray-600 text-lg">
                                JUSTA is an AI-powered food planning platform that helps communities make data-driven decisions for events. It reduces food wastage, lowers costs, and promotes social responsibility by connecting surplus food with nearby donation centers.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 transition font-medium w-full sm:w-auto">
                                    Start Planning
                                </button>

                                <button className="text-orange-500 flex items-center justify-center space-x-2 hover:text-orange-600 w-full sm:w-auto">
                                    <span className="w-8 h-8 border-2 border-orange-500 rounded-full flex items-center justify-center">
                                        ▼
                                    </span>
                                    <span>Learn More</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/2 relative">
                        <div className="relative">
                            <img
                                src={heroImage}
                                alt="Hero illustration"
                                className="w-full max-w-3xl mx-auto md:ml-24 mb-12 relative z-10 rounded-3xl"
                            />
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-orange-400 rounded-full opacity-60"></div>
                            <div className="absolute bottom-8 -left-4 w-8 h-8 bg-orange-400 rounded-full opacity-40"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            What <span className="text-orange-500">JUSTA</span> Brings to Your Events
                        </h2>
                        <p className="text-gray-600 mt-4">
                            Smart, data-driven solutions to reduce food waste and create impact
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                                <div className={`${service.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4`}>
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                                <p className="text-gray-600 text-sm">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Simple Solutions Section */}
            <section className="bg-orange-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <img
                                src={simpleSolutionsImage}
                                alt="Solutions illustration"
                                className="w-full max-w-sm mx-auto mr-2"
                            />
                        </div>

                        <div className="md:w-1/2">
                            <div className="flex items-center space-x-2 mb-2">
                                <Sparkles className="w-6 h-6 text-orange-500" />
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                    Simple Solutions, <span className="text-orange-500">Real Impact</span>
                                </h2>
                            </div>
                            <p className="text-gray-600 mb-8 ml-8">
                                Plan smarter events in just a few easy steps
                            </p>

                            <div className="space-y-6">
                                {/* Step 1 */}
                                <div className="flex items-start space-x-4 group">
                                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-md transform transition-transform group-hover:scale-110 flex-shrink-0">
                                        <ClipboardList className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">1. Share Event Details</h4>
                                        <p className="text-gray-700">Tell us about your event—type, date, attendees, and meals.</p>
                                        <p className="text-gray-500 text-sm mt-1">This helps JUSTA understand your event needs.</p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex items-start space-x-4 group">
                                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-md transform transition-transform group-hover:scale-110 flex-shrink-0">
                                        <BarChart3 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">2. Smart Data Input</h4>
                                        <p className="text-gray-700">Enter key inputs like guest count and meal preferences.</p>
                                        <p className="text-gray-500 text-sm mt-1">No technical knowledge required.</p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex items-start space-x-4 group">
                                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-md transform transition-transform group-hover:scale-110 flex-shrink-0">
                                        <Brain className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">3. AI Quantity Estimation</h4>
                                        <p className="text-gray-700">Get accurate, AI-powered food quantity predictions.</p>
                                        <p className="text-gray-500 text-sm mt-1">Prevents over-preparation and food wastage.</p>
                                    </div>
                                </div>

                                {/* Step 4 */}
                                <div className="flex items-start space-x-4 group">
                                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-md transform transition-transform group-hover:scale-110 flex-shrink-0">
                                        <HeartHandshake className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">4. Track & Donate Surplus</h4>
                                        <p className="text-gray-700">Monitor results and donate excess food responsibly.</p>
                                        <p className="text-gray-500 text-sm mt-1">Connects with nearby NGO partners.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Agency Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Our <span className="text-orange-500">Technology</span>
                            </h2>
                            <p className="text-xl text-gray-700 font-semibold mb-6">
                                Smart intelligence built for real-world impact
                            </p>
                            <p className="text-gray-600 mb-6">
                                JUSTA uses advanced data intelligence to help you plan events more efficiently. Our system analyzes event details to provide accurate food estimates, reduce wastage, and support responsible decision-making.
                            </p>
                            <p className="text-gray-600 mb-6">
                                We focus on turning your inputs into clear, actionable insights—so you can plan confidently without worrying about complexity.
                            </p>
                            <p className="text-gray-600 mb-6">
                                <strong>Tailored for Every Event:</strong> JUSTA adapts to different event types and scales, delivering reliable estimations and a smooth experience from planning to surplus management.
                            </p>
                            <button className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition">
                                Read more
                            </button>
                        </div>

                        <div className="md:w-1/2">
                            <img
                                src={technologyImage}
                                alt="Agency illustration"
                                className="w-full max-w-md mx-auto"
                            />
                        </div>
                    </div>
                </div>
            </section >

            {/* Testimonials Section */}
            < section className="bg-white py-16" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            What <span className="text-orange-500">Users</span> Say!
                        </h2>
                        <p className="text-gray-600 mt-4">
                            See How Our Platform Helped Organizations Reduce Food Wastage
                        </p>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-lg">
                            <div className="flex items-start space-x-4">
                                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
                                    {testimonials[currentTestimonial].image}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                                            <p className="text-sm text-gray-600">{testimonials[currentTestimonial].role}</p>
                                            <p className="text-sm text-orange-500">{testimonials[currentTestimonial].company}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-4">{testimonials[currentTestimonial].text}</p>
                                    <div className="flex space-x-1">
                                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={prevTestimonial}
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-600" />
                        </button>

                        <button
                            onClick={nextTestimonial}
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    <div className="flex justify-center mt-6 space-x-2">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentTestimonial(index)}
                                className={`w-2 h-2 rounded-full ${index === currentTestimonial ? 'bg-orange-500' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </section >

            {/* CTA Section */}
            < section className="bg-orange-500 py-12" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">
                            Ready to get started?
                        </h2>
                        <button className="border-2 border-white text-white px-8 py-3 rounded-md hover:bg-white hover:text-orange-500 transition font-medium">
                            Contact Us
                        </button>
                    </div>
                </div>
            </section >

            {/* Footer */}
            < Footer />
        </div >
    );
}