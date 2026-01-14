import { createClient } from "@/lib/supabase/server"
import { getCompany } from "@/utils/supabase/queries"
import { redirect } from "next/navigation"
import { CreateProjectFlow } from "./create-project-flow"

export default async function CreatePage() {
    const supabase = await createClient()
    const company = await getCompany(supabase as any)

    if (!company) {
        // Handle no company case
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold">Empresa não encontrada</h1>
                    <p className="text-gray-500">Você precisa estar vinculado a uma empresa para criar um projeto.</p>
                </div>
            </div>
        )
    }

    const projectsCount = company.projects?.length || 0;
    const isLimitReached = projectsCount > 3;

    if (isLimitReached) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
                <div className="w-24 h-24 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mb-8 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Limite de Projetos Atingido</h1>
                <p className="text-gray-500 font-medium max-w-sm leading-relaxed mb-10">
                    Você atingiu o limite de 3 projetos no seu plano atual. <br />
                    Remova um projeto existente ou faça upgrade para criar novos.
                </p>
                <div className="flex gap-4">
                    <a
                        href="/dashboard/apps"
                        className="h-14 px-8 flex items-center bg-black text-white font-black rounded-2xl hover:bg-gray-800 transition-all active:scale-95"
                    >
                        Gerenciar Projetos
                    </a>
                    <a
                        href="/dashboard/settings"
                        className="h-14 px-8 flex items-center bg-white border border-gray-200 text-gray-900 font-black rounded-2xl hover:bg-gray-50 transition-all active:scale-95"
                    >
                        Ver Planos
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto">
            <CreateProjectFlow companyId={company.id} />
        </div>
    )
}
