import { IconButton } from "@/Components/IconButton";
import { decidedMatchesAtom, tournamentRoundResultsAtom } from "@/jotai";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Match, MatchParticipant, Tournament } from "@/types/models";
import { useAtom } from "jotai";
import { observe } from "jotai-effect";
import { useEffect, useState } from "react";
import { Flag } from "react-bootstrap-icons";

export default function Show({ tournament, matches }: { tournament: Tournament, matches: Match[] }) {
    const [tournamentResult, setTournamentResult] = useAtom(tournamentRoundResultsAtom);

    useEffect(() => {
        setTournamentResult({
            tournament_id: tournament.id,
            match_winners: [],
        });
    }, []);

    return (
        <Authenticated header={<h1>{tournament.name} (Round number: {tournament.round_number})</h1>}>
            <div className="mt-3 mx-12">
                <h1 className="text-2xl mb-2">
                    Round number {tournament.round_number}
                </h1>
                <div className="flex flex-col gap-2">
                    {matches.map(match => <MatchTile match={match} />)}
                </div>
                <IconButton className="mt-3" onClick={() => { }} icon={<Flag />} text="Save current rounds" />
            </div>
        </Authenticated>
    )
}

function MatchTile({ match }: { match: Match }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [decidedMatches, setDecidedMatches] = useAtom(decidedMatchesAtom);
    const [decided, setDecided] = useState(false);

    const isBye = match.match_participants.length > 1;
    const unobserveMatches = observe((get, set) => {
        if (decidedMatches.includes(match.id)) {
            setDecided(true);
        }
    })

    return (
        <>
            {dialogOpen && <DetermineWinnerDialog match={match} onClose={() => setDialogOpen(false)} />}
            <div className=" shadow-md rounded-md bg-white w-full overflow-hidden">
                <div className="p-3 flex justify-between items-center w-full">
                    <div>
                        <p>
                            Match number: {match.id}
                        </p>
                        {match.match_participants.length === 1 && (
                            <div>
                                Bye match for <span className="font-bold">{match.match_participants[0].participant.name} {match.match_participants[0].participant.lastname}</span>
                            </div>
                        )}
                        {match.match_participants.length > 1 && (
                            <div>
                                Match between <span className="font-bold">{match.match_participants[0].participant.name} {match.match_participants[0].participant.lastname}</span> and <span className="font-bold">{match.match_participants[1].participant.name} {match.match_participants[1].participant.lastname}</span>
                            </div>
                        )}
                    </div>

                    {!decided && <IconButton icon={<Flag />} className={!isBye ? '!bg-yellow-500' : ''} text="Determine winner" onClick={() => setDialogOpen(!dialogOpen)} />}
                    {decided && <p>This match has been decided</p>}
                </div>
                {isBye ? <p className="w-full bg-blue-500 p-1"></p> : <p className="w-full bg-yellow-500 p-1"></p>}
            </div>
        </>
    );
}

function DetermineWinnerDialog({ match, onClose }: { match: Match, onClose: () => void }) {
    const [tournamentResult, setTournamentResult] = useAtom(tournamentRoundResultsAtom);
    const [decidedMatches, setDecidedMatches] = useAtom(decidedMatchesAtom);
    const [decided, setDecided] = useState(false);

    useEffect(() => {
        if (decidedMatches.includes(match.id)) {
            setDecided(true);
        }
    }, [])

    const handleBye = () => {
        if (tournamentResult === null) return;
        setTournamentResult({
            ...tournamentResult,
            match_winners: [
                ...tournamentResult.match_winners,
                match.match_participants[0].participant
            ]
        })

        setDecided(true);

        setDecidedMatches([
            ...decidedMatches,
            match.id
        ]);
    }

    const handleWinner = (participant: MatchParticipant) => {
        if (tournamentResult === null) return;
        setTournamentResult({
            ...tournamentResult,
            match_winners: [
                ...tournamentResult.match_winners,
                participant.participant
            ]
        })

        setDecided(true);

        setDecidedMatches([
            ...decidedMatches,
            match.id
        ]);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md">
                {decided ? <div className="font-bold">Match has already been decided</div> : <>
                    <h2 className="text-lg font-bold mb-4">Determine Winner</h2>
                    {match.match_participants.length === 1 ? (
                        <button
                            className="block w-full mb-2 p-2 bg-green-500 text-white rounded-md"
                            onClick={() => {
                                handleBye();
                                onClose();
                            }}
                        >
                            Confirm Bye for {match.match_participants[0].participant.name} {match.match_participants[0].participant.lastname}
                        </button>
                    ) : (
                        match.match_participants.map(participant => (
                            <button
                                key={participant.participant.id}
                                className="block w-full mb-2 p-2 bg-blue-500 text-white rounded-md"
                                onClick={() => {
                                    handleWinner(participant);
                                    onClose();
                                }}
                            >
                                {participant.participant.name} {participant.participant.lastname}
                            </button>
                        ))
                    )}</>}
                <button
                    className="block w-full mt-4 p-2 bg-gray-500 text-white rounded-md"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
