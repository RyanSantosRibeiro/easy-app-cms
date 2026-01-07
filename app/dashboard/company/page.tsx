import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CreateCompanyDialog } from "@/components/dashboard/create-company-dialog"
import { CompanyPlan } from "@/components/dashboard/company/company-plan"
import { CompanySettings } from "@/components/dashboard/company/company-settings"

export default async function CompanyPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: company, error } = await supabase
    .from("companies")
    .select(`
      *,
      subscriptions:subscriptions(
        *,
        plan:plans(*)
      ),
      members:company_members(
       *,
        profile:profiles(
          id,
          full_name,
          avatar_url
        )
      )
    `)
    .eq("owner_id", user.id)
    .single()

  console.log({ company, error })

  if (!company) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold tracking-tight">Minha empresa</h1>
        <CreateCompanyDialog />
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minha empresa</h1>
        <p className="text-muted-foreground">Configure as informações da sua empresa</p>
      </div>
      <CompanySettings company={company} />
    </div>
  )
}
