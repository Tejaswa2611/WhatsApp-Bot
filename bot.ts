// import { Whatsapp, Message } from 'venom-bot';
const venom = require('venom-bot');
const { Whatsapp, Message } = require('venom-bot');
// const { appendSpreadSheetValues, getAuthToken } = require('./googlesheet');
import { appendSpreadSheetValues, getAuthToken } from './googlesheet';

interface Whatsapp {
  onMessage(callback: (message: any) => void): void;
  sendText(to: string, content: string): Promise<any>;
  // Add other methods as needed
}

const spreadsheetId = '1x8tMdlwxdLKZaH_zCPjS_I1saDKMYRx_GCJTClDlUNQ';
enum ConversationState {
  AWAITING_NAME,
  AWAITING_EMAIL,
  AWAITING_PHONE,
  AWAITING_POKEMON,
}

const userStates: Record<string, ConversationState> = {};
const userResponses: Record<string, string[]> = {};

async function handleIncomingMessage(client: Whatsapp) {
  client.onMessage(async (message) => {
    console.log(message.body);

    if (!userResponses[message.from]) {
      userResponses[message.from] = [];
    }

    switch (userStates[message.from]) {
      case ConversationState.AWAITING_NAME:
        // Store name and ask for email
        userResponses[message.from].push(message.body);
        userStates[message.from] = ConversationState.AWAITING_EMAIL;
        client.sendText(message.from, 'Thank you. Now, please tell me your email.');
        break;
      case ConversationState.AWAITING_EMAIL:
        // Store email and ask for phone number
        userResponses[message.from].push(message.body);
        userStates[message.from] = ConversationState.AWAITING_PHONE;
        client.sendText(message.from, 'Got it. And your phone number?');
        break;
      case ConversationState.AWAITING_PHONE:
        // Store phone number and ask for favorite Pokemon
        userResponses[message.from].push(message.body);
        userStates[message.from] = ConversationState.AWAITING_POKEMON;
        client.sendText(message.from, 'Thank you. Finally, who is your favorite Pokemon?');
        break;
      case ConversationState.AWAITING_POKEMON:
        // Store favorite Pokemon and end conversation
        userResponses[message.from].push(message.body);
        console.log("entering data in gsheet: ", userResponses[message.from]);
        const auth = await getAuthToken();
        await appendSpreadSheetValues(auth, spreadsheetId, 'Details', userResponses[message.from]);
        console.log("Data entered in gsheet");
        delete userStates[message.from];
        delete userResponses[message.from];
        client.sendText(message.from, 'Welcome, chosen one.!');
        break;
      default:
        if (message.body === 'Illuminati grant me entry') {
          userStates[message.from] = ConversationState.AWAITING_NAME;
          client.sendText(message.from, 'Welcome to the Illuminati. What is your name?');
        }
        break;
    }
  });
}

export default handleIncomingMessage;