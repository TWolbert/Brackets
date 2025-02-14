import { atom } from "jotai";
import { Participant } from "./types/models";
import { atomWithStorage } from "jotai/utils";

export interface TournamentRoundResults {
    id: number;
    score1: number;
    score2: number;
}

export const tournamentRoundResultsAtom = atom<TournamentRoundResults[] | null>(null);
export const decidedMatchesAtom = atom<number[]>([]);