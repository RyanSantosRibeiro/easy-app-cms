"use client"
import { Button } from "@/components/ui/button";
import { App } from "@/lib/types";
import { Layout, Plus, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PageHeader } from "@/components/PageHeader";

export default function AppsIndex({ appsData = [] }: { appsData: App[] }) {
    const router = useRouter()
    const [apps, setApps] = useState(appsData)
    console.log({ apps })
    return (
        <div className="space-y-10 p-8 max-w-7xl mx-auto">
            <PageHeader
                title="Meus Projetos"
                description="Gerencie e publique suas lojas mobile em um clique."
            >
                <Button
                    onClick={() => router.push("/apps/create")}
                    className="h-14 px-8 bg-black hover:bg-gray-800 text-white font-black rounded-2xl shadow-xl shadow-black/10 transition-all active:scale-95 group flex items-center"
                >
                    Criar Novo App
                    <Plus size={20} className="ml-2 group-hover:rotate-90 transition-transform duration-300" />
                </Button>
            </PageHeader>

            {apps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-6 text-gray-300">
                        <Layout size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">Nenhum projeto ainda</h3>
                    <p className="text-gray-500 max-w-xs text-center mt-2 font-medium">Você ainda não criou nenhuma loja. Comece agora mesmo clicando no botão acima.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {apps.map((app) => (
                        <div
                            key={app.id}
                            onClick={() => router.push(`/apps/${app.slug}`)}
                            className="group relative bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 cursor-pointer transition-all duration-500 flex flex-col justify-between min-h-[220px]"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors" />

                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                                        {app.logo_url ? (
                                            <img src={app.logo_url} className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <Layout size={28} />
                                        )}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">v1.2 Live</span>
                                </div>

                                <h3 className="font-black text-gray-900 text-2xl tracking-tight mb-2 group-hover:text-primary transition-colors">{app.name}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">/{app.slug}</p>
                            </div>

                            <div className="pt-6 flex justify-between items-center relative">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white" />
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white" />
                                    <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[8px] font-black">+4</div>
                                </div>
                                <div className="flex items-center gap-1.5 text-primary opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                    <span className="text-xs font-black uppercase">Acessar Painel</span>
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}