import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUser } from "@/utils/supabase/queries"
import { EmailSettings } from "./email-index";

export default async function AppsPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()

    const [user] = await Promise.all([
        getUser(supabase),
    ]);


    if (!user) {
        redirect("/auth/login")
    }


    return (
        <EmailSettings />
    )
}
