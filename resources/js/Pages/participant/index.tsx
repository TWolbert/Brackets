import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Participant } from "@/types/models";
import { Link, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { ArrowRight, FiletypeXml } from "react-bootstrap-icons";
import { toast } from "react-toastify";

export default function Index({ auth, participants }: PageProps<{ participants: Participant[] }>) {
    const { flash } = usePage<PageProps<{ flash: { success: boolean } }>>().props;

    useEffect(() => {
        if (flash.success === true) {
            toast.success('Participant created');
        }
    }, []);
    return (
        <Authenticated header={<h1>Participants</h1>}>
            <div className="mx-auto p-3 mt-3 gap-3 w-fit">
                <div className=" flex flex-row gap-2 items-center mb-2">
                    <h1 className="font-bold text-xl">Participants ({participants.length})</h1>
                    <Link href={route('xml.create')} className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 flex flex-row gap-2 items-center"><FiletypeXml /> Import using XML</Link>
                    <Link href={route('participant.create')} className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 flex flex-row gap-2 items-center"><FiletypeXml /> Create participant</Link>
                </div>
                <div className="grid grid-cols-3 w-fit gap-3">
                    {participants.map((participant) => (
                        <ParticipantTile key={participant.id} participant={participant} />
                    ))}
                </div>
            </div>

        </Authenticated>
    )
}

function ParticipantTile({ participant }: { participant: Participant }) {
    return (
        <div className="flex justify-between items-center bg-white shadow-md rounded-md p-3">
            <div>
                <h2>{participant.name} {participant.lastname}</h2>
                <p className=" text-gray-700 font-bold">{participant.school.name}</p>
            </div>
            <Link href={route('participant.show', participant.id)} className="ml-[300px] text-2xl hover:translate-x-1 transition-all" ><ArrowRight /></Link>
        </div>
    )
}