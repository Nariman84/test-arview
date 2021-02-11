import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EventEntity } from '../entities/event.entity';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor() { }

  events: EventEntity[] = [];

  eventPassEvents: Subject<any> = new Subject<any>();
  passDataFromCalendar$ = this.eventPassEvents.asObservable();
  updateEventList: Subject<any> = new Subject<any>();
  updateEventList$ = this.updateEventList.asObservable();

  loadEventsFromStorage(): void {
    const events = JSON.parse(localStorage.getItem('events'));
    if (events) {
      this.events = events;
    }
  }

  getEventsByDate(eventDate: string): EventEntity[] {
    return this.events.filter(event => event.date === eventDate);
  }

  getEventById(eventId: string): EventEntity {
    return this.events.find(event => event.id === eventId);
  }

  editEvent(calendarEvent: EventEntity): void {
    const eventIndex = this.events.findIndex(event => event.id === calendarEvent.id);
    this.events.splice(eventIndex, 1, calendarEvent);
    this.updateStorage();
    this.updateEventList.next(calendarEvent);
  }

  addEvent(newEvent: EventEntity): void {
    this.events.push(newEvent);
    this.updateStorage();
  }

  deleteEvent(calendarEventId: string): void {
    const eventIndex = this.events.findIndex(event => event.id === calendarEventId);
    this.events.splice(eventIndex, 1);
    this.updateStorage();
  }

  updateStorage(): void {
    localStorage.setItem('events', JSON.stringify(this.events));
  }

  passEvents(events: EventEntity[]): void {
    this.eventPassEvents.next(events);
  }
}
