import {openQuestionInGoogle, openLastQuestionInGoogleFromHistory} from "./google/google";

const config: CommandConfig[] = [
    {
        flag: 'n',
        description: 'At the start remove the history and init the new one',
        action: () => {},
        emptyMessageAction: () => {},
        type: 'INIT_HISTORY'
    },
    {
        flag: 'g',
        description: 'Open the history or typed question in the google',
        action: (question: string) => openQuestionInGoogle(question),
        emptyMessageAction: () => openLastQuestionInGoogleFromHistory(),
        type: 'GOOGLE'
    },
    {
        flag: '',
        description: 'Default config. Just ask the question',
        action: () => {},
        emptyMessageAction: () => {},
        type: 'NORMAL'
    }
]

export const checkInput = () => {
    const command = getCmdLineInput();
    const correctConfigs = config
        .filter(item => command.startsWith(`-${item.flag}`) && item.flag !== '');
    const defaultConfig = config.find(item => item.flag === '');

    if (correctConfigs.length > 1) {
        console.log('Too many options')
        process.exit(1)
    } else if (correctConfigs.length === 1) {
        execInput(correctConfigs[0], command);
    } else {
        execInput(defaultConfig, command);
    }
}

export const execInput = (config: CommandConfig, command: String) => {
    let onlyQuestion = command.slice().trim()
    console.log('confg', JSON.stringify(config))
    if (config.flag.length > 0) {
        onlyQuestion = onlyQuestion.replace(`-${config.flag}`, '').trim()
    }
    if (onlyQuestion === '') {
        config.emptyMessageAction()
    } else {
        config.action(onlyQuestion)
    }
}

const getCmdLineInput = () => {
    let args = process.argv
    args.shift() // first is path to nodejs
    args.shift() // second is path to the script
    return args.join(' ').trim()
}

type CommandConfig = {
    flag: string,
    description: string,
    action: (question: string) => void
    emptyMessageAction: () => void

    type: CommandType
}

export type CommandType = 'INIT_HISTORY' | 'GOOGLE' | 'NORMAL'