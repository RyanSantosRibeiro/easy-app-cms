import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUser } from "@/utils/supabase/queries"
import { FeaturePreview } from "@/components/FeaturePreview";
import { BarChart } from "lucide-react";

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
            title="Analytics for your app"
            description="Understand your customers and their app usage better to make informed decisions."
            features={[
                "Track your app downloads and unique users.",
                "Analyze your app's usage with date range filters.",
                "Compare your Android vs iOS performance.",
                "Get insights into trending searches and popular screens."
            ]}
            ctaText="Upgrade to Analytics Pro"
            badge="Coming Soon"
            illustration={
                <div className="w-full h-full p-8 flex flex-col gap-4">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                            <BarChart size={32} />
                        </div>
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-1/3 bg-gray-100 rounded"></div>
                            <div className="h-2 w-1/4 bg-gray-50 rounded"></div>
                        </div>
                    </div>
                    <div className="flex-1 flex items-end gap-4 px-4 pb-4 border-b border-l border-gray-100">
                        {[30, 50, 40, 70, 50, 80, 60].map((h, i) => (
                            <div key={i} className="flex-1 bg-blue-500 rounded-t-sm" style={{ height: `${h}%`, opacity: 0.5 + (i * 0.08) }}></div>
                        ))}
                    </div>
                </div>
            }
        />
    )
}
