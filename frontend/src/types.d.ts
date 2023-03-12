export interface DrawCoordinate {
    x: number;
    y: number;
}

export interface IncomingMessage {
    type: string;
    payload: DrawCoordinate;
}