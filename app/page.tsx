import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Sistema SaaS</h1>
        <p className="text-pretty text-lg text-muted-foreground max-w-md">
          Gerencie sua empresa, equipe e assinaturas de forma simples e eficiente
        </p>
      </div>
      <div className="flex gap-3">

        <Button asChild size="lg">
          <Link href="/login">Entrar</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/auth/signup">Criar conta</Link>
        </Button>
      </div>
    </div>
  )
}
