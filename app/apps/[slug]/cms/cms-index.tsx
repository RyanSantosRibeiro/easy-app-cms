'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Project, AppPage, SectionDefinition, PageSection, PageVersion } from '@/lib/types';
import { DynamicForm } from '@/components/DynamicForm';
import { PageHeader } from '@/components/PageHeader';
import { CreatePageDialog } from '@/components/cms/CreatePageDialog';
import { AddSectionDialog } from '@/components/cms/AddSectionDialog';
import { CreateDraftDialog } from '@/components/cms/CreateDraftDialog';

import { Plus, Edit3, Trash2, Layout, Save, X, ArrowLeft, History, Copy, CheckCircle, UploadCloud, Loader2, ArrowRight, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { createPage, createDraft, publishVersion, addSection, updateSectionContent, removeSection, reorderSections } from '@/actions/cms';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface CMSProps {
    project: Project;
}

export const CMS: React.FC<CMSProps> = ({ project }) => {
    const router = useRouter();
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
    const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
    const [showSectionPicker, setShowSectionPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    // Dialog State
    const [isCreatePageOpen, setIsCreatePageOpen] = useState(false);
    const [isCreateDraftOpen, setIsCreateDraftOpen] = useState(false);

    // Editor State
    const [editorContent, setEditorContent] = useState<any>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Derived state
    const selectedPage = project?.pages?.find(p => p.id === selectedPageId);
    const selectedVersion = selectedPage?.versions.find(v => v.id === selectedVersionId);

    // Ensure a version is selected when page changes
    useEffect(() => {
        if (selectedPage && !selectedVersionId) {
            // Prefer published, otherwise first (usually newest due to fetch order or insert order)
            const published = selectedPage.versions.find(v => v.status === 'PUBLISHED');
            setSelectedVersionId(published ? published.id : selectedPage.versions[0]?.id);
        }
    }, [selectedPageId, selectedPage, selectedVersionId]);

    // Initialize editor content when section changes
    useEffect(() => {
        if (editingSectionId && selectedVersion) {
            const section = selectedVersion.sections.find(s => s.id === editingSectionId);
            if (section) {
                setEditorContent(section.content || {});
            }
        }
    }, [editingSectionId, selectedVersion]);

    // handleCreatePage removed in favor of dialog logic internal to CreatePageDialog and wrapper

    // replaced with dialog
    const handleCreateDraft = () => {
        if (!selectedPage || !selectedVersion) return;
        setIsCreateDraftOpen(true);
    };

    const handlePublish = async () => {
        if (!selectedPage || !selectedVersion) return;
        if (!confirm(`Are you sure you want to publish "${selectedVersion.name}"? This will archive the current live version.`)) return;

        setLoading(true);
        const { error } = await publishVersion(selectedPage.id, selectedVersion.id);
        if (error) {
            alert(`Error publishing version: ${error}`);
        } else {
            router.refresh();
        }
        setLoading(false);
    };

    const handleAddSection = async (def: SectionDefinition) => {
        if (!selectedPage || !selectedVersion) return;

        setLoading(true);
        const orderIndex = selectedVersion.sections.length;
        const { error, data } = await addSection(selectedVersion.id, def.id, orderIndex);

        if (error) {
            alert(`Error adding section: ${error}`);
        } else {
            await router.refresh();
            setShowSectionPicker(false);
            if (data) setEditingSectionId(data.id);
        }
        setLoading(false);
    };

    // Auto-save debounce
    const handleContentChange = (newContent: any) => {
        setEditorContent(newContent);
        setIsSaving(true);

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(async () => {
            if (editingSectionId) {
                await updateSectionContent(editingSectionId, newContent);
                setIsSaving(false);
                // We don't refresh router here to avoid UI jumpiness during typing
            }
        }, 1000);
    };

    const handleDoneEditing = () => {
        setEditingSectionId(null);
        // Refresh to ensure all timestamps/server state is synced
        router.refresh();
    };

    const handleRemoveSection = async (sectionId: string) => {
        if (!selectedPage || !selectedVersion) return;
        if (!confirm("Delete this section?")) return;

        setLoading(true);
        const { error } = await removeSection(sectionId);

        if (error) {
            alert(`Error deleting section: ${error}`);
        } else {
            router.refresh();
        }
        setLoading(false);
    }

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination || !selectedVersion) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) return;

        // Optimistic Update
        const sections = [...selectedVersion.sections].sort((a, b) => a.order_index - b.order_index);
        const [removed] = sections.splice(sourceIndex, 1);
        sections.splice(destinationIndex, 0, removed);

        // Update order indexes locally
        const updatedSections = sections.map((s, index) => ({
            ...s,
            order_index: index
        }));

        const updates = updatedSections.map(s => ({
            id: s.id,
            order_index: s.order_index
        }));

        setLoading(true);
        await reorderSections(updates);
        router.refresh();
        setLoading(false);
    };

    const sortedSections = selectedVersion?.sections ? [...selectedVersion.sections].sort((a, b) => a.order_index - b.order_index) : [];

    // --- RENDER ---

    // 1. Page List View
    if (!selectedPageId) {
        return (
            <div className="space-y-6 p-6">
                {/* Header */}
                <PageHeader
                    title="Pages"
                    description="Manage your app pages and versions"
                >
                    <Button
                        onClick={() => setIsCreatePageOpen(true)}
                        title="Create new page"
                    >
                        <Plus size={16} className="mr-2" />
                        Create Page
                    </Button>
                </PageHeader>
                <CreatePageDialog
                    projectId={project.id}
                    open={isCreatePageOpen}
                    onOpenChange={setIsCreatePageOpen}
                    onSuccess={(pageId) => setSelectedPageId(pageId)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project?.pages?.map(page => {
                        const activeVersion = page.versions.find(v => v.status === 'PUBLISHED') || page.versions[0];
                        return (
                            <div
                                key={page.id}
                                onClick={() => setSelectedPageId(page.id)}
                                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-md cursor-pointer transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                        <Layout size={24} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mb-1 ${activeVersion?.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {activeVersion?.status || 'EMPTY'}
                                        </span>
                                        <span className="text-xs font-mono text-gray-400">{activeVersion?.sections?.length || 0} sections</span>
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg mb-1">{page.title}</h3>
                                <p className="text-sm text-gray-500">{page.slug}</p>
                            </div>
                        );
                    })}
                    {(!project?.pages || project.pages.length === 0) && (
                        <div className="col-span-3 text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                            <p>No pages yet. Create one to get started.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // 2. Single Page Editor
    if (!selectedPage) return <div>Page not found</div>; // Should not happen

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">

            {/* Version Header Bar */}
            <div className="bg-white p-3 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedPageId(null)} className="hover:bg-gray-100 p-2 rounded-lg text-gray-500">
                        <ArrowLeft size={18} />
                    </button>
                    <div className="border-r border-gray-200 pr-4">
                        <h3 className="font-bold text-gray-900">{selectedPage.title}</h3>
                        <p className="text-xs text-gray-500">{selectedPage.slug}</p>
                    </div>

                    {/* Version Selector */}
                    {/* Version Selector - Side Drawer */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2 border-dashed border-gray-300">
                                <History size={16} className="text-gray-500" />
                                <span className="text-gray-700 font-medium">
                                    {selectedVersion?.name || 'Versions'}
                                </span>
                                {selectedVersion?.status === 'PUBLISHED' && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">LIVE</span>}
                                {selectedVersion?.status === 'DRAFT' && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold">DRAFT</span>}
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Version History</SheetTitle>
                                <SheetDescription>
                                    View and switch between different versions of this page.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 flex flex-col gap-3 max-h-[80vh] overflow-y-auto px-2">
                                {selectedPage.versions
                                    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()) // Sort by newest
                                    .map(v => (
                                        <button
                                            key={v.id}
                                            onClick={() => {
                                                setSelectedVersionId(v.id)
                                            }}
                                            className={`cursor-pointer flex flex-col items-start p-3 rounded-lg border text-left transition-all hover:shadow-sm
                                            ${selectedVersionId === v.id
                                                    ? 'bg-primary/5 border-primary ring-1 ring-primary/20'
                                                    : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            <div className="flex items-center justify-between w-full mb-1">
                                                <span className={`text-sm font-bold ${selectedVersionId === v.id ? 'text-primary' : 'text-gray-800'}`}>
                                                    {v.name}
                                                </span>
                                                {v.status === 'PUBLISHED' && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">LIVE</span>}
                                                {v.status === 'DRAFT' && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold">DRAFT</span>}
                                                {v.status === 'ARCHIVED' && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold">ARCHIVED</span>}
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Date(v.updated_at).toLocaleDateString()} at {new Date(v.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="text-xs text-gray-400 mt-1">
                                                {v.sections.length} sections
                                            </span>
                                        </button>
                                    ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleCreateDraft}
                        title="Clone current version to new draft"
                        variant="outline"
                        size="sm"
                        disabled={loading}
                    >
                        <Copy size={14} className="mr-2" /> New Draft
                    </Button>
                    {selectedVersion?.status === 'DRAFT' && (
                        <Button
                            onClick={handlePublish}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" size={14} /> : <UploadCloud size={14} className="mr-2" />}
                            Publish
                        </Button>
                    )}
                    {selectedPage && selectedVersion && (
                        <CreateDraftDialog
                            open={isCreateDraftOpen}
                            onOpenChange={setIsCreateDraftOpen}
                            pageId={selectedPage.id}
                            fromVersionId={selectedVersion.id}
                            fromVersionName={selectedVersion.name}
                            onSuccess={(newVersionId) => setSelectedVersionId(newVersionId)}
                        />
                    )}
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Section List (Sidebar) */}
                <div className="w-1/3 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {selectedVersion?.name} Sections
                        </span>
                        {loading && <Loader2 size={14} className="animate-spin text-indigo-500" />}
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="sections-list">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="space-y-3"
                                    >
                                        {sortedSections.map((section, idx) => {
                                            const def = project.sectionDefinitions.find(d => d.id === section.section_definition_id);
                                            return (
                                                <Draggable key={section.id} draggableId={section.id} index={idx} isDragDisabled={selectedVersion?.status !== 'DRAFT'}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={`p-3 rounded-lg border text-sm cursor-pointer transition-all flex justify-between items-center group
                                                    ${editingSectionId === section.id
                                                                    ? 'border-primary bg-indigo-50 ring-1 ring-indigo-500'
                                                                    : 'border-gray-200 hover:border-primary/30 bg-white'}
                                                    ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/50 rotate-1' : ''}    
                                                `}
                                                            onClick={() => setEditingSectionId(section.id)}
                                                            style={provided.draggableProps.style}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div {...provided.dragHandleProps} className="cursor-grab text-gray-400 hover:text-gray-600">
                                                                    <GripVertical size={14} />
                                                                </div>
                                                                <span className="text-xs bg-gray-200 text-gray-500 w-5 h-5 flex items-center justify-center rounded-full">{idx + 1}</span>
                                                                <span className="font-medium text-gray-700">
                                                                    {def?.name || 'Unknown Section'}
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleRemoveSection(section.id); }}
                                                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                        <AddSectionDialog
                            open={showSectionPicker}
                            onOpenChange={setShowSectionPicker}
                            sectionDefinitions={project.sectionDefinitions}
                            onSelect={handleAddSection}
                        />

                        <button
                            onClick={() => setShowSectionPicker(true)}
                            disabled={selectedVersion?.status !== 'DRAFT'} // Prevent adding to published
                            className={`w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 transition-colors text-sm font-medium flex justify-center items-center gap-2
                    ${selectedVersion?.status === 'DRAFT' ? 'hover:border-primary/4000 hover:text-indigo-600 hover:bg-indigo-50' : 'opacity-50 cursor-not-allowed'}`}
                        >
                            <Plus size={16} /> Add Section {selectedVersion?.status !== 'DRAFT' && '(Draft Only)'}
                        </button>
                    </div>
                </div>

                {/* Main Form Area */}
                <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
                    {editingSectionId ? (
                        <>
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <Edit3 size={16} className="text-indigo-500" />
                                    Edit Content
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400 mr-2 flex items-center gap-1">
                                        {isSaving ? <><Loader2 size={10} className="animate-spin" /> Saving...</> : 'Saved'}
                                    </span>
                                    <button
                                        onClick={handleDoneEditing}
                                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 flex items-center gap-1"
                                    >
                                        <CheckCircle size={12} /> Done
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1">
                                {(() => {
                                    // Find section definition
                                    const section = selectedVersion?.sections.find(s => s.id === editingSectionId);
                                    if (!section) return <div className="text-red-500">Section not found</div>;
                                    const def = project.sectionDefinitions.find(d => d.id === section.section_definition_id);
                                    if (!def) return <p>Definition not found</p>;

                                    return (
                                        <div key={editingSectionId} className="animate-in fade-in duration-300">
                                            <DynamicForm
                                                schema={def.schema}
                                                data={editorContent}
                                                onChange={handleContentChange}
                                            />
                                        </div>
                                    )
                                })()}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
                            <Layout size={48} className="mb-4 opacity-20" />
                            <p>Select a section to edit its content</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};