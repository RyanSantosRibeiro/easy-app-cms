'use client'

import React, { useState, useEffect, useRef } from 'react'
import { uploadFile, listFiles, deleteFile } from '@/actions/storage'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, UploadCloud, Trash2, File as FileIcon, Image as ImageIcon, Copy, ExternalLink, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FileObject {
    name: string
    id?: string | null
    updated_at: string
    created_at: string
    last_accessed_at: string
    metadata: Record<string, any>
    publicUrl?: string
}

interface AssetsProps {
    slug: string
}

export default function Assets({ slug }: AssetsProps) {
    const { toast } = useToast()

    const [files, setFiles] = useState<FileObject[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const fetchFiles = async () => {
        setLoading(true)
        const { data, error } = await listFiles(slug)
        if (error) {
            console.error(error)
            toast({
                title: "Error loading assets",
                description: "Could not retrieve your files from storage.",
                variant: "destructive"
            })
        } else if (data) {
            setFiles(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchFiles()
    }, [slug])

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        const { data, error } = await uploadFile(formData, slug)

        if (error) {
            toast({
                title: "Upload failed",
                description: error,
                variant: "destructive"
            })
        } else {
            toast({
                title: "Upload successful",
                description: `File "${file.name}" has been uploaded.`,
            })
            await fetchFiles()
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        setUploading(false)
    }

    const handleDelete = async (filename: string) => {
        if (!confirm(`Delete ${filename}?`)) return

        // Optimistic update
        const oldFiles = [...files]
        setFiles(files.filter(f => f.name !== filename))

        const { error } = await deleteFile(`${slug}/${filename}`, slug)

        if (error) {
            toast({
                title: "Delete failed",
                description: error,
                variant: "destructive"
            })
            setFiles(oldFiles) // Revert
        } else {
            toast({
                title: "File deleted",
                description: `"${filename}" was removed successfully.`,
            })
        }
    }

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url)
        toast({
            title: "Copied to clipboard",
            description: "The asset URL is now in your clipboard.",
        })
    }

    const isImage = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase()
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')
    }

    return (
        <div className="space-y-10">
            {loading && files.length === 0 ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            ) : files.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-6 text-gray-300">
                        <ImageIcon size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">Nenhum asset ainda</h3>
                    <p className="text-gray-500 max-w-xs text-center mt-2 font-medium">Faça o upload de imagens ou arquivos para usar no seu projeto mobile.</p>
                    <Button
                        onClick={handleUploadClick}
                        className="mt-8 h-12 px-8 bg-black hover:bg-gray-800 text-white font-black rounded-2xl shadow-xl shadow-black/10 transition-all active:scale-95"
                    >
                        Subir Primeiro Arquivo
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {files.map((file) => (
                        <div
                            key={file.id || file.name}
                            className="group relative bg-white rounded-[2rem] border border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden"
                        >
                            <div className="aspect-square bg-gray-50 relative flex items-center justify-center overflow-hidden">
                                {isImage(file.name) && file.publicUrl ? (
                                    <img
                                        src={file.publicUrl}
                                        alt={file.name}
                                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                ) : (
                                    <FileIcon className="text-gray-300 w-12 h-12" />
                                )}

                                {/* Premium Overlay */}
                                <div className="absolute inset-x-0 bottom-0 top-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                    {file.publicUrl && (
                                        <>
                                            <button
                                                onClick={() => copyToClipboard(file.publicUrl!)}
                                                className="bg-white p-3 rounded-2xl hover:bg-primary hover:text-white text-gray-900 transition-all duration-300 active:scale-90"
                                                title="Copy URL"
                                            >
                                                <Copy size={20} />
                                            </button>
                                            <a
                                                href={file.publicUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-white p-3 rounded-2xl hover:bg-primary hover:text-white text-gray-900 transition-all duration-300 active:scale-90"
                                                title="Open in new tab"
                                            >
                                                <ExternalLink size={20} />
                                            </a>
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDelete(file.name)}
                                    className="absolute top-3 right-3 p-2 bg-white/90 text-gray-400 hover:text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-md"
                                    title="Delete file"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="p-4">
                                <p className="text-sm font-black text-gray-900 truncate mb-1" title={file.name}>
                                    {file.name}
                                </p>
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                                        {(file.metadata?.size / 1024).toFixed(1)} KB
                                    </p>
                                    <span className="text-[9px] font-black text-gray-300 uppercase">
                                        {new Date(file.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Float Upload Button or Header Trigger */}
            <div className={`fixed bottom-10 right-10 z-50 transition-all duration-500 ${files.length > 0 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                <Button
                    onClick={handleUploadClick}
                    className="w-16 h-16 bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center p-0 group"
                    disabled={uploading}
                >
                    {uploading ? (
                        <Loader2 className="animate-spin" size={24} />
                    ) : (
                        <UploadCloud size={28} className="transition-transform group-hover:-translate-y-1" />
                    )}
                </Button>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    )
}