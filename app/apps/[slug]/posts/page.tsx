import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUser } from "@/utils/supabase/queries"
import { FeaturePreview } from "@/components/FeaturePreview";
import { File } from "lucide-react";

export default async function AppsPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()

    const [user] = await Promise.all([
        getUser(supabase),
    ]);


    if (!user) {
        redirect("/auth/login")
    }


    return (
        <FeaturePreview
            title="Blog & Posts"
            description="A full-featured CMS for publishing articles, news, and updates directly to your app."
            features={[
                "Rich text editor with media embedding.",
                "Scheduled publishing.",
                "Categories, tags, and SEO settings.",
                "Push notification integration for new posts."
            ]}
            badge="Planned"
            illustration={
                <div className="w-full max-w-sm mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform">
                    <div className="h-32 bg-gray-100 flex items-center justify-center">
                        <File size={48} className="text-gray-300" />
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            }
        />
    )
}
