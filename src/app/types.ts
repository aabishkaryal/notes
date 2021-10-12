export type User = {
    key: string;
    email: string;
    passwordHash: string;
    categories: string[];
};

export type Category = {
    key: string;
    notes: string[];
};

export type Note = {
    key: string;
    topic: string;
    content: string;
};
