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