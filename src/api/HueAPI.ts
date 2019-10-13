import { Light } from "../bridge/Light";

export namespace HueAPI {        
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
}   