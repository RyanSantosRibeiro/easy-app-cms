import { createClient } from "@/lib/supabase/server"
import { getProject } from "@/utils/supabase/queries"
import { ThemeIndex } from "./theme-index"
import { FeaturePreview } from "@/components/FeaturePreview"

export default async function ThemePage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()
    const { slug } = await params

    const project = await getProject(supabase, slug)

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

    return <ThemeIndex project={project} />
}
