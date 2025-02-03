import { IconButton } from "@/Components/IconButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { Plus } from "react-bootstrap-icons";
import { XMLParser } from 'fast-xml-parser';
import axios from "axios";
import { toast } from "react-toastify";
import { PageProps } from "@/types";

type ContestantXML = {
    name: string;
    lastname: string;
    school: string;
}

export default function Index() {
    const { data, setData, post, processing, errors } = useForm({
        xmlData: ''
    });

    const { flash } = usePage<PageProps<{ flash: { success: boolean } }>>().props;

    useEffect(() => {
        if (flash.success === true) {
            toast.success('XML uploaded');
        }
    }, []);

    const [allowUpload, setAllowUpload] = useState(false);

    const [participant, setParticipant] = useState<ContestantXML[]>([]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setAllowUpload(false);
        if (e.target.files === null) {
            return;
        }

        const fileData = e.target.files[0];
        const fileText = await fileData.text();
        setData('xmlData', fileText);

        // Parse XML using fast-xml-parser
        const parser = new XMLParser();
        const parsed = parser.parse(fileText);

        // Get the contestants from the parsed XML
        const contestants = parsed.aanmeldingen.aanmelding;

        let school = '';

        // Check if contestants is an array
        if (Array.isArray(contestants)) {
            setParticipant(contestants.map((contestant) => {
                school = contestant.schoolnaam;
                return {
                    name: contestant.spelervoornaam,
                    lastname: contestant.spelertussenvoegsels !== null ? contestant.spelertussenvoegsels + ' ' : '' + contestant.spelerachternaam,
                    school: contestant.schoolnaam
                }
            }));
        } else {
            setParticipant([{
                name: contestants.spelervoornaam,
                lastname: contestants.spelerachternaam,
                school: contestants.schoolnaam
            }]);
        }

        axios.post(route('school.exists'), {
            name: school
        }).then((response) => {
            const exists = response.data.exists;
            if (!exists) {
                toast.error('School does not exist yet, you need to create it first');
                setAllowUpload(false);
            }
            else {
                toast.success('School is verified to exist, you are ready to upload');
                setAllowUpload(true)
            }
        }).catch((error) => {
            console.error(error);
        });


    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('xml.store'));
    }

    return (
        <Authenticated header={<h1>Import using XML</h1>}>
            <div className="flex items-center gap-3 p-3 mx-auto mt-3 bg-white rounded-md shadow-md w-fit">
                {/* File upload for XML */}
                <input type="file" onChange={handleFileChange} className='p-2 border-gray-300 rounded-md shadow-sm file:px-3 file:border-none file:text-white file:rounded-md file:shadow-md file:py-2 file:bg-blue-500 focus:border-indigo-500 focus:ring-indigo-500 ' />
                <form onSubmit={handleFormSubmit}>
                    <input type="text" value={data.xmlData} hidden name="xmlData" readOnly />
                    <IconButton disabled={!allowUpload} className=" disabled:opacity-50 disabled:cursor-not-allowed" icon={<Plus className="text-xl" />} onClick={() => { }} text="Upload XML" />
                </form>
            </div>

            <div className="mx-auto mt-3 w-fit">
                {data.xmlData && <p className="p-3 font-bold bg-white rounded-md shadow-md">{participant.length} contestants found</p>}
                <div className="grid grid-cols-3 gap-3 mt-2">
                    {participant.map((contestant) => (
                        <div className="p-3 bg-white rounded-md shadow-md" key={contestant.name + contestant.lastname}>
                            <p>{contestant.name} {contestant.lastname}</p>
                            <p>{contestant.school}</p>
                        </div>
                    ))}
                </div>

            </div>

        </Authenticated>
    )
}