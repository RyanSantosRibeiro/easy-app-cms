import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getCompany, getProfile, getUser } from "@/utils/supabase/queries"
import AppsIndex from "@/app/dashboard/apps/apps-index";
import { Dashboard } from "./dashboard";

export default async function AppsPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const [user, profile, company] = await Promise.all([
    getUser(supabase),
    getProfile(supabase),
    getCompany(supabase),
  ]);


  if (!user) {
    redirect("/auth/login")
  }
  
  
console.log({company});
//   if(!company) {
//       redirect("/onboarding")
//     }
  
  
  return (
    <Dashboard project={company?.projects[0]} />
  )
}
