import { PageProps } from "@/types";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IconButton } from "@/Components/IconButton";
import { PersonAdd } from "react-bootstrap-icons";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { School } from "@/types/models";
import { toast } from "react-toastify";

export default function Create({ auth, schools }: PageProps<{ schools: School[] }>) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        lastname: '',
        school_id: 0,
        image_id: 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.school_id === 0) {
            toast.error('Please select a school');
            return;
        }

        post(route('participant.store'));
    }


    return (
        <AuthenticatedLayout header={<h1>Add a participant</h1>}>
            <form className="mx-auto bg-white w-fit p-3 mt-3 shadow-md rounded-md" method="POST" onSubmit={handleSubmit}>
                <InputLabel htmlFor="name" value="First name" />
                <TextInput id="name" type="text" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                <InputLabel htmlFor="lastname" value="Last name" />
                <TextInput id="lastname" type="text" name="lastname" value={data.lastname} onChange={(e) => setData('lastname', e.target.value)} />
                <InputLabel htmlFor="school_id" value="School" />
                <select id="school_id" name="school_id" value={data.school_id} onChange={(e) => setData('school_id', parseInt(e.target.value))} className='rounded-md w-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500' >
                    <option value={0}>Select a school</option>
                    {schools.map((school) => (
                        <option key={school.id} value={school.id}>{school.name}</option>
                    ))}
                </select>
                <input type="hidden" name="image_id" value={data.image_id} />
                <IconButton disabled={processing} icon={<PersonAdd className="text-xl" />} className="w-full mt-2" text="Create participant" onClick={() => { }} />
            </form>
        </AuthenticatedLayout>
    )
}