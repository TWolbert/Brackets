import { IconButton } from "@/Components/IconButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { decidedMatchesAtom, tournamentRoundResultsAtom } from "@/jotai";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Match, MatchParticipant, Participant, Tournament } from "@/types/models";
import axios from "axios";
import { useAtom } from "jotai";
import { observe } from "jotai-effect";
import { Fragment, useEffect, useRef, useState } from "react";
import { Flag, X } from "react-bootstrap-icons";
import { toast } from "react-toastify";

export default function Show({ auth, tournament, matches, won }: PageProps<{ tournament: Tournament, matches: Match[], won: Participant | null }>) {
    const [decidedMatches] = useAtom(decidedMatchesAtom);
    const [showSubmitRound, setShowSubmitRound] = useState(false);
    const [tournamentResult, setTournamentResult] = useAtom(tournamentRoundResultsAtom);
    const [ownsTournament] = useState(tournament.host_id === auth.user.id);

    useEffect(() => {
        if (decidedMatches.length === matches.length) {
            setShowSubmitRound(true);
        }
    }, [decidedMatches]);

    const handleSaveRound = () => {
        axios.post('/tournament/save-round', {
            tournament_id: tournament.id,
            results: tournamentResult
        }).then(() => {
            toast.success('Round saved');
            location.reload();
        }).catch(() => {
            toast.error('Failed to save round');
        })
    }

    return (
        <Authenticated header={<h1>{tournament.name} (Round number: {tournament.round_number})</h1>}>
            {won ? (
                <div className="bg-green-500 mx-auto w-fit p-3 rounded-md shadow-md mb-3 mt-3">
                    <h1 className="text-2xl">Tournament winner</h1>
                    <p className="text-xl">{won.name} {won.lastname}</p>
                </div>
            ) :
                <div className="mt-3 mx-12">
                    <h1 className="text-2xl mb-2">
                        Round number {tournament.round_number}
                    </h1>
                    <div className="flex flex-col gap-2">
                        {matches.map(match => <MatchTile ownsTournament={ownsTournament} key={match.id} match={match} />)}
                    </div>
                    {ownsTournament &&
                        <div className="flex gap-2 items-center">
                            <IconButton disabled={!showSubmitRound} className="mt-3 disabled:bg-blue-300" onClick={handleSaveRound} icon={<Flag />} text="Save current rounds" />
                            {!showSubmitRound && <p>Please submit scores for all the roundes before clicking submit</p>}
                        </div>
                    }

                </div>
            }
        </Authenticated>
    )
}

function MatchTile({ match, ownsTournament }: { match: Match, ownsTournament: boolean }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [decidedMatches] = useAtom(decidedMatchesAtom);
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

                    {!decided && ownsTournament && <IconButton icon={<Flag />} className={!isBye ? '!bg-yellow-500' : ''} text="Determine winner" onClick={() => setDialogOpen(!dialogOpen)} />}
                    {decided && <p>This match has been decided</p>}
                </div>
                {isBye ? <p className="w-full bg-blue-500 p-1"></p> : <p className="w-full bg-yellow-500 p-1"></p>}
            </div>
        </>
    );
}

function DetermineWinnerDialog({ match, onClose }: { match: Match, onClose: () => void }) {
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);

    const [tournamentResult, setTournamentResult] = useAtom(tournamentRoundResultsAtom);
    const [decidedMatches, setDecidedMatches] = useAtom(decidedMatchesAtom);
    const firstInputRef = useRef<HTMLInputElement>(null);
    const handleDetermineWinner = () => {
        // Check if scores are valid
        if (score1 < 0 || score1 > 3) {
            toast.error('Score for the first participant is invalid');
            return;
        }
        if (score2 < 0 || score2 > 3) {
            toast.error('Score for the second participant is invalid');
            return;
        }

        if (tournamentResult === null) {
            setTournamentResult([{ id: match.id, score1, score2 }]);
        } else {
            setTournamentResult([...tournamentResult, { id: match.id, score1, score2 }]);
        }

        setDecidedMatches([...decidedMatches, match.id]);
        onClose();
    };

    useEffect(() => {
        if (match.match_participants.length === 1) {
            setScore1(3);
            handleDetermineWinner();
        }

        firstInputRef.current?.focus();
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md">
                <div className="flex flex-col gap-2">
                    <InputLabel>{match.match_participants[0].participant.name} {match.match_participants[0].participant.lastname}</InputLabel>
                    <TextInput ref={firstInputRef} placeholder={`${match.match_participants[0].participant.name}'s score`} type="number" value={score1} onChange={(e) => setScore1(e.target.value === '' ? 0 : parseInt(e.target.value))} />
                    {match.match_participants.length > 1 && (
                        <>
                            <InputLabel>{match.match_participants[1].participant.name} {match.match_participants[1].participant.lastname}</InputLabel>
                            <TextInput placeholder={`${match.match_participants[1].participant.name}'s score`} type="number" value={score2} onChange={(e) => setScore2(e.target.value === '' ? 0 : parseInt(e.target.value))} />
                        </>
                    )}
                </div>
                <div className="flex justify-between gap-2 mt-2">
                    <IconButton icon={<Flag />} text="Determine winner" onClick={handleDetermineWinner} />
                    <IconButton icon={<X />} className="bg-red-500" text="Cancel" onClick={onClose} />
                </div>
            </div>
        </div>
    );
}
