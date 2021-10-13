export type User = {
    key: string;
    email: string;
    passwordHash: string;
    categoryIDs: string[];
};

export type Category = {
    key: string;
    name: string;
    noteIDs: string[];
    userID: string;
};

export type Note = {
    key: string;
    topic: string;
    content: string;
    categoryID: string;
};
