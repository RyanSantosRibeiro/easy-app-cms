"use client"
import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    Users,
    DollarSign,
    ShoppingBag,
    Activity,
    Download,
    Smartphone,
    Plus,
    ArrowUpRight,
    Search,
    Palette
} from 'lucide-react';
import { Project } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PageHeader } from '@/components/PageHeader';

interface DashboardProps {
    project: Project;
}

export const Dashboard: React.FC<DashboardProps> = ({ project }) => {

    const data = [
        { name: 'Mon', visits: 4000, downloads: 2400, sales: 2400 },
        { name: 'Tue', visits: 3000, downloads: 1398, sales: 1398 },
        { name: 'Wed', visits: 2000, downloads: 9800, sales: 2400 },
        { name: 'Thu', visits: 2780, downloads: 3908, sales: 1908 },
        { name: 'Fri', visits: 1890, downloads: 4800, sales: 2800 },
        { name: 'Sat', visits: 2390, downloads: 3800, sales: 2300 },
        { name: 'Sun', visits: 3490, downloads: 4300, sales: 3100 },
    ];

    const platformData = [
        { name: 'iOS', value: 65, color: '#f87171' },
        { name: 'Android', value: 35, color: '#4ade80' },
    ];

    const teamMembers = [
        { name: 'Ryan Santos', role: 'Owner', avatar: 'https://github.com/shadcn.png', initial: 'RS' },
        { name: 'Sarah Connor', role: 'Designer', avatar: '', initial: 'SC' },
        { name: 'John Doe', role: 'Developer', avatar: '', initial: 'JD' },
    ];

    const StatCard = ({ title, value, change, icon: Icon, color, trend }: any) => (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl ${color}`}>
                    <Icon size={22} className="text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                    {change}
                    <ArrowUpRight size={12} className={trend === 'down' ? 'rotate-90' : ''} />
                </div>
            </div>
            <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 p-8 max-w-7xl mx-auto">
            <PageHeader
                title="Dashboard Overview"
                description={`Visualização em tempo real das métricas de performance do ${project?.name || 'seu App'}.`}
            >
                <div className="relative hidden md:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input className="pl-12 pr-6 h-12 rounded-2xl border border-gray-100 bg-white text-sm focus:ring-4 ring-primary/10 outline-none w-72 shadow-sm transition-all focus:w-80 font-medium" placeholder="Pesquisar dados..." />
                </div>
            </PageHeader>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Active Users" value="2,845" change="+12%" trend="up" icon={Users} color="bg-blue-500" />
                <StatCard title="New Downloads" value="1,120" change="+8.4%" trend="up" icon={Download} color="bg-indigo-500" />
                <StatCard title="Store Sales" value="$14,231" change="-2.1%" trend="down" icon={DollarSign} color="bg-emerald-500" />
                <StatCard title="App Health" value="99.9%" change="Stable" trend="up" icon={Activity} color="bg-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Traffic Chart */}
                <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900">User Traffic & Retention</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Activity over the last 7 days</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-[10px] font-bold text-gray-400">VISITS</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-indigo-200" /><span className="text-[10px] font-bold text-gray-400">DOWNLOADS</span></div>
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                    itemStyle={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}
                                />
                                <Area type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorVisits)" />
                                <Area type="monotone" dataKey="downloads" stroke="#c7d2fe" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Team & Platform Column */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Team Members Card */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center justify-between">
                            Team Info
                            <button className="text-primary hover:bg-primary/10 p-1.5 rounded-full transition-colors"><Plus size={18} /></button>
                        </h3>
                        <div className="space-y-4">
                            {teamMembers.map((member, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10 border-2 border-white shadow-sm ring-2 ring-gray-50 group-hover:ring-primary/20 transition-all">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{member.initial}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">{member.name}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{member.role}</p>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-6 rounded-2xl border-gray-100 text-xs font-bold py-5">View Full Team</Button>
                    </div>

                    {/* Platform Stats */}
                    <div className="bg-[#1a1a1a] p-8 rounded-[2.5rem] shadow-xl shadow-black/5 text-white">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-md font-black uppercase tracking-widest text-white/50">Platforms</h3>
                            <Smartphone size={18} className="text-primary" />
                        </div>
                        <div className="flex items-end justify-between gap-4">
                            {platformData.map((plat, idx) => (
                                <div key={idx} className="flex-1 space-y-3">
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${plat.value}%`, backgroundColor: plat.color }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-xs font-bold">{plat.name}</span>
                                        <span className="text-xs font-black text-white/40">{plat.value}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent App Updates / Events */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-gray-900">Recent Build Events</h3>
                    <span className="text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full">Live Logs</span>
                </div>
                <div className="space-y-6">
                    {[
                        { title: 'Theme Update Published', time: '2 mins ago', icon: Palette, color: 'bg-orange-500' },
                        { title: 'New Menu Structure Deployed', time: '1 hour ago', icon: Smartphone, color: 'bg-blue-500' },
                        { title: 'Assets Bundle Optimized', time: 'Yesterday', icon: ShoppingBag, color: 'bg-green-500' },
                    ].map((event, idx) => (
                        <div key={idx} className="flex items-center gap-4 group">
                            <div className={`w-10 h-10 rounded-xl ${event.color} bg-opacity-10 flex items-center justify-center text-opacity-80`}>
                                <event.icon size={18} className={event.color.replace('bg-', 'text-')} />
                            </div>
                            <div className="flex-1 border-b border-gray-50 pb-4 group-last:border-none">
                                <h4 className="text-sm font-bold text-gray-800">{event.title}</h4>
                                <p className="text-xs text-gray-400 font-medium">{event.time}</p>
                            </div>
                            <ArrowUpRight size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
