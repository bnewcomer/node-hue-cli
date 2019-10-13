import { Light } from "../bridge/Light";
    
export type ConnectResponse = [
    {
        success?: {
            username: string;
        };
        error?: {
            type: number;
            description: string;
        };
    }
];

export interface LightsResponse {
    [key: string]: Light; 
}

export class LinkButtonError extends Error {}