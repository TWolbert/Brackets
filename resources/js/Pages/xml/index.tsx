import { IconButton } from "@/Components/IconButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { useForm } from "@inertiajs/react";
import React from "react";
import { Plus } from "react-bootstrap-icons";

export default function Index() {
    const { data, setData, post, processing, errors } = useForm({
        xmlData: ''
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null) { 
            return; 
        }

        const fileData = e.target.files[0];
        const fileText = await fileData.text();
        setData('xmlData', fileText);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('xml.store'));
    }

    return (
        <>
            <Authenticated header={<h1>Sexx</h1>}>
                {/* File upload for XML */}
                <input type="file" onChange={handleFileChange} />
                <textarea value={data.xmlData} readOnly />
                <form onSubmit={handleFormSubmit}>
                    <input type="text" value={data.xmlData} hidden name="xmlData" />
                    <IconButton icon={<Plus className="text-xl" />} onClick={() => {}} text="Upload XML" />
                </form>
            </Authenticated>
        </>
    )
}