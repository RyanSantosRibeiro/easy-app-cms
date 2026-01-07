"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { App } from "@/lib/types";
import { Label } from "@radix-ui/react-label";
import { Layout } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AppsIndex({ appsData = [] }: { appsData: App[] }) {
    const router = useRouter()
    const [apps, setApps] = useState(appsData)
    console.log({ apps })
    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Meus Apps</h1>
                    <p className="text-muted-foreground">Crie e gerencie seus apps</p>
                </div>
                <div className="flex items-center gap-4">
                    <div>
                        {/* Redireciona para /apps/new */}
                        <Button variant="outline" size="sm" onClick={() => router.push("/apps/new")}>
                            Novo App
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {apps.map((app) => (
                    <div
                        key={app.id}
                        onClick={() => router.push(`/apps/${app.slug}`)}
                        data-slug={app.slug}
                        className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-md cursor-pointer transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-primary-50 rounded-lg text-indigo-600">
                                <Layout size={24} />
                            </div>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{app.name}</h3>
                        <p className="text-sm text-gray-500">{app.slug}</p>
                    </div>
                ))}
            </div>

        </div>
    )
}