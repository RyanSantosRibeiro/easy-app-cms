import { createClient } from "@/lib/supabase/server"
import { getProject } from "@/utils/supabase/queries"
import { MenuBuilder } from "@/components/cms/MenuBuilder"
import { FeaturePreview } from "@/components/FeaturePreview"

export default async function LateralMenuPage({ params }: { params: { slug: string } }) {
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

    return (
        <MenuBuilder
            project={project}
            type="drawer"
            title="Menu Lateral (Drawer)"
            description="Configure the items and navigation links for the mobile drawer and sidebar menu."
        />
    )
}
