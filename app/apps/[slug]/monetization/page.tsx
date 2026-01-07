import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUser } from "@/utils/supabase/queries"
import { FeaturePreview } from "@/components/FeaturePreview";
import { BarChart, DollarSign } from "lucide-react";

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
            title="Monetization"
            description="Turn your app into a revenue generating machine with built-in subscription and ad support."
            features={[
                "Native In-App Purchase integration.",
                "Subscription management dashboard.",
                "Ad network mediation support.",
                "Revenue tracking and payout history."
            ]}
            ctaText="Join the Waitlist"
            badge="Beta Access"
            illustration={
                <div className="w-full h-full flex items-center justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-green-100 relative z-10 text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                <DollarSign size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">$12,450</h3>
                            <p className="text-sm text-gray-500">Monthly Revenue</p>
                        </div>
                        <div className="absolute -right-12 top-0 bg-white p-4 rounded-xl shadow-lg border border-gray-50 text-center animate-bounce delay-700">
                            <span className="text-xs font-bold text-green-600">+24%</span>
                        </div>
                    </div>
                </div>
            }
        />
    )
}
