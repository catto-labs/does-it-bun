import { edenTreaty } from '@elysiajs/eden'
import type { ServerApp } from '../../../server/src/index';

export const api = edenTreaty<ServerApp>('http://localhost:8000');
