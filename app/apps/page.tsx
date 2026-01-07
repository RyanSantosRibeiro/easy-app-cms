import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getCompany, getProfile, getUser } from "@/utils/supabase/queries"
import AppsIndex from "../dashboard/apps/apps-index";

export default async function AppsPage() {
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
    <AppsIndex appsData={company?.projects} />
  )
}
