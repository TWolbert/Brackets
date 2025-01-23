import { PageProps } from "@/types";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IconButton } from "@/Components/IconButton";
import { PersonAdd, Plus } from "react-bootstrap-icons";
import { useState } from "react";

export default function Create({ auth }: PageProps) {
    const [participantName, setParticipantName] = useState<string>('');
    const [participantLastName, setParticipantLastName] = useState<string>('');
    const [schoolId, setSchoolId] = useState<number>(0);
    

    return (
        <AuthenticatedLayout header={<h1>Add a participant</h1>}>
            <form method="POST" action="/matchparticipant">
                <IconButton icon={<PersonAdd className="text-xl" />} text="Create participant" onClick={() => {}} />
            </form>
        </AuthenticatedLayout>
    )
}