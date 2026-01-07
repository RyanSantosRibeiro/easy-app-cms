import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AppsSidebar } from "@/components/dashboard/apps-sidebar"
import { getCompany, getProfile, getUser } from "@/utils/supabase/queries"
import { Header } from "@/components/dashboard/header"

export default async function AppsLayout({ children, params }: { children: React.ReactNode, params: { slug: string } }) {
  const supabase = await createClient()
  const { slug } = await params

   const [user, profile] = await Promise.all([
      getUser(supabase),
      getProfile(supabase),
    ]);
    
    console.log({user, profile}) 
    // caso user ou profile nao exista
    if (!user || !profile) {
      redirect("/login")
    }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppsSidebar role={profile?.company_members?.role} slug={slug}/>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header profile={profile} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
