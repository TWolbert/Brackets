import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Participant } from "@/types/models";
import { Link } from "@inertiajs/react";
import { ArrowRight } from "react-bootstrap-icons";

export default function Index({ auth, participants }: PageProps<{ participants: Participant[] }>) { 
    return (
        <Authenticated header={<h1>Participants</h1>}>
            <div className="mx-auto bg-white p-3 shadow-md rounded-md mt-3 gap-3 w-fit">
                <h1 className="font-bold text-xl">Participants ({participants.length})</h1>
                <div className="flex flex-col w-fit ">
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
        <div className="flex justify-between items-center">
            <div>
                <h2>{participant.name} {participant.lastname}</h2>
                <p className=" text-gray-700 font-bold">{participant.school.name}</p>
            </div>
            <Link href={route('participant.show', participant.id)}className="ml-[300px] text-2xl hover:translate-x-1 transition-all" ><ArrowRight /></Link>
        </div>
    )
}