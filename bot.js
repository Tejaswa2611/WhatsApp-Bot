"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Whatsapp, Message } from 'venom-bot';
const venom = require('venom-bot');
const { Whatsapp, Message } = require('venom-bot');
// const { appendSpreadSheetValues, getAuthToken } = require('./googlesheet');
const googlesheet_1 = require("./googlesheet");
const spreadsheetId = '1x8tMdlwxdLKZaH_zCPjS_I1saDKMYRx_GCJTClDlUNQ';
var ConversationState;
(function (ConversationState) {
    ConversationState[ConversationState["AWAITING_NAME"] = 0] = "AWAITING_NAME";
    ConversationState[ConversationState["AWAITING_EMAIL"] = 1] = "AWAITING_EMAIL";
    ConversationState[ConversationState["AWAITING_PHONE"] = 2] = "AWAITING_PHONE";
    ConversationState[ConversationState["AWAITING_POKEMON"] = 3] = "AWAITING_POKEMON";
})(ConversationState || (ConversationState = {}));
const userStates = {};
const userResponses = {};
function handleIncomingMessage(client) {
    return __awaiter(this, void 0, void 0, function* () {
        client.onMessage((message) => __awaiter(this, void 0, void 0, function* () {
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
                    const auth = yield (0, googlesheet_1.getAuthToken)();
                    yield (0, googlesheet_1.appendSpreadSheetValues)(auth, spreadsheetId, 'Details', userResponses[message.from]);
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
        }));
    });
}
exports.default = handleIncomingMessage;
