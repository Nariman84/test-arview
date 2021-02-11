import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventEntity } from 'src/app/entities/event.entity';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnDestroy {

  constructor(
    private eventService: EventService
  ) { }

  events: EventEntity[];
  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions.push(
      this.eventService.passDataFromCalendar$.subscribe(events => this.events = events)
    );

    this.subscriptions.push(
      this.eventService.updateEventList$.subscribe(event => this.getEvents(event.date))
    );
  }

  getEvents(eventDate: string): void {
    this.eventService.loadEventsFromStorage();
    this.events = this.eventService.getEventsByDate(eventDate);
  }

  updateEventList(eventDate: string): void {
    this.getEvents(eventDate);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe);
    this.subscriptions.length = 0;
  }
}
