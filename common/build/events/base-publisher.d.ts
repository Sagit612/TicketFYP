import { Stan } from 'node-nats-streaming';
import { Event } from './interfaces/IEvent';
declare abstract class Publisher<T extends Event> {
    abstract subject: T['subject'];
    protected client: Stan;
    constructor(client: Stan);
    publish(data: T['data']): Promise<void>;
}
export { Publisher };
