'use client'

import React, { useState } from 'react'
import { Project } from '@/lib/types'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Palette, Type, Square, Save, Loader2, RotateCcw } from 'lucide-react'
import { updateProjectTheme } from '@/actions/projects'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import ColorPicker from 'react-best-gradient-color-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface ThemeIndexProps {
    project: Project
}

const DEFAULT_THEME = {
    colors: {
        base: '#ffffff',
        primary: '#171717',
        secondary: '#c7c7c7',
        accent: '#404040',
        neutral: '#333333'
    },
    buttonStyle: {
        borderWidth: '1px',
        radius: '0.8rem',
        scaleOnClick: 0.95,
        animationDuration: '0.25s'
    },
    fontFamily: 'Inter'
}

export const ThemeIndex: React.FC<ThemeIndexProps> = ({ project }) => {
    const { toast } = useToast()
    const router = useRouter()

    // Initialize theme with project data or defaults
    const [theme, setTheme] = useState(project.theme || DEFAULT_THEME)
    const [loading, setLoading] = useState(false)

    // Dynamic Google Fonts loader
    const fontUrl = `https://fonts.googleapis.com/css2?family=${theme.fontFamily.replace(/\s+/g, '+')}:wght@400;500;600;700;800&display=swap`;

    const handleSave = async () => {
        setLoading(true)
        const { error } = await updateProjectTheme(project.id, theme)

        if (error) {
            toast({
                title: "Error saving theme",
                description: error,
                variant: "destructive"
            })
        } else {
            toast({
                title: "Theme updated",
                description: "Your project's visual settings have been saved.",
            })
            router.refresh()
        }
        setLoading(false)
    }

    const resetToDefaults = () => {
        setTheme(DEFAULT_THEME)
    }

    const updateColor = (key: keyof typeof theme.colors, value: string) => {
        setTheme({
            ...theme,
            colors: { ...theme.colors, [key]: value }
        })
    }

    const updateButtonStyle = (key: keyof typeof theme.buttonStyle, value: any) => {
        setTheme({
            ...theme,
            buttonStyle: { ...theme.buttonStyle, [key]: value }
        })
    }

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Load dynamic font */}
            <link rel="stylesheet" href={fontUrl} />

            <PageHeader
                title="Theme Settings"
                description="Customize the visual identity of your application"
            >
                <div className="flex gap-2">
                    <Button variant="outline" onClick={resetToDefaults} disabled={loading}>
                        <RotateCcw size={16} className="mr-2" />
                        Reset
                    </Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-primary hover:bg-primary/90 text-white">
                        {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                        Save Theme
                    </Button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration Area */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="p-6 space-y-8 border-gray-200 shadow-sm">
                        {/* Main Colors */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Palette size={14} />
                                Main Colors
                            </h3>
                            <div className="grid gap-4">
                                {Object.entries(theme.colors).map(([key, value]) => (
                                    <div key={key} className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <Label className="capitalize text-xs font-semibold text-gray-600">{key}</Label>
                                            <span className="text-[10px] text-gray-400 font-medium">(optional)</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <button
                                                        className="w-10 h-10 rounded-lg border border-gray-200 shrink-0 shadow-inner cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                                                        style={{ backgroundColor: value }}
                                                    />
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-3" align="start">
                                                    <ColorPicker
                                                        value={value}
                                                        onChange={(val) => updateColor(key as any, val)}
                                                        hideControls={true}
                                                        hidePresets={true}
                                                        hideOpacity={true}
                                                        width={220}
                                                        height={180}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <Input
                                                value={value}
                                                onChange={(e) => updateColor(key as any, e.target.value)}
                                                className="font-mono text-sm h-10"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Button Style */}
                        <div className="space-y-4 pt-6 border-t border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Square size={14} />
                                Button Style
                            </h3>
                            <div className="grid gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-gray-600 font-semibold">Border width</Label>
                                    <Input
                                        value={theme.buttonStyle.borderWidth}
                                        onChange={(e) => updateButtonStyle('borderWidth', e.target.value)}
                                        placeholder="1px"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-gray-600 font-semibold">Radius</Label>
                                    <div className="text-[10px] text-gray-400 mb-1">Button and similar elements</div>
                                    <Input
                                        value={theme.buttonStyle.radius}
                                        onChange={(e) => updateButtonStyle('radius', e.target.value)}
                                        placeholder="0.8rem"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-gray-600 font-semibold">Scale on click</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={theme.buttonStyle.scaleOnClick}
                                            onChange={(e) => updateButtonStyle('scaleOnClick', parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-gray-600 font-semibold">Animation duration</Label>
                                        <Input
                                            value={theme.buttonStyle.animationDuration}
                                            onChange={(e) => updateButtonStyle('animationDuration', e.target.value)}
                                            placeholder="0.25s"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Typography */}
                        <div className="space-y-4 pt-6 border-t border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Type size={14} />
                                Typography
                            </h3>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-gray-600 font-semibold">Font Family</Label>
                                <Input
                                    value={theme.fontFamily}
                                    onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })}
                                    placeholder="Enter Google Font name (e.g. Montserrat)"
                                />
                                <p className="text-[10px] text-gray-400">Loads directly from Google Fonts</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Preview Area (Mobile Device) */}
                <div className="lg:col-span-8 flex justify-center lg:block">
                    <div className="sticky top-6">
                        <div className="mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mobile Preview</h3>
                        </div>

                        {/* Realistic Phone Frame */}
                        <div
                            className="relative mx-auto w-[320px] h-[640px] bg-[#1a1a1a] rounded-[3rem] border-[10px] border-[#2a2a2a] shadow-2xl overflow-hidden ring-4 ring-black/5 transition-all"
                            style={{ fontFamily: `"${theme.fontFamily}", sans-serif` }}
                        >
                            {/* Speaker/Notch Area */}
                            <div className="absolute top-0 inset-x-0 h-7 bg-[#1a1a1a] flex justify-center items-end pb-1.5 z-20">
                                <div className="w-20 h-5 bg-black rounded-full" />
                            </div>

                            {/* Screen Content */}
                            <div className="w-full h-full relative flex flex-col overflow-hidden" style={{ backgroundColor: theme.colors.base }}>
                                {/* App Status Bar */}
                                <div className="h-8 w-full px-8 flex justify-between items-center text-[10px] font-bold text-gray-400 pt-3">
                                    <span>9:41</span>
                                    <div className="flex gap-1.5 items-center">
                                        <div className="w-3 h-1.5 bg-gray-300 rounded-full" />
                                        <div className="w-5 h-2.5 border border-gray-300 rounded-[3px]" />
                                    </div>
                                </div>

                                {/* App Navbar Mockup */}
                                <div className="px-6 py-4 flex justify-between items-center border-b" style={{ borderColor: `${theme.colors.neutral}15` }}>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-8 h-8 flex items-center justify-center text-white shadow-sm"
                                            style={{ backgroundColor: theme.colors.primary, borderRadius: theme.buttonStyle.radius }}
                                        >
                                            <Palette size={16} />
                                        </div>
                                        <span className="font-black text-sm tracking-tight" style={{ color: theme.colors.primary }}>App.</span>
                                    </div>
                                    <div className="w-8 h-8 flex flex-col justify-center gap-1.5 items-end">
                                        <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: theme.colors.neutral }} />
                                        <div className="w-4 h-0.5 rounded-full" style={{ backgroundColor: theme.colors.neutral }} />
                                    </div>
                                </div>

                                {/* App Body Mockup */}
                                <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-hide">
                                    <div className="space-y-4">
                                        <div
                                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                            style={{ backgroundColor: `${theme.colors.primary}15`, color: theme.colors.primary }}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.colors.primary }} />
                                            Live Preview
                                        </div>
                                        <h2 className="text-3xl font-black leading-tight tracking-tight" style={{ color: theme.colors.primary }}>
                                            Looks <span style={{ color: theme.colors.accent }}>Amazing</span> on Mobile.
                                        </h2>
                                        <p className="text-sm font-medium opacity-60 leading-relaxed" style={{ color: theme.colors.neutral }}>
                                            Your theme automatically adapts to every screen size with perfection.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <button
                                            className="w-full py-4 text-sm font-bold text-white shadow-lg transition-all active:scale-95"
                                            style={{
                                                backgroundColor: theme.colors.primary,
                                                borderRadius: theme.buttonStyle.radius,
                                                borderWidth: theme.buttonStyle.borderWidth,
                                                borderColor: theme.colors.primary,
                                                transitionDuration: theme.buttonStyle.animationDuration
                                            }}
                                        >
                                            Primary Action
                                        </button>
                                        <button
                                            className="w-full py-4 text-sm font-bold transition-all active:scale-95"
                                            style={{
                                                backgroundColor: 'transparent',
                                                color: theme.colors.primary,
                                                borderRadius: theme.buttonStyle.radius,
                                                borderWidth: theme.buttonStyle.borderWidth,
                                                borderColor: theme.colors.secondary,
                                                transitionDuration: theme.buttonStyle.animationDuration
                                            }}
                                        >
                                            Secondary Action
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {[1, 2].map(i => (
                                            <div
                                                key={i}
                                                className="p-4 border shadow-sm"
                                                style={{
                                                    backgroundColor: 'white',
                                                    borderRadius: theme.buttonStyle.radius,
                                                    borderColor: `${theme.colors.neutral}15`
                                                }}
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center"
                                                    style={{ backgroundColor: `${theme.colors.accent}15`, color: theme.colors.accent }}
                                                >
                                                    <Square size={14} />
                                                </div>
                                                <div className="h-2 w-12 rounded-full mb-1 opacity-20" style={{ backgroundColor: theme.colors.neutral }} />
                                                <div className="h-2 w-8 rounded-full opacity-10" style={{ backgroundColor: theme.colors.neutral }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Phone Home Indicator */}
                                <div className="h-6 w-full flex justify-center items-center pb-1">
                                    <div className="w-24 h-1 bg-gray-200 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
