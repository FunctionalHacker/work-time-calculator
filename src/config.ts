import fs from 'fs';
import path from 'path';
import { xdgConfig } from 'xdg-basedir';
import toml from '@iarna/toml';
import { parseDuration, parseTimestamp } from './parse.js';
import WtcConfig from './types/WtcConfig.js';
import Language from './types/Language.js';

interface RawConfig extends Omit<WtcConfig, 'unpaidLunchBreakDuration' | 'defaults'> {
    unpaidLunchBreakDuration: string;
    defaults: {
        workDayDuration: string;
        startTime: string;
        stopTime: string;
        hadLunch: boolean;
    };
}

const defaultConfig: RawConfig = {
    language: Language.en,
    timestampFormat: 'YYYY-MM-DD HH:mm',
    unpaidLunchBreakDuration: '00:30',
    defaults: {
        workDayDuration: '07:30',
        startTime: '08:00',
        stopTime: 'now',
        hadLunch: true,
    },
    askInput: {
        workDayDuration: true,
        startTime: true,
        stopTime: true,
        logged: true,
    },
};

const getConfig = (): WtcConfig => {
    const configDir = xdgConfig || path.join(process.env.HOME ?? './', '.config');
    let configFilePath = path.join(configDir, 'wtc', 'config.toml');

    let configData: Partial<RawConfig>;
    if (fs.existsSync(configFilePath)) {
        configData = toml.parse(fs.readFileSync(configFilePath, 'utf8')) as unknown as RawConfig;
    } else {
        configData = defaultConfig;
    }

    const { language, timestampFormat, unpaidLunchBreakDuration, defaults, askInput } = configData;

    return {
        language: language ?? defaultConfig.language,
        timestampFormat: timestampFormat ?? defaultConfig.timestampFormat,
        unpaidLunchBreakDuration: !unpaidLunchBreakDuration
            ? undefined
            : parseDuration(unpaidLunchBreakDuration),
        defaults: {
            workDayDuration: parseDuration(defaults?.workDayDuration ?? defaultConfig.defaults.workDayDuration),
            startTime: parseTimestamp(defaults?.startTime ?? defaultConfig.defaults.startTime),
            stopTime: parseTimestamp(defaults?.stopTime ?? defaultConfig.defaults.stopTime),
            hadLunch: defaults?.hadLunch ?? defaultConfig.defaults.hadLunch,
        },
        askInput: {
            workDayDuration: askInput?.workDayDuration ?? defaultConfig.askInput.workDayDuration,
            startTime: askInput?.startTime ?? defaultConfig.askInput.startTime,
            stopTime: askInput?.stopTime ?? defaultConfig.askInput.stopTime,
            logged: askInput?.logged ?? defaultConfig.askInput.logged,
        },
    };
};

export default getConfig;
