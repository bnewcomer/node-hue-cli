import inquirer, { DistinctQuestion } from 'inquirer';
import chalk from 'chalk';

import { connectToBridge } from './commands/bridge';
import { Bridge } from './bridge/Bridge';
import { lightsCLI } from './commands/lights';

async function main() { 
    let exit = false;
    let bridge: Bridge;
    
    // attempt to load and connect to saved bridge
    const savedBridge = Bridge.load();
    if (savedBridge && savedBridge.username) {
        const description = await savedBridge.getDescription();
        bridge = savedBridge;
        console.log(chalk.bgBlue(`connected to: ${description.friendlyName}\n`));
    } else {
        bridge = await connectToBridge();
    }

    while (!exit) {
        const response = await inquirer.prompt({
            type: 'list',
            name: 'command',
            message: 'What would you like to do?',
            choices: [
                'interact with lights',
                'connect to a bridge',
                'exit'
            ]
        });

        switch (response.command) {
            case 'interact with lights':
                await lightsCLI(bridge);
                break;
            case 'connect to a bridge':
                bridge = await connectToBridge();
                break;
            case 'exit':
            default: 
                exit = true;
        }
    }

    console.log(chalk.bgBlue('Goodbye'));
}

main();

