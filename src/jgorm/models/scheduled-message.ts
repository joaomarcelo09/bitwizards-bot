import { Model } from "../database/model";

interface MessageScheduleParams {
    id: number;
    message: string;
    dayOfWeek: string;
    time: string;
    channelId: string;
    serverId: string
}
export class ScheduledMessage extends Model {
    static tableName = 'scheduled_messages';

    id: number;
    message: string;
    day_of_week: string;
    time: string;
    channel_id: string;
    server_id: string;

    constructor({ id, message, dayOfWeek, time, channelId, serverId }: MessageScheduleParams) {
        super();
        this.id = id;
        this.message = message;
        this.day_of_week = dayOfWeek;
        this.time = time;
        this.channel_id = channelId;
        this.server_id = serverId;
    }

}