'use client'

import React, { useState } from 'react'
import { Bell, Send, Clock, History, AlertCircle, CheckCircle2, Loader2, Smartphone, MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { sendPushNotification } from '@/actions/notifications'
import { Project } from '@/lib/types'
import { PageHeader } from '@/components/PageHeader'

interface NotificationsIndexProps {
    project: Project
}

export const NotificationsIndex: React.FC<NotificationsIndexProps> = ({ project }) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [data, setData] = useState('')

    const handleSendNow = async () => {
        if (!title || !body) {
            toast({
                title: "Campos obrigatórios",
                description: "Título e mensagem são necessários para enviar a notificação.",
                variant: "destructive"
            })
            return
        }

        setLoading(true)
        try {
            let parsedData = {}
            if (data) {
                try {
                    parsedData = JSON.parse(data)
                } catch (e) {
                    toast({
                        title: "JSON Inválido",
                        description: "O campo de dados adicionais deve ser um JSON válido.",
                        variant: "destructive"
                    })
                    setLoading(false)
                    return
                }
            }

            const result = await sendPushNotification(project.id, {
                title,
                body,
                data: parsedData
            })

            if (result.success) {
                toast({
                    title: "Sucesso!",
                    description: "Notificação enviada para a fila de processamento.",
                })
                setTitle('')
                setBody('')
                setData('')
            } else {
                toast({
                    title: "Erro ao enviar",
                    description: result.error,
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Erro inseperado",
                description: "Ocorreu um erro ao tentar enviar a notificação.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-10 p-8 max-w-7xl mx-auto">
            <PageHeader
                title="Push Notifications"
                description="Engaje seus usuários em tempo real com notificações diretas para o app."
            >
                <Button variant="outline" className="h-12 px-6 rounded-2xl border-gray-100 hover:bg-gray-50 text-gray-600 font-bold group">
                    <History size={16} className="mr-2 group-hover:text-primary transition-colors" />
                    Ver Histórico
                </Button>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Configuration Area */}
                <div className="lg:col-span-7 space-y-10">
                    <Card className="p-8 border-gray-100 shadow-xl shadow-gray-200/20 rounded-[2.5rem] bg-white relative overflow-hidden">
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 pb-6 border-b border-gray-50">
                                <Send className="text-primary" size={20} />
                                <h3 className="font-black text-xl">Nova Notificação</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Título da Notificação</Label>
                                    <Input
                                        placeholder="Ex: Oferta Relâmpago! ⚡"
                                        className="h-14 rounded-2xl border-gray-100 focus:ring-primary/20 text-lg font-bold"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Mensagem</Label>
                                    <Textarea
                                        placeholder="Digite o conteúdo que os usuários verão na tela de bloqueio..."
                                        className="min-h-[140px] rounded-2xl border-gray-100 focus:ring-primary/20 text-md resize-none"
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs font-black uppercase text-gray-400 tracking-widest pl-1">Dados Adicionais (JSON)</Label>
                                        <span className="text-[10px] font-bold text-gray-300">OPCIONAL</span>
                                    </div>
                                    <Textarea
                                        placeholder='{ "screen": "promo", "id": 123 }'
                                        className="min-h-[100px] font-mono text-xs rounded-2xl border-gray-100 focus:ring-primary/20 bg-gray-50/50"
                                        value={data}
                                        onChange={(e) => setData(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col md:flex-row gap-4">
                                <Button
                                    onClick={handleSendNow}
                                    disabled={loading}
                                    className="flex-1 h-14 bg-black hover:bg-gray-800 text-white font-black rounded-2xl shadow-xl shadow-black/10 text-lg group"
                                >
                                    {loading ? (
                                        <Loader2 className="mr-2 animate-spin" size={20} />
                                    ) : (
                                        <Send className="mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                                    )}
                                    Disparar Agora
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-14 px-8 rounded-2xl border-gray-100 text-gray-400 cursor-not-allowed group relative"
                                    disabled
                                >
                                    <Clock className="mr-2" size={20} />
                                    Agendar
                                    <span className="absolute -top-3 -right-2 bg-amber-100 text-amber-700 text-[9px] font-bold px-2 py-1 rounded-full border border-amber-200 shadow-sm animate-pulse">EM BREVE</span>
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Tips */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white">
                                <MessageSquare size={20} />
                            </div>
                            <h4 className="font-bold text-blue-900">Engajamento</h4>
                            <p className="text-xs text-blue-800/70 leading-relaxed">
                                Use emojis e chamadas para ação (CTAs) para aumentar a taxa de cliques (CTR) em até 40%.
                            </p>
                        </div>
                        <div className="p-6 rounded-3xl bg-purple-50 border border-purple-100 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white">
                                <AlertCircle size={20} />
                            </div>
                            <h4 className="font-bold text-purple-900">Privacidade</h4>
                            <p className="text-xs text-purple-800/70 leading-relaxed">
                                Lembre-se de não enviar informações sensíveis como senhas ou dados bancários por push.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="lg:col-span-5">
                    <div className="sticky top-6 space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Mockup</h3>
                        </div>

                        {/* Phone Mockup */}
                        <div className="relative mx-auto w-[300px] h-[600px] bg-black rounded-[3rem] border-[10px] border-[#1a1a1a] shadow-2xl overflow-hidden ring-4 ring-black/5">
                            {/* Wallpaper Mockup (Gradient) */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90" />

                            {/* Time Display */}
                            <div className="absolute top-12 inset-x-0 text-center text-white/90">
                                <h4 className="text-6xl font-black tracking-tighter">09:41</h4>
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 mt-2">Quinta-feira, 8 de Jan</p>
                            </div>

                            {/* Notification Banner */}
                            <div className="absolute top-48 inset-x-4">
                                <div className={`p-4 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl transition-all duration-500 transform ${title || body ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-black flex items-center justify-center">
                                                <Zap size={14} className="text-white fill-white" />
                                            </div>
                                            <span className="text-[10px] font-black text-white uppercase tracking-wider">EASYAPP</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-white/60">agora</span>
                                    </div>
                                    <div className="space-y-1">
                                        <h5 className="text-sm font-black text-white leading-tight">
                                            {title || 'Título da Notificação'}
                                        </h5>
                                        <p className="text-[12px] font-medium text-white/90 leading-snug line-clamp-3">
                                            {body || 'O texto da sua mensagem aparecerá aqui para os usuários.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Placeholder notifications below */}
                                <div className="mt-3 p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 opacity-40 blur-[1px]">
                                    <div className="h-4 w-24 bg-white/20 rounded-full mb-2" />
                                    <div className="h-3 w-full bg-white/10 rounded-full" />
                                </div>
                            </div>

                            {/* Lock Screen Bottom UI */}
                            <div className="absolute bottom-10 inset-x-0 flex justify-around items-center px-10">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20">
                                    <Icon name="Flashlight" />
                                </div>
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20">
                                    <Icon name="Camera" />
                                </div>
                            </div>

                            {/* Home Indicator */}
                            <div className="absolute bottom-1 inset-x-0 h-1.5 flex justify-center pb-1">
                                <div className="w-28 h-full bg-white/40 rounded-full" />
                            </div>
                        </div>

                        <Card className="p-6 bg-gray-900 border-none rounded-3xl shadow-xl">
                            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                <CheckCircle2 className="text-green-400" size={16} />
                                Status da Entrega
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-medium">Usuários Alcançados</span>
                                    <span className="text-white font-black tracking-tighter">--</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-400 w-0" />
                                </div>
                                <p className="text-[10px] text-gray-500 font-medium leading-relaxed italic">
                                    Os dados de entrega são atualizados em tempo real após o disparo.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Minimal Icon helper for the lock screen
const Icon = ({ name }: { name: string }) => {
    if (name === 'Flashlight') return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H9a2 2 0 0 0-2 2v2h10V4a2 2 0 0 0-2-2z" /><path d="M7 6h10l-2 14H9L7 6z" /><line x1="11" y1="13" x2="13" y2="13" /></svg>
    if (name === 'Camera') return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
    const Icons = require('lucide-react')
    const LucideIcon = Icons[name] || Icons.HelpCircle
    return <LucideIcon size={20} />
}

const Zap = ({ size, className }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
)
