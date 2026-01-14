import { createClient } from "@/lib/supabase/server"
import { getProject, getProfile } from "@/utils/supabase/queries"
import { SectionsIndex } from "./sections-index"
import { FeaturePreview } from "@/components/FeaturePreview"

export default async function SectionsPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()
    const { slug } = await params

    const [project, profile] = await Promise.all([
        getProject(supabase, slug),
        getProfile(supabase)
    ])

    if (!project) {
        return (
            <FeaturePreview
                illustration="/illustrations/404.svg"
                title="Project Not Found"
                description="The project you're trying to access doesn't exist."
                features={["Check the URL slug", "Ensure you have access to this project"]}
                badge="Not Found"
            />
        )
    }

    return <SectionsIndex project={project} role={profile?.company_members?.role} />
}
