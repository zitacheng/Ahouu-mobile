import { Config } from '../types';

import dev from './envs/dev.json';
import prod from './envs/prod.json';

const config = process.env.REACT_APP_ENVIRONMENT === 'development' ? dev : prod;

export default config as Config;
