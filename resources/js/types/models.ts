export type School = {
    id: number;
    name: string;
    city: string;
    country: string;
}

export type Participant = {
    id: number;
    name: string;
    lastname: string;
    school: School;
    image_id: number;
}

export type Tournament = {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    round_number: number;
    host_id: number;
}

export type Match = {
    id: number;
    tournament_id: number;
    match_participants: MatchParticipant[];
}

export type MatchParticipant = {
    id: number;
    participant_id: number;
    participant: Participant;
    tournament_match_id: number;
    tournament_match: Match;
    participant_score: number;
}