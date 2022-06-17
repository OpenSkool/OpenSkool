import { Blob } from 'node:buffer';

import { config } from 'dotenv-flow';

config({ silent: true });

global.Blob = Blob as unknown as typeof global.Blob;
