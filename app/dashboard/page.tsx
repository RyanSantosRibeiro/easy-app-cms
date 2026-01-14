import { createClient } from "@/lib/supabase/server"
import { Building2, Users, CreditCard, TrendingUp, Activity, ArrowRight, UserCheck } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"

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
      title: "Minhas Empresas",
      value: companies?.length || 0,
      icon: Building2,
      description: "Organizações sob seu comando",
      color: "bg-blue-500",
    },
    {
      title: "Membros do Time",
      value: "8",
      icon: Users,
      description: "Colaboradores ativos",
      color: "bg-indigo-500",
    },
    {
      title: "Status do Plano",
      value: "Premium",
      icon: CreditCard,
      description: "Renovação em 12/02",
      color: "bg-emerald-500",
    },
    {
      title: "Taxa de Uso",
      value: "84%",
      icon: TrendingUp,
      description: "Crescimento semanal",
      color: "bg-rose-500",
    },
  ]

  return (
    <div className="space-y-10 p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Painel Geral"
        description={`Bem-vindo de volta, ${profile?.full_name || "Usuário"}. Aqui está o que está acontecendo nas suas empresas.`}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-4 rounded-2xl ${stat.color} text-white shadow-lg transition-transform group-hover:scale-110 duration-500`}>
                <stat.icon size={24} />
              </div>
              <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg">
                Hoje
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
              <p className="text-[10px] font-bold text-gray-400 mt-2">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-8 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />

          <div className="flex items-center justify-between mb-8 relative">
            <div>
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Activity className="text-primary" size={20} />
                Atividade Recente
              </h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Últimas ações realizadas no sistema</p>
            </div>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
                  <UserCheck size={20} />
                </div>
                <div className="flex-1 border-b border-gray-50 pb-6 group-last:border-none">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">Novo membro adicionado ao time</h4>
                      <p className="text-xs text-gray-400 font-medium">Empresa: {companies?.[0]?.name || "Principal"}</p>
                    </div>
                    <span className="text-[10px] font-black text-gray-300 uppercase">2h atrás</span>
                  </div>
                </div>
              </div>
            ))}

            <p className="text-center text-gray-300 text-xs font-bold uppercase tracking-widest pt-4">No momento, estas informações são demonstrativas</p>
          </div>
        </div>

        <div className="md:col-span-4 space-y-6">
          <div className="bg-black p-8 rounded-[2.5rem] shadow-2xl shadow-black/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/80 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <h3 className="text-lg font-black mb-6 relative">Minhas Empresas</h3>

            <div className="space-y-4 relative">
              {companies && companies.length > 0 ? (
                companies.map((company) => (
                  <div key={company.id} className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/80 flex items-center justify-center">
                        <Building2 size={18} className="text-primary" />
                      </div>
                      <span className="text-sm font-bold">{company.name}</span>
                    </div>
                    <ArrowRight size={16} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/40 font-medium italic">Nenhuma empresa cadastrada</p>
              )}
            </div>

            <button className="w-full mt-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-gray-100 transition-all active:scale-95 text-xs uppercase tracking-widest">
              Gerenciar Empresas
            </button>
          </div>

          <div className="p-8 rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-4">
              <TrendingUp size={24} />
            </div>
            <h4 className="text-sm font-black text-gray-900">Precisa de Ajuda?</h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">Fale com nosso time de especialistas para otimizar suas operações.</p>
            <button className="mt-4 text-[10px] font-black uppercase text-primary tracking-widest hover:underline">Acessar Suporte</button>
          </div>
        </div>
      </div>
    </div>
  )
}
