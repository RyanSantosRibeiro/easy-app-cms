import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Helper for slugifying (optional, to match requested format if needed)
const toSlug = (str: string) => str.toLowerCase().replace(/\s+/g, '-')

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId') || request.headers.get('x-project-id')
    const { slug } = await params

    if (!projectId) {
        return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // 1. Fetch Page with PUBLISHED version and related sections
    // Using nested select with !inner on page_versions to filter for published only
    const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select(`
        id,
        title,
        slug,
        page_versions!inner (
           id,
           status,
           name,
           page_sections (
             id,
             order_index,
             content,
             section_definitions (
               name,
               id,
               description
             )
           )
        )
    `)
        .eq('slug', slug)
        .eq('project_id', projectId)
        .eq('page_versions.status', 'PUBLISHED')
        .maybeSingle() // Use maybeSingle to avoid error if no rows found

    if (pageError) {
        console.error("Error fetching page:", pageError)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    if (!pageData) {
        return NextResponse.json({ error: 'Page not found or not published' }, { status: 404 })
    }

    // 2. Extract the published version (There should be at least one due to !inner, usually just one)
    const publishedVersion = pageData.page_versions[0]

    if (!publishedVersion) {
        // Should not happen with !inner query, but safety check
        return NextResponse.json({ error: 'Version data missing' }, { status: 404 })
    }

    // 3. Format sections
    // Sort by order_index
    const sections = (publishedVersion.page_sections || [])
        // @ts-ignore - Supabase types might imply array or null, manual sort needs care
        .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
        // @ts-ignore
        .map((item) => ({
            id: item.id,
            // Map 'Hero Section' -> 'hero-section' or keep as is? User example showed 'hero-banner'
            // We will default to slugified name for consistency with "component keys"
            name: item.section_definitions?.name ? toSlug(item.section_definitions.name) : 'unknown',
            originalName: item.section_definitions?.name, // Keeping original for debug
            props: item.content
        }))

    const responsePayload = {
        slug: pageData.slug,
        title: pageData.title,
        version: publishedVersion.name, // Helpful for debug
        sections
    }

    return NextResponse.json(responsePayload, {
        headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
        }
    })
}
