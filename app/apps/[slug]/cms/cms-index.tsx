'use client'
import React, { useState, useEffect } from 'react';
import { Project, AppPage, SectionDefinition, PageSection, PageVersion } from '@/lib/types';
import { DynamicForm } from '@/components/DynamicForm';
import { Plus, Edit3, Trash2, Layout, Save, X, ArrowLeft, History, Copy, CheckCircle, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CMSProps {
    project: Project;
}

export const CMS: React.FC<CMSProps> = ({ project
 }) => {
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
    const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
    const [showSectionPicker, setShowSectionPicker] = useState(false);

    const onUpdateProject = (p: Project) => {
        console.log(p);
    }

    // Derived state
    const selectedPage = project?.pages?.find(p => p.id === selectedPageId);
    const selectedVersion = selectedPage?.versions.find(v => v.id === selectedVersionId);

    // Ensure a version is selected when page changes
    useEffect(() => {
        if (selectedPage && !selectedVersionId) {
            // Prefer published, otherwise first
            const published = selectedPage.versions.find(v => v.status === 'PUBLISHED');
            setSelectedVersionId(published ? published.id : selectedPage.versions[0]?.id);
        }
    }, [selectedPageId, selectedPage]);


    const handleCreatePage = () => {
        const newPage: AppPage = {
            id: crypto.randomUUID(),
            title: 'New Page',
            slug: '/new-page',
            versions: [
                {
                    id: crypto.randomUUID(),
                    name: 'Initial Draft',
                    status: 'DRAFT',
                    updated_at: new Date().toISOString(),
                    sections: []
                }
            ]
        };
        const updatedProject = { ...project, pages: [...project.pages, newPage] };
        onUpdateProject(updatedProject);
        setSelectedPageId(newPage.id);
        setSelectedVersionId(newPage.versions[0].id);
    };

    const handleCreateDraft = () => {
        if (!selectedPage || !selectedVersion) return;
        
        const newVersion: PageVersion = {
            id: crypto.randomUUID(),
            name: `Draft from ${selectedVersion.name}`,
            status: 'DRAFT',
            updated_at: new Date().toISOString(),
            // Deep copy sections to avoid reference issues
            sections: JSON.parse(JSON.stringify(selectedVersion.sections))
        };

        const updatedPage = {
            ...selectedPage,
            versions: [newVersion, ...selectedPage.versions] // Newest first
        };
        updatePage(updatedPage);
        setSelectedVersionId(newVersion.id);
    };

    const handlePublish = () => {
        if (!selectedPage || !selectedVersion) return;
        
        const updatedVersions = selectedPage.versions.map(v => {
            if (v.id === selectedVersion.id) {
                return { ...v, status: 'PUBLISHED' as const, updated_at: new Date().toISOString() };
            }
            if (v.status === 'PUBLISHED') {
                return { ...v, status: 'ARCHIVED' as const };
            }
            return v;
        });

        const updatedPage = { ...selectedPage, versions: updatedVersions };
        updatePage(updatedPage);
    };

    const updatePage = (updatedPage: AppPage) => {
        const updatedPages = project?.pages?.map(p => p.id === updatedPage.id ? updatedPage : p);
        onUpdateProject({ ...project, pages: updatedPages });
    };

    // --- Section Management (Operates on Selected Version) ---

    const handleAddSection = (def: SectionDefinition) => {
        if (!selectedPage || !selectedVersion) return;
        const newSection: PageSection = {
            id: crypto.randomUUID(),
            section_definition_id: def.id,
            order_index: selectedVersion.sections.length,
            content: {} // DynamicForm will initialize default values
        };
        
        const updatedVersion = {
            ...selectedVersion,
            sections: [...selectedVersion.sections, newSection]
        };

        const updatedPage = {
            ...selectedPage,
            versions: selectedPage.versions.map(v => v.id === updatedVersion.id ? updatedVersion : v)
        };

        updatePage(updatedPage);
        setShowSectionPicker(false);
        setEditingSectionId(newSection.id);
    };

    const handleUpdateSectionContent = (sectionId: string, newContent: any) => {
        if (!selectedPage || !selectedVersion) return;
        
        const updatedSections = selectedVersion.sections.map(s => 
            s.id === sectionId ? { ...s, content: newContent } : s
        );

        const updatedVersion = { ...selectedVersion, sections: updatedSections };
        const updatedPage = {
             ...selectedPage, 
             versions: selectedPage.versions.map(v => v.id === updatedVersion.id ? updatedVersion : v)
        };
        updatePage(updatedPage);
    };

    const handleRemoveSection = (sectionId: string) => {
        if(!selectedPage || !selectedVersion) return;
        const updatedSections = selectedVersion.sections.filter(s => s.id !== sectionId);
        
        const updatedVersion = { ...selectedVersion, sections: updatedSections };
        const updatedPage = {
             ...selectedPage, 
             versions: selectedPage.versions.map(v => v.id === updatedVersion.id ? updatedVersion : v)
        };
        updatePage(updatedPage);
    }

    // --- RENDER ---

    // 1. Page List View
    if (!selectedPageId) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Pages</h2>
                    <Button 
                        onClick={handleCreatePage}
                        title="Create new page"
                    >
                        <Plus size={16} /> Create Page
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project?.pages?.map(page => {
                        const activeVersion = page.versions.find(v => v.status === 'PUBLISHED') || page.versions[0];
                        return (
                            <div 
                                key={page.id}
                                onClick={() => setSelectedPageId(page.id)}
                                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                        <Layout size={24} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mb-1 ${activeVersion?.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {activeVersion?.status || 'EMPTY'}
                                        </span>
                                        <span className="text-xs font-mono text-gray-400">{activeVersion?.sections.length || 0} sections</span>
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg mb-1">{page.title}</h3>
                                <p className="text-sm text-gray-500">{page.slug}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // 2. Single Page Editor
    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
            
            {/* Version Header Bar */}
            <div className="bg-white p-3 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedPageId(null)} className="hover:bg-gray-100 p-2 rounded-lg text-gray-500">
                        <ArrowLeft size={18}/>
                    </button>
                    <div className="border-r border-gray-200 pr-4">
                        <h3 className="font-bold text-gray-900">{selectedPage.title}</h3>
                        <p className="text-xs text-gray-500">{selectedPage.slug}</p>
                    </div>
                    
                    {/* Version Selector */}
                    <div className="flex items-center gap-2">
                        <History size={16} className="text-gray-400"/>
                        <select 
                            value={selectedVersionId || ''}
                            onChange={(e) => setSelectedVersionId(e.target.value)}
                            className="text-sm border-none bg-gray-50 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium text-gray-700"
                        >
                            {selectedPage.versions.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.status === 'PUBLISHED' ? '🟢 ' : v.status === 'DRAFT' ? '📝 ' : '📦 '}
                                    {v.name} ({new Date(v.updated_at).toLocaleDateString()})
                                </option>
                            ))}
                        </select>
                        {selectedVersion?.status === 'PUBLISHED' && (
                             <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">LIVE</span>
                        )}
                        {selectedVersion?.status === 'DRAFT' && (
                             <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold">DRAFT</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button 
                        onClick={handleCreateDraft}
                        title="Clone current version to new draft"
                    >
                        <Copy size={14}/> New Draft
                    </Button>
                    {selectedVersion?.status === 'DRAFT' && (
                        <button 
                            onClick={handlePublish}
                            className="text-sm bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium shadow-sm"
                        >
                            <UploadCloud size={14}/> Publish
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Section List (Sidebar) */}
                <div className="w-1/3 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {selectedVersion?.name} Sections
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {selectedVersion?.sections.map((section, idx) => {
                            const def = project.sectionDefinitions.find(d => d.id === section.section_definition_id);
                            return (
                                <div 
                                    key={section.id}
                                    className={`p-3 rounded-lg border text-sm cursor-pointer transition-all flex justify-between items-center group
                                        ${editingSectionId === section.id 
                                            ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' 
                                            : 'border-gray-200 hover:border-indigo-300 bg-white'}`}
                                    onClick={() => setEditingSectionId(section.id)}
                                >
                                    <div className="flex items-center gap-2">
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
                            );
                        })}
                        
                        {showSectionPicker ? (
                            <div className="mt-4 border border-dashed border-indigo-300 rounded-lg p-3 bg-indigo-50/50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-indigo-800 uppercase">Select Section Type</span>
                                    <button onClick={() => setShowSectionPicker(false)}><X size={14} className="text-indigo-400"/></button>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {project.sectionDefinitions.map(def => (
                                        <button
                                            key={def.id}
                                            onClick={() => handleAddSection(def)}
                                            className="text-left text-sm px-3 py-2 bg-white border border-indigo-100 rounded hover:border-indigo-400 hover:shadow-sm transition"
                                        >
                                            {def.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setShowSectionPicker(true)}
                                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors text-sm font-medium flex justify-center items-center gap-2"
                            >
                                <Plus size={16} /> Add Section
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Form Area */}
                <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
                    {editingSectionId ? (
                        <>
                             <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                 <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <Edit3 size={16} className="text-indigo-500"/>
                                    Edit Content
                                 </h3>
                                 <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400 mr-2">
                                        Changes save automatically to {selectedVersion?.status} version
                                    </span>
                                     <button 
                                        onClick={() => setEditingSectionId(null)}
                                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 flex items-center gap-1"
                                     >
                                        <CheckCircle size={12}/> Done
                                     </button>
                                 </div>
                             </div>
                             <div className="p-6 overflow-y-auto flex-1">
                                 {(() => {
                                     const section = selectedVersion?.sections.find(s => s.id === editingSectionId);
                                     if(!section) return null;
                                     const def = project.sectionDefinitions.find(d => d.id === section.section_definition_id);
                                     if(!def) return <p>Definition not found</p>;
                                     
                                     return (
                                         <DynamicForm 
                                            schema={def.schema} 
                                            data={section.content} 
                                            onChange={(newContent) => handleUpdateSectionContent(section.id, newContent)}
                                         />
                                     )
                                 })()}
                             </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <Layout size={48} className="mb-4 opacity-20"/>
                            <p>Select a section to edit its content</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};