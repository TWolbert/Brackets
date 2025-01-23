import { PageProps } from "@/types";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IconButton } from "@/Components/IconButton";
import { Plus } from "react-bootstrap-icons";

export default function Create({ auth }: PageProps) {
    return (
        <AuthenticatedLayout header={<h1>Create a match participant</h1>}>
            <form method="POST" action="/matchparticipant">
                <IconButton icon={<Plus className="text-xl" />} text="Create match participant" onClick={() => {}} />
            </form>
        </AuthenticatedLayout>
    )
}