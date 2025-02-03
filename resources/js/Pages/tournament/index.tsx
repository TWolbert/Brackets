import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Tournament } from "@/types/models";
import { Link } from "@inertiajs/react";
import { ArrowRight, Clock, ClockHistory, Flag, FlagFill, Plus } from "react-bootstrap-icons";

export default function Index({ tournaments }: PageProps<{ tournaments: Tournament[] }>) {
    return (
        <Authenticated header={<h1>Tournaments</h1>}>
            <div className="mx-16 mt-3">
                <div className="flex gap-2 items-center">
                    <h1 className=" ml-2">Tournaments ({tournaments.length})</h1>
                    <Link href={route('tournament.create')} className="flex items-center gap-1 p-2 text-white bg-blue-500 rounded-md shadow-md">
                        <Plus className="text-xl" />
                        Add Tournament
                    </Link>
                </div>

                <div className="flex flex-col gap-2 mt-2 p-3">
                    {tournaments.map((tournament) => (
                        <TournamentBox key={tournament.id} tournament={tournament} />
                    ))}
                </div>
            </div>
        </Authenticated>
    )
}

function TournamentBox({ tournament }: { tournament: Tournament }) {
    return (
        <div className="bg-white shadow-md rounded-md p-3 flex justify-between items-center min-w-96">
            <div>
                <h1 className="font-bold">{tournament.name}</h1>
                <div className=" flex flex-col">
                    <div className=" flex items-center gap-2">
                        <Clock /> Start time: {tournament.start_date}
                    </div>
                    <div className=" flex items-center gap-2">
                        <Flag /> End time: {tournament.end_date}
                    </div>
                </div>
                <div>
                    <div>
                        Status:&nbsp;
                        <ActivityLabel start_date={tournament.start_date} end_date={tournament.end_date} />
                    </div>
                </div>
            </div>
            <Link href={route('tournament.show', tournament.id)} className="flex items-center gap-2">
                <ArrowRight />
                Details
            </Link>
        </div>
    )
}

function ActivityLabel({ start_date, end_date }: { start_date: string, end_date: string }) {
    // Get the current date
    const currentDate = new Date();

    // Parse the start and end dates from strings to Date objects
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Determine the activity status based on current date
    if (currentDate < startDate) {
        return <span className=" text-red-500">Not Started</span>;
    } else if (currentDate >= startDate && currentDate <= endDate) {
        return <span className=" text-green-500">Currently Running</span>;
    } else {
        return <span className=" text-gray-500">Ended</span>;
    }
}