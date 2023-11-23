import fs from 'fs';
import path from 'path';
import { xdgConfig } from 'xdg-basedir';
import toml from '@iarna/toml';
import { parseDuration, parseTimestamp } from './parse.js';
import WtcConfig from './types/WtcConfig.js';
import Language from './types/Language.js';

interface RawConfig extends Omit<WtcConfig, 'lunchBreakDuration' | 'defaults'> {
    lunchBreakDuration: string;
    defaults: {
        workDayDuration: string;
        startTime: string;
        stopTime: string;
    };
}

const defaultConfig: RawConfig = {
    language: Language.en,
    timestampFormat: 'YYYY-MM-DD HH:mm',
    lunchBreakDuration: '00:30',
    defaults: {
        workDayDuration: '07:30',
        startTime: '08:00',
        stopTime: 'now',
    },
    askInput: {
        workDayLength: true,
        startTime: true,
        stopTime: true,
        logged: true,
    },
};

const getConfig = (): WtcConfig => {
    const configDir = xdgConfig || path.join(process.env.HOME ?? './', '.config');
    let configFilePath = path.join(configDir, 'wtc', 'config.toml');

    let configData: RawConfig;
    if (fs.existsSync(configFilePath)) {
        configData = toml.parse(fs.readFileSync(configFilePath, 'utf8')) as unknown as RawConfig;
    } else {
        configData = defaultConfig;
    }

    return {
        language: configData.language ?? defaultConfig.language,
        timestampFormat: configData.timestampFormat ?? defaultConfig.timestampFormat,
        lunchBreakDuration: parseDuration(configData.lunchBreakDuration),
        defaults: {
            workDayDuration: parseDuration(
                configData.defaults.workDayDuration ?? defaultConfig.defaults.workDayDuration,
            ),
            startTime: parseTimestamp(configData.defaults.startTime ?? defaultConfig.defaults.startTime),
            stopTime: parseTimestamp(configData.defaults.stopTime ?? defaultConfig.defaults.stopTime),
        },
        askInput: {
            workDayLength: configData.askInput.workDayLength ?? defaultConfig.askInput.workDayLength,
            startTime: configData.askInput.startTime ?? defaultConfig.askInput.startTime,
            stopTime: configData.askInput.stopTime ?? defaultConfig.askInput.stopTime,
            logged: configData.askInput.logged ?? defaultConfig.askInput.logged,
        },
    };
};

export default getConfig;
