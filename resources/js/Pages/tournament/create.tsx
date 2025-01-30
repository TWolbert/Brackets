import { PageProps } from "@/types";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IconButton } from "@/Components/IconButton";
import { Plus } from "react-bootstrap-icons";
import { Participant } from "@/types/models";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { toast } from "react-toastify";

export default function Create({ auth, participants }: PageProps<{ participants: Participant[] }>) {
    const [selectableParticipants, setSelectableParticipants] = useState<Participant[]>(participants);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        start_date: '',
        end_date: '',
        tournamentParticipants: [] as Participant[]
    });

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const participant = participants.find((participant) => participant.id === parseInt(e.target.value));
        if (!participant) {
            return;
        }
        setData('tournamentParticipants', [...data.tournamentParticipants, participant]);
        setSelectableParticipants(selectableParticipants.filter((p) => p.id !== participant.id));
        e.target.value = '0';
    }

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Check if date is in the future 
        const now = new Date();
        const startDate = new Date(e.target.value);
        if (startDate < now) {
            toast.error('Start date must be in the future');
            return;
        }
        setData('start_date', e.target.value);
    }

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Check if end date is after start date
        const startDate = new Date(data.start_date);
        const endDate = new Date(e.target.value);

        const now = new Date();
        if (endDate < now) {
            toast.error('End date must be in the future');
            return;
        }

        if (endDate < startDate) {
            toast.error('End date must be after start date');
            return;
        }

        setData('end_date', e.target.value);
    }

    return (
        <AuthenticatedLayout header={<h1>Create a tournament</h1>}>
            <div className="mx-auto w-fit">
                <form method="POST" action="/tournaments">
                    <div className="flex gap-2">
                        <div className="bg-white p-3 shadow-md rounded-md mt-3 gap-3 w-fit">
                            <div className="flex gap-2">
                                <select name="participants" onChange={handleSelectChange} className="border border-gray-300 rounded-md p-2 pr-10">
                                    <option value={0}>Select a participant</option>
                                    {selectableParticipants.map((participant) => (
                                        <option key={participant.id} value={participant.id}>{participant.name} {participant.lastname}</option>
                                    ))}
                                </select>
                                <IconButton icon={<Plus className="text-xl" />} text="Create tournament" onClick={() => { }} />
                            </div>
                            {data.tournamentParticipants.length === 0 ?
                                <div className="flex justify-center items-center h-full">
                                    <p>No participants selected</p>
                                </div>
                                :
                                <div>
                                    <p>
                                        Participants <span className="font-bold">({data.tournamentParticipants.length})</span>
                                    </p>
                                    {data.tournamentParticipants.map((participant) => (
                                        <TournamentParticipant key={participant.id} participant={participant} />
                                    ))}
                                </div>
                            }
                        </div>
                        <div className="bg-white p-3 shadow-md rounded-md mt-3 gap-3 w-fit">
                            <h1 className="font-bold text-xl">Tournament info</h1>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput id="name" type="text" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            <InputLabel htmlFor="start_date" value="Start date" />
                            <input id="start_date" type="date" name="start_date" value={data.start_date} onChange={handleStartDateChange} className='rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full' />
                            <InputLabel htmlFor="end_date" value="End date" />
                            <input id="end_date" type="date" name="end_date" value={data.end_date} onChange={handleEndDateChange} className='rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full' />
                        </div>
                    </div>

                </form>
            </div>
        </AuthenticatedLayout>
    )
}

function TournamentParticipant({ participant }: { participant: Participant }) {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h2>{participant.name} {participant.lastname}</h2>
                <p className=" text-gray-700 font-bold">{participant.school.name}</p>
            </div>
        </div>
    )
}