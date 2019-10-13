import inquirer, { DistinctQuestion } from 'inquirer';

import { Bridge } from '../bridge/Bridge';
import { Light } from '../bridge/Light';
import { lightCLI } from './light';

export async function lightsCLI(bridge: Bridge) { 
    const lights = await bridge.getLights();
    let exit = false;

    while (!exit) {
        const response = await inquirer.prompt({
            type: 'list',
            name: 'command',
            message: 'What would you like to do with lights?',
            choices: [
                'list all lights',
                'interact with a light',
                'back'
            ]
        });

        switch (response.command) {
            case 'list all lights':
                console.log(lights.map(l => l.name));
                break;
            case 'interact with a light':
                lightCLI(await selectLight(lights));
                break;
            case 'back':
            default: 
                exit = true;
        }
    }
}

export async function selectLight(lights: Light[]): Promise<Light | null> {
    const response = await inquirer.prompt({
        type: 'list',
        name: 'light',
        message: 'Which light?',
        choices: [...lights.map(l => ({ name: l.name, value: l })), 'back']
    });

    if (response.light === 'back') {
        return null;
    } else {
        return response.light;
    }
}
