import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:7878/socket';

export const socket = io(URL);