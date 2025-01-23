import { PageProps } from "@/types";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IconButton } from "@/Components/IconButton";
import { Plus } from "react-bootstrap-icons";

export default function Create({ auth }: PageProps) {
    return (
        <AuthenticatedLayout header={<h1>Create a tournament</h1>}>
            <form method="POST" action="/tournaments">
                <IconButton icon={<Plus className="text-xl" />} text="Create tournament" onClick={() => {}} />
            </form>
        </AuthenticatedLayout>
    )
}