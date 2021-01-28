/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Constants from 'expo-constants';
import { Config } from '../types';

import dev from './envs/dev.json';
import prod from './envs/prod.json';

const { manifest } = Constants;

const config = typeof manifest.packagerOpts === 'object' && manifest.packagerOpts.dev
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  ? { api: { url: `http://${manifest.debuggerHost!.split(':').shift()!.concat(dev.api.url)}` } }
  : prod;

export default config as Config;
