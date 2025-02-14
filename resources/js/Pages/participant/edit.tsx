import { IconButton } from "@/Components/IconButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Participant, School } from "@/types/models";
import { useForm } from "@inertiajs/react";
import { PersonAdd } from "react-bootstrap-icons";

export default function Edit({ auth, participant, schools }: PageProps<{ participant: Participant, schools: School[] }>) {
    // Initialize form data with participant details
    const { data, setData, put, processing, errors } = useForm({ 
        id: participant.id,
        name: participant.name,
        lastname: participant.lastname,
        school_id: participant.school.id,
        image_id: participant.image_id,
    });

    // Handle form submission
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Send PUT request to update participant
        put(route('participant.update', participant.id));
    }

    return (
        <Authenticated header={<h1>Edit {data.name + ' ' + data.lastname}</h1>}>
            <form onSubmit={submit} className="p-3 mx-auto mt-3 bg-white rounded-md shadow-md w-fit min-w-96">
                {/* Name input */}
                <InputLabel htmlFor="name" value="Name" />
                <TextInput className="w-full" id="name" type="text" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                <InputError message={errors.name} />

                {/* Lastname input */}
                <InputLabel htmlFor="lastname" value="Lastname" />
                <TextInput className="w-full" id="lastname" type="text" name="lastname" value={data.lastname} onChange={(e) => setData('lastname', e.target.value)} />
                <InputError message={errors.lastname} />

                {/* School selection */}
                <InputLabel htmlFor="school" value="School" />
                <select id="school" name="school" value={data.school_id} onChange={(e) => setData('school_id', parseInt(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option value="">Select a school</option>
                    {schools.map(school => (
                        <option key={school.id} value={school.id}>{school.name}</option>
                    ))}
                </select>
                <InputError message={errors.school_id} />

                {/* Submit button */}
                <IconButton className="w-full mt-2 disabled:opacity-50" disabled={processing} icon={<PersonAdd className="text-xl" />} text={
                    data.name ? `Update ${data.name} ${data.lastname}` : 'Update participant'
                } onClick={() => { }} />
            </form>
        </Authenticated>
    )   
}