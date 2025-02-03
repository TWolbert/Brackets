import { atom } from "jotai";
import { Participant } from "./types/models";

export interface TournamentRoundResults {
    tournament_id: number;
    match_winners: Participant[];
}

export const tournamentRoundResultsAtom = atom<TournamentRoundResults | null>(null);
export const decidedMatchesAtom = atom<number[]>([]);