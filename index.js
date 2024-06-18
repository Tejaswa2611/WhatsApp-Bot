"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { create, Whatsapp } from 'venom-bot';
// import qrcodeTerminal from 'qrcode-terminal';
const { create } = require('venom-bot');
const qrcodeTerminal = require('qrcode-terminal');
// const handleIncomingMessage = require('./bot');
const bot_1 = __importDefault(require("./bot"));
// interface Whatsapp {
//     onMessage(callback: (message: any) => void): void;
//     sendText(to: string, content: string): Promise<any>;
//     // Add other methods as needed
//   }
const sessionName = process.env.SESSION_NAME || "sessionname";
create(sessionName, (base64Qr, asciiQR) => {
    qrcodeTerminal.generate(asciiQR, { small: true });
}, (statusSession, session) => {
    console.log('Status Session: ', statusSession);
    console.log('Session name: ', session);
}, {
    headless: false,
    devtools: false,
    // useChrome: false,
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
})
    .then((client) => (0, bot_1.default)(client))
    .catch((error) => console.log(error));
