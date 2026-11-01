import { fileURLToPath } from 'node:url';
import { createStaticServer } from './serve.mjs';

const root = fileURLToPath(new URL('../examples/', import.meta.url));
const port = Number(process.env.PORT ?? 4181);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new RangeError('PORT must be an integer from 1 to 65535');
const server = createStaticServer({ root });
server.once('error', error => { console.error('Unable to start examples:', error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log('UI examples: http://127.0.0.1:' + port + '/'));
