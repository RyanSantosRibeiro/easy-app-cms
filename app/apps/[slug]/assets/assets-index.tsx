import { PageHeader } from "@/components/PageHeader";
import Assets from "./assets";

const AssetsIndex = ({ slug }: { slug: string }) => {
    console.log({ slug })
    return (
        <div className="space-y-10 p-8 max-w-7xl mx-auto">
            <PageHeader
                title="Assets Library"
                description="Manage and optimize your media assets for the application"
            />
            <Assets slug={slug} />
        </div>
    )
}

export default AssetsIndex
