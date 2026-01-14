'use client'

import React, { useState } from 'react'
import { Project, SectionDefinition } from '@/lib/types'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Layout, Boxes, Terminal, Trash2, Edit3, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { deleteSectionDefinition } from '@/actions/sections'
import { useRouter } from 'next/navigation'
import { SectionDefinitionDialog } from '@/components/cms/SectionDefinitionDialog'
import { DeleteSectionDefinitionDialog } from '@/components/cms/DeleteSectionDefinitionDialog'

interface SectionsIndexProps {
    project: Project
    role?: string
}

export const SectionsIndex: React.FC<SectionsIndexProps> = ({ project, role }) => {
    const { toast } = useToast()
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [editingSection, setEditingSection] = useState<SectionDefinition | null>(null)
    const [sectionToDelete, setSectionToDelete] = useState<SectionDefinition | null>(null)

    const handleCreate = () => {
        setEditingSection(null)
        setIsDialogOpen(true)
    }

    const handleEdit = (section: SectionDefinition) => {
        setEditingSection(section)
        setIsDialogOpen(true)
    }

    const initiateDelete = (section: SectionDefinition) => {
        setSectionToDelete(section)
        setIsDeleteDialogOpen(true)
    }

    const handleDelete = async () => {
        if (!sectionToDelete) return

        setLoading(sectionToDelete.id)
        const { error } = await deleteSectionDefinition(sectionToDelete.id)

        if (error) {
            toast({
                title: "Error deleting section",
                description: error,
                variant: "destructive"
            })
        } else {
            toast({
                title: "Section deleted",
                description: `"${sectionToDelete.name}" has been removed.`,
            })
            setIsDeleteDialogOpen(false)
            router.refresh()
        }
        setLoading(null)
    }

    return (
        <div className="space-y-10 p-8 max-w-7xl mx-auto">
            <PageHeader
                title="Sections Library"
                description="Manage UI components and schemas for your mobile storefront"
            >
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl border-gray-100 hover:bg-primary/5 text-gray-600 font-bold group">
                        <Terminal size={16} className="mr-2 group-hover:text-primary" />
                        AI Architect
                    </Button>
                    <Button
                        onClick={handleCreate}
                        className="h-12 px-8 bg-black hover:bg-gray-800 text-white font-black rounded-2xl shadow-xl shadow-black/10 transition-all active:scale-95"
                    >
                        <Plus size={20} className="mr-2" />
                        Nova Seção
                    </Button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {project.sectionDefinitions.map((def) => (
                    <div
                        key={def.id}
                        className="group relative bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col justify-between min-h-[240px]"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors" />

                        <div className="relative">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                                    <Boxes size={28} />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(def)}
                                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    {(role === 'developer' || role === 'owner' || role === 'admin') && (
                                        <button
                                            onClick={() => initiateDelete(def)}
                                            disabled={loading === def.id}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            {loading === def.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <h3 className="font-black text-gray-900 text-2xl tracking-tight mb-2 group-hover:text-primary transition-colors">{def.name}</h3>
                            <p className="text-sm font-medium text-gray-500 line-clamp-2 leading-relaxed">
                                {def.description || "Componente sem descrição definida."}
                            </p>
                        </div>

                        <div className="pt-6 border-t border-gray-50 flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                                <Layout size={14} className="text-primary" />
                                {Object.keys(def.schema.properties || {}).length} Camadas
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${def.project_id ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                {def.project_id ? "Custom" : "System"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {project.sectionDefinitions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-6 text-gray-300">
                        <Boxes size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">Nenhuma seção</h3>
                    <p className="text-gray-500 max-w-xs text-center mt-2 font-medium">Você ainda não criou nenhum blueprint de componente UI.</p>
                </div>
            )}
            <SectionDefinitionDialog
                projectId={project.id}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                section={editingSection}
            />

            <DeleteSectionDefinitionDialog
                sectionName={sectionToDelete?.name || ''}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDelete}
                loading={!!loading && loading === sectionToDelete?.id}
            />
        </div>
    )
}
