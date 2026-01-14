import { createClient } from "@/lib/supabase/server"
import { getProject } from "@/utils/supabase/queries"
import { notFound } from "next/navigation"
import { NotificationsIndex } from "./notifications-index"

export default async function NotificationsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()
    const project = await getProject(supabase as any, slug)

    if (!project) {
        notFound()
    }

    return <NotificationsIndex project={project} />
}
