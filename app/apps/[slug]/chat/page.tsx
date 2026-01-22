import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUser } from "@/utils/supabase/queries"
import { FeaturePreview } from "@/components/FeaturePreview";
import { BarChart, DollarSign, MessageCircle } from "lucide-react";

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
            title="Real-time Chat"
            description="Engage with your users instantly. Support customers or enable user-to-user messaging."
            features={[
                "1-on-1 private messaging.",
                "Group channels and community spaces.",
                "Rich media support (images, voice).",
                "Push notifications for offline users."
            ]}
            badge="In Development"
            illustration={
                <div className="w-full max-w-sm mx-auto space-y-4">
                    <div className="flex justify-end">
                        <div className="bg-primary-600 text-black p-4 rounded-2xl rounded-tr-none shadow-lg max-w-[80%]">
                            Hi! When is the new feature coming out?
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 text-gray-700 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                            We are targeting next month! 🚀
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="bg-primary-600 text-black p-4 rounded-2xl rounded-tr-none shadow-lg max-w-[80%] flex items-center gap-2">
                            Can't wait! <MessageCircle size={16} />
                        </div>
                    </div>
                </div>
            }
        />
    )
}
