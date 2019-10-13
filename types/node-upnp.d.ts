declare module 'node-upnp' {
    interface UPnPClientOptions {
        url: string;
    }

    interface Service {
        serviceType: string;
        SCPDURL: string;
        controlURL: string;
        eventSubURL: string;
    }

    export interface DeviceDescription {
        deviceType: string;
        friendlyName: string;
        manufacturer: string;
        manufacturerURL: string;
        modelName: string;
        modelNumber: string;
        modelDescription: string;
        UDN: string;
        services: Record<string, Service>;
    }

    export default class UPnPClient {
        constructor(options: UPnPClientOptions);
        getDeviceDescription(): Promise<DeviceDescription>;
    }
}