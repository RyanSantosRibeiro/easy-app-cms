import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    // Retrieve projectId from query param or header
    const projectId = searchParams.get('projectId') || request.headers.get('x-project-id')

    if (!projectId) {
        return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Use Admin Client to bypass RLS policies (assuming mobile app users are anonymous/public)
    const supabase = await createAdminClient()

    const { data, error } = await supabase
        .from('projects')
        .select('id, name, logo_url, theme, menus')
        .eq('id', projectId)
        .single()

    if (error) {
        console.error("Error fetching project config:", error)
        return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: 500 })
    }

    if (!data) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Return with Cache-Control headers
    return NextResponse.json(data, {
        headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
        }
    })
}
