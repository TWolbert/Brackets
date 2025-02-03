import { PageProps } from "@/types";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IconButton } from "@/Components/IconButton";
import { BuildingAdd, PersonAdd, Plus } from "react-bootstrap-icons";
import { useState } from "react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import { countries } from "countries-list";
import { toast } from "react-toastify";
import InputError from "@/Components/InputError";

export default function Create({ auth }: PageProps) {
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
            <form onSubmit={submit} className="p-3 mx-auto mt-2 bg-white rounded-md shadow-md w-fit">
                <InputLabel htmlFor="name" value="School name" />
                <TextInput className="w-full" id="name" type="text" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                <InputError message={errors.name} />
                <InputLabel htmlFor="country" value="Country" />
                <select id="country" name="country" value={data.country} onChange={(e) => setData('country', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option value="">Select a country</option>
                    {Object.entries(countries).map(([code, country]) => (
                        <option key={code} value={country.name}>{country.name}</option>
                    ))}
                </select>
                <InputError message={errors.country} />
                <InputLabel htmlFor="city" value="City" />
                <TextInput className="w-full" id="city" type="text" name="city" value={data.city} onChange={(e) => setData('city', e.target.value)} />
                <InputError message={errors.city} />
                <IconButton className="w-full mt-2 disabled:opacity-50" disabled={processing} icon={<BuildingAdd className="text-xl" />} text={
                    data.name ? `Add ${data.name}` : 'Add school'
                } onClick={() => { }} />
            </form>
        </AuthenticatedLayout>
    )
}