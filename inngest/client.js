import {Inngest} from "inngest";
export const inngest = new Inngest({
    id: 'Ticketting-system',
    eventKey: process.env.INNGEST_EVENT_KEY
});