import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, CreditCard, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user's companies
  const { data: companies } = await supabase
    .from("companies")
    .select("*")
    .or(`owner_id.eq.${user?.id},id.in.(select company_id from company_members where user_id='${user?.id}')`)

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  const stats = [
    {
      title: "Empresas",
      value: companies?.length || 0,
      icon: Building2,
      description: "Total de empresas",
    },
    {
      title: "Membros",
      value: "0",
      icon: Users,
      description: "Membros ativos",
    },
    {
      title: "Assinatura",
      value: "Ativa",
      icon: CreditCard,
      description: "Plano atual",
    },
    {
      title: "Crescimento",
      value: "+12%",
      icon: TrendingUp,
      description: "Vs. mês anterior",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo de volta, {profile?.full_name || "Usuário"}!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Minhas Empresas</CardTitle>
            <CardDescription>Empresas que você gerencia</CardDescription>
          </CardHeader>
          <CardContent>
            {companies && companies.length > 0 ? (
              <div className="space-y-2">
                {companies.map((company) => (
                  <div key={company.id} className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{company.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma empresa cadastrada</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
