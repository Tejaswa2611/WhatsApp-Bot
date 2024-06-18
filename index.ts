// import { create, Whatsapp } from 'venom-bot';
// import qrcodeTerminal from 'qrcode-terminal';
const { create } = require('venom-bot');
const qrcodeTerminal = require('qrcode-terminal');
// const handleIncomingMessage = require('./bot');
import handleIncomingMessage from './bot';

// interface Whatsapp {
//     onMessage(callback: (message: any) => void): void;
//     sendText(to: string, content: string): Promise<any>;
//     // Add other methods as needed
//   }
const sessionName = process.env.SESSION_NAME || "sessionname";

create(
  sessionName,
  (base64Qr: any, asciiQR: any) => {
    qrcodeTerminal.generate(asciiQR, { small: true });
  },
  (statusSession: any, session: any) => {
    console.log('Status Session: ', statusSession);
    console.log('Session name: ', session);
  },
  {
    headless: false,
    devtools: false,
    // useChrome: false,
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
  }
)
  .then((client:any) => handleIncomingMessage(client))
  .catch((error: any) => console.log(error));