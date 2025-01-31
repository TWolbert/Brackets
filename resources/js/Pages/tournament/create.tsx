import { PageProps } from "@/types";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IconButton } from "@/Components/IconButton";
import { Plus } from "react-bootstrap-icons";
import { Participant } from "@/types/models";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { toast } from "react-toastify";

export default function Create({ auth, participants }: PageProps<{ participants: Participant[] }>) {
    const [selectableParticipants, setSelectableParticipants] = useState<Participant[]>(participants);
    const [neededParticipants, setNeededParticipants] = useState(0);

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

    useEffect(() => {
        // Find next biggest power of 2 from the number of participants
        const participants = data.tournamentParticipants.length;
        let needed = 2;

        while (needed < participants) {
            needed *= 2;
        }

        setNeededParticipants(needed);
    }, [data.tournamentParticipants.length]);

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
                        <div className="gap-3 p-3 mt-3 bg-white rounded-md shadow-md w-fit">
                            <div className="flex gap-2">
                                <select name="participants" onChange={handleSelectChange} className="p-2 pr-10 border border-gray-300 rounded-md">
                                    <option value={0}>Select a participant</option>
                                    {selectableParticipants.map((participant) => (
                                        <option key={participant.id} value={participant.id}>{participant.name} {participant.lastname}</option>
                                    ))}
                                </select>
                                <IconButton icon={<Plus className="text-xl" />} text="Create tournament" onClick={() => { }} />
                            </div>
                            {data.tournamentParticipants.length === 0 ?
                                <div className="flex items-center justify-center h-full">
                                    <p>No participants selected</p>
                                </div>
                                :
                                <div>
                                    <p>
                                        Participants <span className="font-bold">{data.tournamentParticipants.length}/{neededParticipants} ({neededParticipants - data.tournamentParticipants.length} {neededParticipants - data.tournamentParticipants.length === 1 ? "\"bye\"" : "\"bye's\""} will be made)</span>
                                    </p>
                                    {data.tournamentParticipants.map((participant) => (
                                        <TournamentParticipant key={participant.id} participant={participant} />
                                    ))}
                                </div>
                            }
                        </div>
                        <div className="gap-3 p-3 mt-3 bg-white rounded-md shadow-md w-fit h-fit">
                            <h1 className="text-xl font-bold">Tournament info</h1>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput id="name" type="text" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            <InputLabel htmlFor="start_date" value="Start date" />
                            <input id="start_date" type="date" name="start_date" value={data.start_date} onChange={handleStartDateChange} className='w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500' />
                            <InputLabel htmlFor="end_date" value="End date" />
                            <input id="end_date" type="date" name="end_date" value={data.end_date} onChange={handleEndDateChange} className='w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500' />
                        </div>
                    </div>

                </form>
            </div>
        </AuthenticatedLayout>
    )
}

function TournamentParticipant({ participant }: { participant: Participant }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2>{participant.name} {participant.lastname}</h2>
                <p className="font-bold text-gray-700 ">{participant.school.name}</p>
            </div>
        </div>
    )
}