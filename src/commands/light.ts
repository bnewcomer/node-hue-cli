import inquirer, { DistinctQuestion } from 'inquirer';

import { Light } from '../bridge/Light';

export async function lightCLI(light: Light | null) {
    if (!light) {
        return;
    }

    const question: DistinctQuestion = {
        type: 'list',
        name: 'command',
        message: `What would you like to do with ${light.name}?`,
        choices: [
            'turn on',
            'turn off',
            'back'
        ]
    }

    // TODO
}