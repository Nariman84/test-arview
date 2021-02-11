import { EventType } from './event-type.enum';


export class EventEntity {
    id: string;
    date: string;
    title: string;
    type: EventType;
    budget: string;
    address: string;
    time: string;
    note: string;
}
