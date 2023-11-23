import Language from './types/Language';

export enum MessageKey {
    promptWorkDayDuration,
    promptStartTime,
    promptStopTime,
    parseTimeFailed,
    startTimeBeforeStopTimeError,
    promptLunchBreak,
    unpaidLunch,
    promptLogged,
    none,
    startedWorking,
    stoppedWorking,
    workedToday,
    loggedOver,
    workedOvertime,
    workLeft,
    hoursCalculated,
    klo,
    unloggedToday,
    hoursRounded,
}

const messages: Record<MessageKey, Record<Language, string>> = {
    [MessageKey.promptWorkDayDuration]: {
        [Language.en]: 'How long is your work day today, excluding the lunch break? [{0}]: ',
        [Language.fi]: 'Kuinka pitkä työpäiväsi on tänään, poisluettuna lounastauko? [{0}]: ',
    },
    [MessageKey.promptStartTime]: {
        [Language.en]: 'What time did you start work today? [{0}]: ',
        [Language.fi]: 'Mihin aikaan aloitit työskentelyn tänään? [{0}]: ',
    },
    [MessageKey.promptStopTime]: {
        [Language.en]: "What time did you stop working? If you didn't stop yet, leave this empty: ",
        [Language.fi]: 'Mihin aikaan lopetit työskentelyn? Jos et lopettanut vielä, jätä tämä tyhjäksi: ',
    },
    [MessageKey.parseTimeFailed]: {
        [Language.en]: 'Failed to parse time "{0}", using default value "{1}"',
        [Language.fi]: 'Ajan "{0}" parsiminen epäonnistui, käytetään oletusasetusta "{1}"',
    },
    [MessageKey.startTimeBeforeStopTimeError]: {
        [Language.en]: 'Start time ({0}) needs to be before stop time ({1}). Exiting',
        [Language.fi]: 'Aloitusaika ({0}) pitää olla ennen lopetusaikaa ({1}). Ohjelma sammuu',
    },
    [MessageKey.promptLunchBreak]: {
        [Language.en]: 'Did you have a lunch break? [y/N]: ',
        [Language.fi]: 'Piditkö jo lounastauon? [k/E]: ',
    },
    [MessageKey.unpaidLunch]: {
        [Language.en]: 'Unpaid lunch duration:',
        [Language.fi]: 'Palkattoman lounaan pituus:',
    },
    [MessageKey.promptLogged]: {
        [Language.en]: 'How many hours did you log already? [00:00] ',
        [Language.fi]: 'Kuinka monta tuntia kirjasit jo? [00:00] ',
    },
    [MessageKey.none]: {
        [Language.en]: 'None',
        [Language.fi]: 'Ei yhtään',
    },
    [MessageKey.startedWorking]: {
        [Language.en]: 'Started working:',
        [Language.fi]: 'Aloitit työskentelyn:',
    },
    [MessageKey.stoppedWorking]: {
        [Language.en]: 'Stopped working',
        [Language.fi]: 'Lopetit työskentelyn',
    },
    [MessageKey.hoursCalculated]: {
        [Language.en]: 'Hours calculated',
        [Language.fi]: 'Tunnit laskettu',
    },
    [MessageKey.workedToday]: {
        [Language.en]: 'Worked today:',
        [Language.fi]: 'Tänään työskennelty:',
    },
    [MessageKey.workedOvertime]: {
        [Language.en]: 'You worked {0} overtime today',
        [Language.fi]: 'Olet tehnyt {0} ylitöitä tänään',
    },
    [MessageKey.loggedOver]: {
        [Language.en]: 'You have logged {0} more than you worked today!',
        [Language.fi]: 'Olet kirjannut {0} enemmän kuin olet työskennellyt!',
    },
    [MessageKey.workLeft]: {
        [Language.en]: 'You still have to work {0} more today',
        [Language.fi]: 'Sinun pitää työskennellä tänään vielä {0} lisää',
    },
    [MessageKey.klo]: {
        [Language.en]: 'at',
        [Language.fi]: 'klo',
    },
    [MessageKey.unloggedToday]: {
        [Language.en]: 'Unlogged today:',
        [Language.fi]: 'Kirjaamattomia tänään:',
    },
    [MessageKey.hoursRounded]: {
        [Language.en]: 'as hours rounded to next even 15 minutes',
        [Language.fi]: 'tunteina pyöristettynä seuraavaan 15 minuuttiin',
    },
};

/**
 * Get a function to fetch messages for a given language
 * @param language The language to get the messages for
 */
export const message =
    (language: Language) =>
    /**
     * Get a message for a fiven key
     * @param key The key of the message
     */
    (key: keyof typeof messages, ...params: string[]) => {
        let result = messages[key][language];
        if (!result) {
            throw `Unknown language: ${language}`;
        }

        // Replace parameters in the template
        for (let i = 0; i < params.length; i++) {
            result = result.replace(new RegExp(`\\{${i}\\}`, 'g'), params[i]);
        }
        return result;
    };
