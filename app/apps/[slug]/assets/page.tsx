import AssetsIndex from "./assets-index"

export default async function AssetsPage({ params }: { params: { slug: string } }) {
    const p = await params 
    const slug = p.slug

    return (
        <AssetsIndex slug={slug} />
    )
}
