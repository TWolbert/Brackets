import { PageProps } from "@/types";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IconButton } from "@/Components/IconButton";
import { BuildingAdd, PersonAdd, Plus } from "react-bootstrap-icons";
import { useState } from "react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";

export default function Create({ auth, success }: PageProps<{ success: boolean }>) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        city: '',
        country: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('school.store'));
    }

    return (
        <AuthenticatedLayout header={<h1>Add a school</h1>}>
            {success && <h1>hi</h1>}
            <form onSubmit={submit}>
                <InputLabel htmlFor="name" value="School name" />
                <TextInput id="name" type="text" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                <InputLabel htmlFor="city" value="City" />
                <TextInput id="city" type="text" name="city" value={data.city} onChange={(e) => setData('city', e.target.value)} />
                <InputLabel htmlFor="country" value="Country" />
                <TextInput id="country" type="text" name="country" value={data.country} onChange={(e) => setData('country', e.target.value)} />
                <IconButton icon={<BuildingAdd className="text-xl" />} text="Add school" onClick={() => {}} />
            </form>
        </AuthenticatedLayout>
    )
}