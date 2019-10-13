export interface Light {
    state: {
        on: boolean;
        bri: number;
        hue: number;
        sat: number;
        effect: 'none' | string;
        xy: [number, number];
        ct: number;
        alert: 'none' | string;
        colormode: 'xy' | string;
        mode: 'homeautomation' | string;
        reachable: boolean;
    },
    type: string;
    name: string;
    modelid: string;
    manufacturername: string;
    productname: string;
    capabilities: {
        certified: boolean;
        control: {
            mindimlevel: number;
            maxlumen: number;
            colorgamuttype: 'B' | string;
            colorgamut: [number, number][];
            ct: {
                min: number;
                max: number;
            }
        }
        streaming: {
            renderer: boolean;
            proxy: boolean;
        }
    }
    config: {
        archetype: 'sultanbulb' | string;
        function: 'mixed' | string;
        direction: 'omnidirectional' | string;
    }
    uniqueid: string;
    swversion: string;
}