import { createClient } from "@/lib/supabase/server"
import { InviteMemberDialog } from "@/components/dashboard/invite-member-dialog"
import { redirect } from "next/navigation"
import { TeamMembersTable } from "@/components/dashboard/team-members-list"
import { PageHeader } from "@/components/PageHeader"
import { Users } from "lucide-react"

export default async function TeamPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get user's first company
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

  if (!company) {
    return (
      <div className="space-y-10 p-8 max-w-7xl mx-auto">
        <PageHeader
          title="Equipe"
          description="Você precisa criar uma empresa primeiro para gerenciar membros."
        />
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
    <div className="space-y-10 p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Nossa Equipe"
        description="Gerencie os membros da sua equipe e distribua permissões de acesso."
      >
        {isAdmin && <InviteMemberDialog companyId={company.id} />}
      </PageHeader>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Users size={20} className="text-primary" />
              Membros Ativos
            </h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
              {members?.length || 0} {members?.length === 1 ? "Colaborador" : "Colaboradores"} registrados
            </p>
          </div>
        </div>
        <div className="p-4">
          <TeamMembersTable members={members || []} isAdmin={isAdmin} currentUserId={user.id} />
        </div>
      </div>
    </div>
  )
}
