import { IconButton } from "@/Components/IconButton";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { School } from "@/types/models";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pencil, PersonAdd, Plus, Trash } from "react-bootstrap-icons";
import { toast } from "react-toastify";

export default function Index({ auth, schools }: PageProps<{ schools: School[] }>) {
    const [schoolsList, setSchoolsList] = useState(schools);

    const deleteSchool = (id: number) => {
        axios.delete(route('school.destroy', id))
            .then((response) => {
                // Check if response contains error
                if (response.data.error) {
                    toast.error(response.data.error);
                    return;
                }
                
                // Remove the school from the schools array
                const updatedSchools = schools.filter((school) => school.id !== id);
                setSchoolsList(updatedSchools);
            })
            .catch((error) => {
                console.error(error);
                toast.error('An error occurred while deleting the school');
            });
    }

    return (
        <Authenticated header={<h1>Schools</h1>}>
            <div className="mx-auto max-w-7xl">
                <div className="flex items-center gap-2 mt-3">
                    <h1 className="text-xl font-bold">
                        Schools ({schoolsList.length})
                    </h1>
                    <div className="flex gap-2">
                        <Link href={route('school.create')} className="flex items-center gap-1 p-2 text-white bg-blue-500 rounded-md shadow-md">
                            <Plus className="text-xl" />
                            Add School
                        </Link>
                    </div>
                </div>

                <div className="p-3 mt-2 bg-white rounded-md shadow-md">
                    <table className="w-full border border-collapse border-gray-200">
                        <thead>
                            <tr>
                                <th className="p-2 border border-gray-200">Name</th>
                                <th className="p-2 border border-gray-200">City</th>
                                <th className="p-2 border border-gray-200">Country</th>
                                <th className="p-2 border border-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schoolsList.map((school) => (
                                <tr key={school.id}>
                                    <td className="p-2 border border-gray-200">{school.name}</td>
                                    <td className="p-2 border border-gray-200">{school.city}</td>
                                    <td className="p-2 border border-gray-200">{school.country}</td>
                                    <td className="flex justify-end gap-2 p-2 border border-gray-200">
                                        <IconButton className=" !bg-red-500" icon={<Trash className="text-xl" />} text="Delete" onClick={() => deleteSchool(school.id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Authenticated>
    )
}