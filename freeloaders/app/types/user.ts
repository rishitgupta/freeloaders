export type Student = {
    id: number;
    password: string;
    display_name: string;
    calpoly_email: string;
    profile_photo: string | null;
};

export type Organization = {
    id: number;
    password: string;
    organization_email: string;
    display_name: string;
    profile_photo: string | null;
    point_of_contact: string;
    description: string;
    cover_photo: string | null;
};

export type User = {
    id: number;
    email: string;
    display_name: string;
    password: string;
    profile_photo: string | null;
};
