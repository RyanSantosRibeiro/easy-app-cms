'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { createProject, updateProjectTheme, updateProjectMenus } from '@/actions/projects'
import {
    Check,
    ArrowRight,
    Rocket,
    Palette,
    Image as ImageIcon,
    Menu as MenuIcon,
    ChevronRight,
    Loader2,
    Layout,
    Type,
    Sparkles,
    Loader2Icon
} from 'lucide-react'
import { Project } from '@/lib/types'
import { ThemeIndex } from '@/app/apps/[slug]/theme/theme-index'
import { MenuBuilder } from '@/components/cms/MenuBuilder'
import { AssetPickerDialog } from '@/components/cms/AssetPickerDialog'

interface CreateProjectFlowProps {
    companyId: string
}

type Step = 'info' | 'theme' | 'logo' | 'menus' | 'success'

const PRESET_THEMES = [
    {
        id: 'ocean',
        name: 'Ocean Blue',
        colors: { base: "#ffffff", primary: "#1ca0b5", secondary: "#f0f2f5", accent: "#008f6f", neutral: "#54656f" }
    },
    {
        id: 'midnight',
        name: 'Midnight Dark',
        colors: { base: "#121212", primary: "#6366f1", secondary: "#1e293b", accent: "#818cf8", neutral: "#94a3b8" }
    },
    {
        id: 'rose',
        name: 'Rose Fashion',
        colors: { base: "#ffffff", primary: "#db2777", secondary: "#fff1f2", accent: "#be185d", neutral: "#71717a" }
    },
    {
        id: 'forest',
        name: 'Forest Nature',
        colors: { base: "#ffffff", primary: "#059669", secondary: "#f0fdf4", accent: "#047857", neutral: "#4b5563" }
    },
    {
        id: 'sunset',
        name: 'Sunset Glow',
        colors: { base: "#ffffff", primary: "#ea580c", secondary: "#fff7ed", accent: "#c2410c", neutral: "#4b5563" }
    },
    {
        id: 'minimal',
        name: 'Minimal Slate',
        colors: { base: "#ffffff", primary: "#0f172a", secondary: "#f8fafc", accent: "#334155", neutral: "#64748b" }
    }
]

export const CreateProjectFlow: React.FC<CreateProjectFlowProps> = ({ companyId }) => {
    const { toast } = useToast()
    const router = useRouter()

    const [activeStep, setActiveStep] = useState<Step>('info')
    const [loading, setLoading] = useState(false)
    const [project, setProject] = useState<Project | null>(null)
    const [assetPickerOpen, setAssetPickerOpen] = useState(false)
    const [localMenus, setLocalMenus] = useState<any>(null)

    // Step 0: Info state
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [autoSlug, setAutoSlug] = useState(true)

    const slugify = (text: string) => {
        return text.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^\w-]+/g, '');
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setName(val)
        if (autoSlug) {
            setSlug(slugify(val))
        }
    }

    const handleCreateProject = async () => {
        if (!name || !slug) {
            toast({
                title: "Campos obrigatórios",
                description: "Preencha o nome e o slug do projeto.",
                variant: "destructive"
            })
            return
        }

        setLoading(true)
        const result = await createProject({
            name,
            slug,
            company_id: companyId
        })

        if (result.error) {
            toast({
                title: "Erro ao criar projeto",
                description: result.error,
                variant: "destructive"
            })
        } else {
            setProject(result.data as Project)
            setActiveStep('theme')
            toast({
                title: "Projeto criado!",
                description: "Agora vamos configurar a identidade visual.",
            })
        }
        setLoading(false)
    }

    const handleComplete = async () => {
        if (!project) return
        setLoading(true)

        // Save the latest menus if we touched them
        if (localMenus) {
            await updateProjectMenus(project.id, {
                ...project.menus,
                horizontal: { items: localMenus }
            })
        }

        toast({
            title: "Projeto Finalizado! 🚀",
            description: "Seu aplicativo está pronto para ser gerenciado.",
        })
        router.push(`/apps/${project.slug}`)
    }

    // Progress Bar Component
    const steps = [
        { id: 'info', label: 'Básico', icon: Rocket },
        { id: 'theme', label: 'Tema', icon: Palette },
        { id: 'logo', label: 'Marca', icon: ImageIcon },
        { id: 'menus', label: 'Menu', icon: MenuIcon },
    ]

    const currentIndex = steps.findIndex(s => s.id === activeStep)

    const StepIndicator = () => (
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto px-4">
            {steps.map((s, idx) => {
                const Icon = s.icon
                const isCompleted = steps.findIndex(st => st.id === activeStep) > idx
                const isActive = activeStep === s.id

                return (
                    <React.Fragment key={s.id}>
                        <div className="flex flex-col items-center gap-2 relative z-10">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${isActive ? 'bg-primary text-white scale-110 shadow-primary/25' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : 'text-gray-400'}`}>{s.label}</span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className="flex-1 h-[2px] bg-gray-100 mx-4 -mt-5">
                                <div className={`h-full bg-primary transition-all duration-700`} style={{ width: isCompleted ? '100%' : '0%' }} />
                            </div>
                        )}
                    </React.Fragment>
                )
            })}
        </div>
    )

    if (activeStep === 'info') {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center py-10">
                <div className="w-full max-w-xl space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-4">
                            <Rocket size={40} className="animate-bounce" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-gray-900">Novo Projeto</h1>
                        <p className="text-gray-500 font-medium">Inicie a criação do seu novo aplicativo mobile em segundos.</p>
                    </div>

                    <Card className="p-8 border-gray-100 shadow-2xl shadow-gray-200/50 rounded-[2.5rem] bg-white">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Nome do Aplicativo</Label>
                                <Input
                                    placeholder="Ex: Minha Loja Fashion"
                                    className="h-14 rounded-2xl border-gray-100 focus:ring-primary/20 text-lg font-bold"
                                    value={name}
                                    onChange={handleNameChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Slug do Projeto</Label>
                                    <button
                                        type="button"
                                        onClick={() => setAutoSlug(!autoSlug)}
                                        className={`text-[10px] font-bold px-2 py-1 rounded-full border transition-colors ${autoSlug ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                                    >
                                        AUTO {autoSlug ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                                <Input
                                    placeholder="ex_minha_loja"
                                    className="h-14 rounded-2xl border-gray-100 focus:ring-primary/20 font-mono text-sm bg-gray-50/50"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    disabled={autoSlug}
                                />
                                <p className="text-[10px] text-gray-400 font-medium pl-1 italic">
                                    * Este será o identificador único na URL: /apps/{slug || 'nome_do_projeto'}
                                </p>
                            </div>

                            <Button
                                onClick={handleCreateProject}
                                disabled={loading}
                                className="w-full h-16 bg-black hover:bg-gray-800 text-white font-black rounded-2xl shadow-xl shadow-black/10 text-lg group transition-all active:scale-95"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin mr-2" />
                                ) : (
                                    <>
                                        Começar Configuração
                                        <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen space-y-12 py-10">
            <StepIndicator />

            <div>
                {activeStep === 'theme' && project && (
                    <div className="space-y-10">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black text-gray-900">Identidade Visual</h2>
                            <p className="text-gray-500 font-medium">Defina as cores e estilos do seu aplicativo.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Theme Cards List */}
                            <div className="grid grid-cols-2 gap-4">
                                {PRESET_THEMES.map((theme) => {
                                    const isSelected = project.theme?.colors?.primary === theme.colors.primary;
                                    return (
                                        <div
                                            key={theme.id}
                                            onClick={async () => {
                                                const updatedTheme = { ...project.theme, colors: theme.colors };
                                                setProject({ ...project, theme: updatedTheme });
                                                await updateProjectTheme(project.id, updatedTheme);
                                            }}
                                            className={`p-4 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 flex flex-col items-center gap-4 ${isSelected ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'}`}
                                        >
                                            <div className="flex gap-2">
                                                <div className="w-8 h-8 rounded-full border border-gray-100 shadow-sm" style={{ backgroundColor: theme.colors.primary }} />
                                                <div className="w-8 h-8 rounded-full border border-gray-100 shadow-sm" style={{ backgroundColor: theme.colors.accent }} />
                                                <div className="w-8 h-8 rounded-full border border-gray-100 shadow-sm" style={{ backgroundColor: theme.colors.base }} />
                                            </div>
                                            <span className={`text-xs font-black uppercase tracking-widest ${isSelected ? 'text-primary' : 'text-gray-400'}`}>
                                                {theme.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Mini Preview */}
                            <div className="bg-gray-50 rounded-[3rem] p-8 flex items-center justify-center border border-gray-100">
                                <div className="w-[220px] h-[400px] bg-white rounded-[2.5rem] border-[6px] border-black shadow-2xl overflow-hidden relative flex flex-col" style={{ backgroundColor: project.theme?.colors?.base }}>
                                    {/* Header */}
                                    <div className="h-14 w-full flex items-center justify-between px-4 mt-4">
                                        <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: project.theme?.colors?.primary + '20' }} />
                                        <div className="h-2 w-20 bg-gray-100 rounded-full" />
                                        <div className="w-8 h-8 rounded-full bg-gray-50" />
                                    </div>
                                    {/* Hero */}
                                    <div className="flex-1 px-4 space-y-4 pt-4">
                                        <div className="aspect-square w-full rounded-2xl" style={{ backgroundColor: project.theme?.colors?.primary }} />
                                        <div className="space-y-2">
                                            <div className="h-4 w-3/4 rounded-full" style={{ backgroundColor: project.theme?.colors?.neutral + '20' }} />
                                            <div className="h-3 w-1/2 rounded-full" style={{ backgroundColor: project.theme?.colors?.neutral + '10' }} />
                                        </div>
                                        <div className="h-10 w-full rounded-xl flex items-center justify-center text-[10px] font-black uppercase text-white shadow-lg" style={{ backgroundColor: project.theme?.colors?.primary }}>
                                            Comprar Agora
                                        </div>
                                    </div>
                                    {/* Bottom Bar */}
                                    <div className="h-12 w-full border-t border-gray-50 flex items-center justify-around">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`w-4 h-4 rounded ${i === 1 ? 'opacity-100' : 'opacity-20'}`} style={{ backgroundColor: project.theme?.colors?.primary }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center pt-6">
                            <Button onClick={() => setActiveStep('logo')} size="lg" className="h-14 px-10 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
                                Próximo Passo
                                <ArrowRight size={20} className="ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {activeStep === 'logo' && project && (
                    <div className="max-w-3xl mx-auto space-y-10">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black text-gray-900">Logo do App</h2>
                            <p className="text-gray-500 font-medium">Faça o upload da marca que aparecerá no cabeçalho.</p>
                        </div>

                        <Card className="p-12 border-dashed border-2 border-gray-200 rounded-[3rem] bg-gray-50/50 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="w-32 h-32 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden">
                                {project.logo_url ? (
                                    <img src={project.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <ImageIcon size={48} className="text-gray-200" />
                                )}
                            </div>

                            <Button
                                variant="outline"
                                className="h-14 px-8 rounded-2xl font-bold bg-white"
                                onClick={() => setAssetPickerOpen(true)}
                            >
                                Selecionar Imagem
                            </Button>

                            <AssetPickerDialog
                                slug={project.slug}
                                open={assetPickerOpen}
                                onOpenChange={setAssetPickerOpen}
                                onSelect={(url) => {
                                    setProject({ ...project, logo_url: url })
                                    toast({ title: "Logo selecionada!" })
                                }}
                            />
                            <p className="text-xs text-gray-400 font-medium max-w-xs leading-relaxed">
                                Formatos recomendados: PNG ou SVG transparente.<br />Tamanho mínimo: 512x512px.
                            </p>
                        </Card>

                        <div className="flex justify-center pt-6">
                            <Button onClick={() => setActiveStep('menus')} size="lg" className="h-14 px-10 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
                                Próximo Passo
                                <ArrowRight size={20} className="ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {activeStep === 'menus' && project && (
                    <div className="space-y-6">
                        <div className="text-center space-y-1">
                            <h2 className="text-2xl font-black text-gray-900">Navegação Principal</h2>
                            <p className="text-xs text-gray-500 font-medium">Organize a ordem dos itens arrastando-os. Você poderá editar nomes, links e ícones detalhadamente nas <strong>Configurações de Menu</strong> após concluir o projeto.</p>
                        </div>
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-inner overflow-visible p-4">
                            <MenuBuilder
                                project={project}
                                type="horizontal"
                                title="Menu Inferior (Tab Bar)"
                                description="Os ícones principais que ficam na base do aplicativo."
                                isCompact={true}
                                onItemsChange={(items) => setLocalMenus(items)}
                            />
                        </div>
                        <div className="flex justify-center pt-2 gap-4">
                            <Button
                                onClick={handleComplete}
                                disabled={loading}
                                size="lg"
                                className="h-14 px-10 rounded-2xl font-black text-xl shadow-2xl shadow-green-500/30 bg-green-500 hover:bg-green-600 transition-all active:scale-95 group"
                            >
                                {loading ? (
                                    <Loader2Icon size={24} className="animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles size={20} className="mr-2 group-hover:animate-pulse" />
                                        Concluir Projeto
                                        <Check size={20} className="ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
