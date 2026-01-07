import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InviteMemberDialog } from "@/components/dashboard/invite-member-dialog"
import { redirect } from "next/navigation"
import { TeamMembersTable } from "@/components/dashboard/team-members-list"

export default async function TeamPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get user's first company (for simplicity, in a real app you'd select from multiple)
  const { data: company, error } = await supabase
    .from("companies")
    .select(`
    id,
    name,
    slug,
    owner_id,
    company_members (
      id,
      user_id,
      role,
      status,
      created_at,
      profile:profiles (
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipe</h1>
          <p className="text-muted-foreground">Você precisa criar uma empresa primeiro</p>
        </div>
      </div>
    )
  }

  // Get company members with profiles
  const { data: members } = await supabase
    .from("company_members")
    .select(
      `
      *,
      profile:profiles(*)
    `,
    )
    .eq("company_id", company.id)
    .order("created_at", { ascending: false })

  // Check if user is admin or owner
  const isOwner = company.owner_id === user.id
  const { data: userMembership } = await supabase
    .from("company_members")
    .select("role")
    .eq("company_id", company.id)
    .eq("user_id", user.id)
    .single()

  const isAdmin = userMembership?.role === "admin" || isOwner

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipe</h1>
          <p className="text-muted-foreground">Gerencie os membros da sua equipe</p>
        </div>
        {isAdmin && <InviteMemberDialog companyId={company.id} />}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membros da Equipe</CardTitle>
          <CardDescription>
            {members?.length || 0} {members?.length === 1 ? "membro" : "membros"} na equipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TeamMembersTable members={members || []} isAdmin={isAdmin} currentUserId={user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
