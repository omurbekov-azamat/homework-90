export interface DrawCoordinate {
    x: number;
    y: number;
    color: string;
}

export interface IncomingMessage {
    type: string;
    payload: DrawCoordinate;
}