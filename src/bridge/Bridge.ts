import UPnPClient, { DeviceDescription } from 'node-upnp';
import axios, { AxiosResponse } from 'axios';
import fs from 'fs';

import { HueAPI } from '../api/HueAPI';
import { Light } from './Light';

const BRIDGE_STORE_FILENAME = 'store/bridges.json';
const DEVICE_TYPE = 'node-js-bridge-device';

interface BridgeStore {
    connectedBridge: {
        id: string;
        url: string;
        ipAddress: string;
        username?: string;
    }
}

interface HueApiError {
    type: number;
        description: string;
}

interface HueAPIResponse<Success extends object> {
    success?: Success;
    error?: HueApiError;
}

type HueAPIResponses<T extends object = object> = HueAPIResponse<T>[];

export class LinkButtonError extends Error {}

export class Bridge {
    deviceDescription: DeviceDescription = {
        deviceType: '',
        friendlyName: '',
        manufacturer: '',
        manufacturerURL: '',
        modelName: '',
        modelNumber: '',
        modelDescription: '',
        UDN: '',
        services: {},
    };
    lights: Light[] = [];

    static load() {
        const bridgesBuffer = fs.readFileSync(BRIDGE_STORE_FILENAME).toString();
        const bridgeStore: BridgeStore = JSON.parse(bridgesBuffer);

        if (bridgeStore.connectedBridge) {
            const { id, url, ipAddress, username } = bridgeStore.connectedBridge;
            return new Bridge(id, url, ipAddress, username);
        }

        return null;
    }

    constructor(public id: string, public url: string, public ipAddress: string, public username?: string) {}

    async getDescription() {
        const client = new UPnPClient({ url: this.url });
        this.deviceDescription = await client.getDeviceDescription();
        return this.deviceDescription;
    }

    async getLights() {
        if (!this.username) {
            throw new Error('No username');
        }

        if (this.lights.length === 0) {
            const response = await axios.get<HueAPI.LightsResponse>(
                `http://${this.ipAddress}/api/${this.username}/lights`
            );
            this.lights = Object.values(response.data);
        }

        return this.lights;
    }

    async connect() {
        if (this.username) {
            return this.username;
        }

        const response = await axios.post<HueAPI.ConnectResponse>(
            `http://${this.ipAddress}/api`, 
            { devicetype: DEVICE_TYPE }
        );

        const { error, success } = response.data[0];

        if (error && error.type === 101) {
            throw new LinkButtonError('Please press the link button');
        } else if (success) {
            this.username = success.username;
            this.save();
        }
    }

    save() {
        const bridgesBuffer = fs.readFileSync(BRIDGE_STORE_FILENAME).toString();
        const bridgeStore: BridgeStore = JSON.parse(bridgesBuffer);

        bridgeStore.connectedBridge = {
            id: this.id,
            url: this.url,
            ipAddress: this.ipAddress,
            username: this.username
        };

        fs.writeFileSync(BRIDGE_STORE_FILENAME, JSON.stringify(bridgeStore));
    }
}
