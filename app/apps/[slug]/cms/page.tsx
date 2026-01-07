import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getProject, getUser } from "@/utils/supabase/queries"
import { FeaturePreview } from "@/components/FeaturePreview";
import { BarChart, DollarSign, MessageCircle } from "lucide-react";
import { CMS } from "./cms-index";

export default async function AppsPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()
    const paramsData = await params
    console.log({paramsData})
    const slug = paramsData.slug

    const [user] = await Promise.all([
        getUser(supabase),
    ]);

    
    const project = await getProject(supabase, slug);
    console.log({project})

    if (!project) {
        return (
            <FeaturePreview
                title="Project Not Found"
                description="The project you're trying to access doesn't exist."
                features={[
                    "Project not found.",
                    "Please check the URL and try again."
                ]}
                badge="Not Found"
                illustration={
                    <div className="w-full max-w-sm mx-auto space-y-4">
                        <div className="flex justify-center">
                            <div className="bg-gray-100 text-gray-700 p-4 rounded-2xl shadow-sm">
                                Project Not Found
                            </div>
                        </div>
                    </div>
                }
            />
        )
    }

    return (
        <CMS project={project}  />
    )
}
