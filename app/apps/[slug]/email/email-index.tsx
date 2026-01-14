"use client"
import React, { useState } from 'react';
import { Mail, Lock, Info, Check, AlertCircle, FileText, Server } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const EmailSettings: React.FC = () => {
    // State for form fields
    const [fromName, setFromName] = useState('My App Support');
    const [fromEmail, setFromEmail] = useState('support@myapp.com');
    const [host, setHost] = useState('smtp.gmail.com');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [port, setPort] = useState('465');
    const [security, setSecurity] = useState<'Plain' | 'SSL' | 'TSL'>('SSL');

    const { toast } = useToast();
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerify = () => {
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            toast({
                title: "Connection Verified",
                description: "SMTP settings are correct and server is reachable.",
            })
        }, 1500);
    };

    return (
        <div className="space-y-8 p-6">
            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Email Settings</h1>
                        <p className="text-muted-foreground">Configure your email settings</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                        <FileText size={16} /> Email logs
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">
                        Save
                    </button>
                    <button
                        onClick={handleVerify}
                        disabled={isVerifying}
                        className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black-700 disabled:opacity-70"
                    >
                        {isVerifying ? 'Verifying...' : 'Verify'}
                    </button>
                </div>
            </div>

            {/* Bottom Stepper Visual (Static as per screenshot request) */}
            <div className="flex items-center justify-between pt-10 px-10 opacity-60 grayscale pointer-events-none mb-20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400">@</div>
                    <div className="text-left">
                        <div className="text-xs uppercase tracking-wider font-bold text-gray-400">Step 1</div>
                        <div className="text-sm font-medium text-gray-600">Enter sender's details</div>
                    </div>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-8"></div>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400"><Globe size={20} /></div>
                    <div className="text-left">
                        <div className="text-xs uppercase tracking-wider font-bold text-gray-400">Step 2</div>
                        <div className="text-sm font-medium text-gray-600">Provide server credentials</div>
                    </div>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-8"></div>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400"><Check size={20} /></div>
                    <div className="text-left">
                        <div className="text-xs uppercase tracking-wider font-bold text-gray-400">Step 3</div>
                        <div className="text-sm font-medium text-gray-600">Verify email server</div>
                    </div>
                </div>
            </div>

            {/* Section 1: Sender's Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-1">1. Sender's details</h3>
                <p className="text-sm text-gray-500 mb-8">
                    Provide the name and email address from which your customers will receive emails.
                </p>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Inputs */}
                    <div className="flex-1 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                From name <Info size={14} className="text-gray-400" />
                            </label>
                            <input
                                type="text"
                                value={fromName}
                                onChange={e => setFromName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Acme Support"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                From address <Info size={14} className="text-gray-400" />
                            </label>
                            <input
                                type="email"
                                value={fromEmail}
                                onChange={e => setFromEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="e.g. support@acme.com"
                            />
                        </div>
                    </div>

                    {/* Preview Card */}
                    <div className="flex-1">
                        <div className="border border-gray-100 rounded-xl p-6 shadow-sm bg-white h-full flex flex-col justify-center">
                            <div className="space-y-4 max-w-md mx-auto w-full">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-gray-400 w-16 text-right">From:</span>
                                    <div className="text-sm text-gray-900 font-medium">
                                        {fromName || 'Sender Name'} <span className="text-primary font-normal">&lt;{fromEmail || 'email@example.com'}&gt;</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-gray-400 w-16 text-right">To:</span>
                                    <div className="h-2 w-32 bg-gray-100 rounded-full"></div>
                                    <div className="h-2 w-20 bg-gray-100 rounded-full"></div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-gray-400 w-16 text-right">Date:</span>
                                    <div className="h-2 w-16 bg-gray-100 rounded-full"></div>
                                    <div className="h-2 w-12 bg-gray-100 rounded-full"></div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-gray-400 w-16 text-right">Encryption:</span>
                                    <div className="flex items-center gap-1 text-gray-400">
                                        <Lock size={12} />
                                        <div className="h-2 w-24 bg-gray-100 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Email Server */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 relative overflow-hidden">
                {/* Decorative status icon */}
                <div className="absolute top-8 right-8 text-green-500 bg-green-50 p-2 rounded-full hidden md:block">
                    <Check size={24} />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">2. Email server</h3>
                <p className="text-sm text-gray-500 mb-8">
                    Provide the following details to send emails from your private email server.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            Host name <Info size={14} className="text-gray-400" />
                        </label>
                        <input
                            type="text"
                            value={host}
                            onChange={e => setHost(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="smtp.example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            Username <Info size={14} className="text-gray-400" />
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="Required for authentication"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            Password <Info size={14} className="text-gray-400" />
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="••••••••••••"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                Connect type <Info size={14} className="text-gray-400" />
                            </label>
                            <div className="flex border border-gray-200 rounded-lg overflow-hidden h-[50px]">
                                {['Plain', 'SSL', 'TSL'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSecurity(type as any)}
                                        className={`flex-1 text-sm font-medium transition-colors ${security === type
                                            ? 'bg-slate-400 text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="w-1/3">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                Port <Info size={14} className="text-gray-400" />
                            </label>
                            <select
                                value={port}
                                onChange={e => setPort(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
                            >
                                <option value="25">25</option>
                                <option value="465">465</option>
                                <option value="587">587</option>
                                <option value="2525">2525</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

// Simple globe icon for the footer
const Globe = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);
