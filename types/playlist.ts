interface CreatedByInfo {
    _id: string;
    name: string;
}

export interface SongInfo {
    _id: string;
    title: string;
    fileSong?: {
        public_id: string;
        secure_url: string;
    };
    fileScore?: {
        public_id: string;
        secure_url: string;
    };
    linkSong?: string;
    category?: string;
}

export interface TransformedPlaylist {
    _id: string;
    name: string;
    createdBy: CreatedByInfo | null;
    songs: SongInfo[];
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v?: number;
}