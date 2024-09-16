import { Client } from "discord.js";
import { ScheduledMessage } from "../models/scheduled-message";
import { SendScheduleMessages } from "../../types/schedule-messages/send-schedule-messages";

export class SchedulerService {
    static async scheduleMessage(messageData: object) {
        try {
            await ScheduledMessage.create(messageData);
            return
        } catch (error) {
            console.log('Create message failed', error)
        }
    }

    static async sendScheduleMessages(client: Client) {
        try {
            const where = {
                day_of_week: 'Monday'
            }
            const data = await ScheduledMessage.findAll(where)
            data.map(async (x: SendScheduleMessages) => {
                const guild: any = await client.guilds.fetch(x.server_id);
                if (guild) {
                    const channel = await guild.channels.fetch(x.channel_id);
                    if (channel && channel.isTextBased()) {
                        return channel.send('Testando')
                    }
                }
                return
            })
            return
        } catch (e) {
            console.log(e)
            return e
        }
    }
}