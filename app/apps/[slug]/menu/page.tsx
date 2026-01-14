import { createClient } from "@/lib/supabase/server"
import { getProject } from "@/utils/supabase/queries"
import { FeaturePreview } from "@/components/FeaturePreview"
import { PageHeader } from "@/components/PageHeader"
import { Card } from "@/components/ui/card"
import { Menu, Layout, Sidebar as SidebarIcon } from "lucide-react"
import Link from "next/link"

export default async function MenuPage({ params }: { params: { slug: string } }) {
    const { slug } = await params

    return (
        <div className="container mx-auto p-6 space-y-6">
            <PageHeader
                title="Configurações de Menu"
                description="Escolha qual menu você deseja configurar para o seu projeto."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href={`/apps/${slug}/menu-horizontal`}>
                    <Card className="p-8 hover:border-primary transition-all group cursor-pointer h-full flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Layout size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Menu Horizontal</h3>
                            <p className="text-sm text-gray-500">Links de navegação do topo do site</p>
                        </div>
                    </Card>
                </Link>

                <Link href={`/apps/${slug}/menu-lateral`}>
                    <Card className="p-8 hover:border-primary transition-all group cursor-pointer h-full flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <SidebarIcon size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Menu Lateral</h3>
                            <p className="text-sm text-gray-500">Navegação móvel e drawer lateral</p>
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
