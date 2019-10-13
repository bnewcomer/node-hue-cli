import Inquirer, { DistinctQuestion } from 'inquirer';
import { Client } from 'node-ssdp';

import { LinkButtonError } from '../api/HueAPI';
import { Bridge } from '../bridge/Bridge';


export async function connectToBridge(bridge = Bridge.load()): Promise<Bridge> {
    if (bridge) {
        console.log('found saved bridge... ');
    } else {
        console.log('searching (5s)... ');
        const bridges = await findBridges();
        bridge = await selectBridge(bridges);
        bridge.save();
        console.log(`saved bridge: ${bridge.deviceDescription.friendlyName}... `);
    }

    console.log('connecting... ');

    try {
        await bridge.connect();
    } catch (e) {
        if (e instanceof LinkButtonError) {
            console.log(e);
            const question: DistinctQuestion = {
                type: 'confirm',
                name: 'bridge',
                message: 'Press enter once you have pressed the link button on the bridge',
            };
            await Inquirer.prompt(question);
            await connectToBridge();
        }
    }
    
    const description = await bridge.getDescription();
    console.log(`connected to ${description.friendlyName}`);
    return bridge;
}

async function selectBridge(availableBridges: Bridge[]) {

    if (availableBridges.length === 1) {
        const bridge = availableBridges[0];
        console.log(`One bridge found: ${bridge.deviceDescription.friendlyName}`);
        return bridge;
    }

    const question: DistinctQuestion = {
        type: 'list',
        name: 'bridge',
        message: 'Which bridge do you want to connect to?',
        choices: availableBridges.map(b => ({ name: b.deviceDescription.friendlyName, value: b.id }))
    };

    const answer = await Inquirer.prompt(question);
    const selectedBridge = availableBridges.find(b => b.id === answer.bridge);

    if (!selectedBridge) {
        throw new Error('No bridge selected');
    }

    return selectedBridge;
}

function findBridges(wait = 5000): Promise<Bridge[]> {
    return new Promise((resolve) => {
        const client = new Client();
        const devices: Record<string, Bridge> = {};
    
        client.on('response', (headers, statusCode, rinfo) => {
            if (headers['HUE-BRIDGEID']) {
                const hueId = headers['HUE-BRIDGEID'];
                const uPnPUrl = headers['LOCATION'];
                const ipAddress = rinfo.address;

                if (typeof hueId === 'string' && !devices[hueId]) {
                    devices[hueId] = new Bridge(hueId, uPnPUrl!, ipAddress!);
                    devices[hueId].getDescription();
                }
            }
        });

        client.search('urn:schemas-upnp-org:device:basic:1');

        setTimeout(() => {
            client.stop();
            resolve(Object.values(devices));
        }, wait);
    })
} 