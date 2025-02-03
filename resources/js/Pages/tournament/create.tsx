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
import axios from "axios";

export default function Create({ auth, participants }: PageProps<{ participants: Participant[] }>) {
    const [selectableParticipants, setSelectableParticipants] = useState<Participant[]>(participants);
    const [neededParticipants, setNeededParticipants] = useState(0);
    const dateToday = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        start_date: '',
        end_date: '',
        tournamentParticipants: [] as Participant[]
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const postData = {
            name: data.name,
            start_date: data.start_date,
            end_date: data.end_date,
            tournament_participants: data.tournamentParticipants.map((participant) => participant.id)
        }

        axios.post(route('tournament.store'), postData).then(data => {
            toast.success('Tournament created');
            console.log(data);
        }).catch((error) => {
            console.log(error.response);
            toast.error('An error occured');
        });
    }


    useEffect(() => {
        if (data.end_date < data.start_date) {
            setData('end_date', data.start_date);
        }   
    }, [data.start_date])

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

    const handleRemoveParticipant = (participant: Participant) => {
        setData('tournamentParticipants', data.tournamentParticipants.filter((p) => p.id !== participant.id));
        setSelectableParticipants([...selectableParticipants, participant]);

        // Sort participants by id  
        setSelectableParticipants((selectableParticipants) => selectableParticipants.sort((a, b) => a.id - b.id));
    }

    return (
        <AuthenticatedLayout header={<h1>Create a tournament</h1>}>
            <div className="mx-auto w-fit">
                <form method="POST" onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                        <div className="gap-3 p-3 mt-3 bg-white rounded-md shadow-md w-fit">
                            <div className="w-full min-w-[400px]">
                                <select name="participants" onChange={handleSelectChange} className="p-2 pr-10 border w-full border-gray-300 rounded-md">
                                    <option value={0}>Select a participant</option>
                                    {selectableParticipants.map((participant) => (
                                        <option key={participant.id} value={participant.id}>{participant.name} {participant.lastname}</option>
                                    ))}
                                </select>
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
                                        <TournamentParticipant onClick={() => handleRemoveParticipant(participant)} key={participant.id} participant={participant} />
                                    ))}
                                </div>
                            }
                        </div>
                        <div className="gap-3 p-3 mt-3 bg-white rounded-md shadow-md w-fit h-fit">
                            <h1 className="text-xl font-bold">Tournament info</h1>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput id="name" type="text" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            <InputLabel htmlFor="start_date" value="Start date" />
                            <input min={dateToday} id="start_date" type="date" name="start_date" value={data.start_date} onChange={handleStartDateChange} className='w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500' />
                            <InputLabel htmlFor="end_date" value="End date" />
                            <input min={data.start_date} id="end_date" type="date" name="end_date" value={data.end_date} onChange={handleEndDateChange} className='w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500' />
                            <div className="mt-3">
                                <IconButton onClick={() => {}} disabled={processing} icon={<Plus />} text="Create tournament" className="w-full" />
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </AuthenticatedLayout>
    )
}

function TournamentParticipant({ participant, onClick }: { participant: Participant, onClick?: () => void }) {
    return (
        <div className="flex items-center justify-between p-2 rounded-md shadow-sm border-2">
            <div>
                <h2>{participant.name} {participant.lastname}</h2>
                <p className="font-bold text-gray-700 ">{participant.school.name}</p>
                <button onClick={onClick} className="text-red-500">Remove</button>
            </div>
        </div>
    )
}