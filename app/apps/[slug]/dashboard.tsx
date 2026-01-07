"use client"
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, DollarSign, ShoppingBag, Activity } from 'lucide-react';
import { App } from '@/lib/types';

interface DashboardProps {
    project: App;
}

export const Dashboard: React.FC<DashboardProps> = ({ project }) => {

    const data = [
        { name: 'Mon', visits: 4000, sales: 2400 },
        { name: 'Tue', visits: 3000, sales: 1398 },
        { name: 'Wed', visits: 2000, sales: 9800 },
        { name: 'Thu', visits: 2780, sales: 3908 },
        { name: 'Fri', visits: 1890, sales: 4800 },
        { name: 'Sat', visits: 2390, sales: 3800 },
        { name: 'Sun', visits: 3490, sales: 4300 },
    ];

    const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                <span className={`text-xs font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {change} vs last week
                </span>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
        </div>
    );

    return (
        <div className="space-y-6 p-6">

            <div className="flex items-center justify-between">
                            <div>
                            <h1 className="text-3xl font-bold tracking-tight">Performance Overview</h1>
                            <p className="text-muted-foreground">Analytics for {project.name}</p>
                        </div>
                        </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value="$45,231" change="+20.1%" icon={DollarSign} color="bg-green-500" />
                <StatCard title="Active Users" value="2,345" change="+15.2%" icon={Users} color="bg-blue-500" />
                <StatCard title="Total Orders" value="1,240" change="-5.4%" icon={ShoppingBag} color="bg-purple-500" />
                <StatCard title="Bounce Rate" value="42.3%" change="+2.1%" icon={Activity} color="bg-orange-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-md font-semibold text-gray-800 mb-4">Revenue Trends</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee"/>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10}/>
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}}/>
                                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                                <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-md font-semibold text-gray-800 mb-4">User Traffic</h3>
                     <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee"/>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10}/>
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}}/>
                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                                <Line type="monotone" dataKey="visits" stroke="#ec4899" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};