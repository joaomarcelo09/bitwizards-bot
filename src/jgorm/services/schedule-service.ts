import { ScheduledMessage } from "../models/scheduled-message";

export class SchedulerService {
    static async scheduleMessage(messageData: object) {
        try {
            const scheduleMessage = await ScheduledMessage.create(messageData);
            return scheduleMessage;

        } catch (error) {
            console.log('Create message failed', error)
        }
    }
}