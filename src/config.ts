import fs from 'fs';
import path from 'path';
import { xdgConfig } from 'xdg-basedir';
import toml from '@iarna/toml';
import { Dayjs } from 'dayjs';
import { Duration } from 'dayjs/plugin/duration.js';
import { parseDuration, parseTimestamp } from './parse.js';

const { debug } = console;

interface Config {
    defaults: {
        workDayDuration: Duration;
        lunchBreakDuration: Duration;
        startTime: Dayjs;
        stopTime: Dayjs;
    };
    askInput: {
        workDayLength: boolean;
        startTime: boolean;
        stopTime: boolean;
        logged: boolean;
        hadLunch: boolean;
    };
}

interface RawConfig extends Omit<Config, 'defaults'> {
    defaults: {
        workDayDuration: string;
        lunchBreakDuration: string;
        startTime: string;
        stopTime: string;
    };
}

const defaultConfig: RawConfig = {
    defaults: {
        workDayDuration: '07:30',
        lunchBreakDuration: '00:30',
        startTime: '08:00',
        stopTime: 'now',
    },
    askInput: {
        workDayLength: true,
        startTime: true,
        stopTime: true,
        logged: true,
        hadLunch: true,
    },
};

const getConfig = (): Config => {
    const configDir = xdgConfig || path.join(process.env.HOME ?? './', '.config');
    let configFilePath = path.join(configDir, 'wct', 'config.toml');

    let configData: RawConfig;
    if (fs.existsSync(configFilePath)) {
        configData = toml.parse(fs.readFileSync(configFilePath, 'utf8')) as unknown as RawConfig;
    } else {
        debug('Configuration file does not exist, loading defaults');
        configData = defaultConfig;
    }

    return {
        defaults: {
            workDayDuration: parseDuration(
                configData.defaults.workDayDuration ?? defaultConfig.defaults.workDayDuration,
            ),
            lunchBreakDuration: parseDuration(
                configData.defaults.lunchBreakDuration ?? defaultConfig.defaults.workDayDuration,
            ),
            startTime: parseTimestamp(configData.defaults.startTime ?? defaultConfig.defaults.startTime),
            stopTime: parseTimestamp(configData.defaults.stopTime ?? defaultConfig.defaults.stopTime),
        },
        askInput: {
            workDayLength: configData.askInput.workDayLength ?? defaultConfig.askInput.workDayLength,
            startTime: configData.askInput.startTime ?? defaultConfig.askInput.startTime,
            stopTime: configData.askInput.stopTime ?? defaultConfig.askInput.stopTime,
            logged: configData.askInput.logged ?? defaultConfig.askInput.logged,
            hadLunch: configData.askInput.hadLunch ?? defaultConfig.askInput.hadLunch,
        },
    };
};

export default getConfig;
