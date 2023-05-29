import {
    getRemoteConfig,
    getString,
} from "firebase/remote-config";
import { getApp } from 'firebase/app';

export const getRemoteConfigValue = (name: string) => {
    const remoteConfig = getRemoteConfig(getApp());

    return JSON.parse(getString(remoteConfig, name) || '{}');
}