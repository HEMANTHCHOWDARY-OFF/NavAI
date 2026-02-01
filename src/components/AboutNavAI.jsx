import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const FeatureCard = ({ feature, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const cardRef = useRef(null);
    const contentRef = useRef(null);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        if (isExpanded) {
            gsap.to(contentRef.current, {
                height: 'auto',
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
            });
        } else {
            gsap.to(contentRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
            });
        }
    }, [isExpanded]);

    const Icon = feature.icon;

    return (
        <div
            ref={cardRef}
            className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 border-l-4 ${isExpanded ? 'bg-white shadow-2xl ring-1 ring-opacity-5' : 'bg-white hover:shadow-xl hover:-translate-y-1'
                } ${feature.borderColor}`}
        >
            {/* Header Section of Card */}
            <div
                className={`p-6 cursor-pointer ${isExpanded ? `bg-opacity-5 ${feature.bgColor}` : ''}`}
                onClick={toggleExpand}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md text-white ${feature.iconBg}`}>
                            <Icon className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{feature.shortDesc}</p>
                        </div>
                    </div>
                    <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            <div
                ref={contentRef}
                className="h-0 opacity-0 overflow-hidden"
            >
                <div className="p-6 pt-0 border-t border-gray-100">
                    <div className="mt-4 space-y-6">

                        {/* Description */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className={`font-semibold mb-2 ${feature.textColor}`}>What it is</h4>
                            <p className="text-gray-700 text-sm leading-relaxed">{feature.description}</p>
                        </div>

                        {/* Key Features Grid */}
                        <div>
                            <h4 className={`font-semibold mb-3 ${feature.textColor}`}>Key Capabilities</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {feature.capabilities.map((cap, idx) => (
                                    <div key={idx} className="flex items-start space-x-2">
                                        <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${feature.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm text-gray-600">{cap}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Usage Summary */}
                        <div className={`p-4 rounded-lg bg-opacity-10 ${feature.bgColor} border border-opacity-20 ${feature.borderColor}`}>
                            <h4 className={`font-semibold mb-1 ${feature.textColor}`}>Why use it?</h4>
                            <p className="text-sm text-gray-700">{feature.summary}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AboutNavAI = () => {
    const containerRef = useRef(null);
    const headerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Build an engaging entrance animation sequence
            const tl = gsap.timeline();

            tl.from(headerRef.current, {
                y: -30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
            })
                .from('.feature-card', {
                    y: 50,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: 'back.out(1.2)',
                }, "-=0.4");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const features = [
        {
            id: 'resume-builder',
            title: 'Resume Builder',
            shortDesc: 'Create professional, ATS-friendly resumes.',
            icon: (props) => (
                <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            description: "A powerful, AI-enhanced tool designed to help you create professional, customized resumes effortlessly. It transforms your career information into eye-catching documents tailored to specific job opportunities.",
            capabilities: [
                "Industry-specific templates",
                "Real-time ATS optimization checking",
                "Dynamic section management",
                "Drag-and-drop customization",
                "Smart keyword incorporation",
                "Export to PDF and text formats"
            ],
            summary: "Perfect for job seekers at any stage. Create polished resumes quickly that pass Applicant Tracking Systems and impress recruiters.",
            iconBg: 'bg-blue-600',
            bgColor: 'bg-blue-600',
            textColor: 'text-blue-700',
            borderColor: 'border-blue-600'
        },
        {
            id: 'resume-screener',
            title: 'Resume Screener',
            shortDesc: 'AI-powered analysis and scoring.',
            icon: (props) => (
                <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            description: "An intelligent analysis tool that uses advanced AI to evaluate, score, and provide detailed feedback on resume quality and job fit. It eliminates bias and provides consistent, data-driven insights.",
            capabilities: [
                "Instant fit-gap analysis",
                "Keyword density scoring",
                "Detailed strength & weakness breakdown",
                "Formatting & readability checks",
                "Batch resume processing",
                "Objective comparison metrics"
            ],
            summary: "Whether you're a candidate self-assessing or a recruiter filtering applicants, get unbiased, deep insights in seconds.",
            iconBg: 'bg-green-600',
            bgColor: 'bg-green-600',
            textColor: 'text-green-700',
            borderColor: 'border-green-600'
        },
        {
            id: 'ai-interview',
            title: 'AI Interview',
            shortDesc: 'Practice with realistic mock interviews.',
            icon: (props) => (
                <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            description: "A comprehensive mock interview platform with AI-powered feedback. It simulates real interview conditions across various formats to help you build confidence and refine your responses.",
            capabilities: [
                "Technical, Behavioral, & HR rounds",
                "Real-time speech analysis & feedback",
                "Video recording & playback",
                "STAR method coaching",
                "Customizable difficulty levels",
                "Progress tracking over time"
            ],
            summary: "Stop guessing. Practice in a safe environment, get immediate constructive feedback, and walk into your next interview with confidence.",
            iconBg: 'bg-purple-600',
            bgColor: 'bg-purple-600',
            textColor: 'text-purple-700',
            borderColor: 'border-purple-600'
        },
        {
            id: 'question-generator',
            title: 'Question Generator',
            shortDesc: 'Tailored questions for any role.',
            icon: (props) => (
                <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            description: "A versatile system that creates high-quality, relevant interview questions. It can generate questions manually based on criteria or automatically by analyzing a specific resume.",
            capabilities: [
                "Resume-based automatic generation",
                "Role-specific question banks",
                "Multiple formats (Coding, Case study, etc.)",
                "Customizable time limits & difficulty",
                "CSV/PDF export functionality",
                "Interview structure planning"
            ],
            summary: "Essential for interviewers designing assessments and candidates looking to anticipate what they will be asked.",
            iconBg: 'bg-orange-500',
            bgColor: 'bg-orange-600',
            textColor: 'text-orange-700',
            borderColor: 'border-orange-500'
        }
    ];

    return (
        <div ref={containerRef} className="space-y-8 pb-12">
            {/* Header Section */}
            <div ref={headerRef} className="text-center md:text-left mb-10">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-600 mb-4 pb-2">
                    NavAI Documentation
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
                    Your complete ecosystem for career acceleration. Explore our AI-powered tools designed to help you land your dream job.
                </p>
            </div>

            {/* Hero / Get Started Banner */}
            <div className="feature-card relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

                <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-6 md:mb-0 md:mr-6">
                        <h2 className="text-3xl font-bold mb-2">Ready to start your journey?</h2>
                        <p className="text-blue-100 text-lg">Select a tool from the sidebar or explore the features below to dive in.</p>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white border-opacity-30">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {features.map((feature, index) => (
                    <div key={feature.id} className="feature-card">
                        <FeatureCard feature={feature} index={index} />
                    </div>
                ))}
            </div>

            {/* Footer Note */}
            <div className="feature-card text-center pt-8">
                <p className="text-gray-400 text-sm">© {new Date().getFullYear()} NavAI. Empowering Careers.</p>
            </div>
        </div>
    );
};

export default AboutNavAI;
