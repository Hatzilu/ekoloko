import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:7878/socket.io';

export const socket = io(URL, {
    // host: URL,
    withCredentials: true,
    // cors: {
        
// extraHeaders: {
//     'Access-Control-Allow-Origin': 'http://localhost:7878/',
//     'Access-Control-Allow-Credentials': 'true',
//     "Access-Control-Allow-Methods": "GET,DELETE,PATCH,POST,PUT",
//     "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
// }
    // }
});


// .header("Access-Control-Allow-Credentials", "true")
//         .header("Access-Control-Allow-Origin",&endpoint_url)
//         .header("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT")
//         .header("Content-Type", "application/json")
//         .header("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
        