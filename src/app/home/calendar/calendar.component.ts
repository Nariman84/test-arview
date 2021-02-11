import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { EventEntity } from 'src/app/entities/event.entity';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  model: NgbDateStruct;
  date: string;
  events: EventEntity[];

  constructor(
    private router: Router,
    private eventService: EventService
  ) { }

  ngOnInit(): void { }

  setEventsOnThisDate(date: NgbDate): void {
    this.date = new Date(date.year, date.month - 1, date.day).toLocaleDateString();
    this.events = this.eventService.getEventsByDate(this.date);
    this.eventService.passEvents(this.events);
  }

  openEventFormPage(): void {
    this.router.navigate(['event-form'], { queryParams: { eventDate: this.date }});
  }

  public hasEvents(date: NgbDateStruct): boolean {
    return this.dateHasEvents(date);
  }

  private dateHasEvents(date: NgbDateStruct): boolean {

    for (let i = 0; i < this.eventService.events.length; i++) {
      const event = this.eventService.events[i];
      const eventDate = event.date;
      const ngbDate = `${this.padTwoDigits(date.day)}.${this.padTwoDigits(date.month)}.${this.padTwoDigits(date.year)}`;

      if (eventDate === ngbDate) {
        return true;
      }
    }
  }

  private padTwoDigits(value: number): string {
    return `${value}`.padStart(2, "0");
  }
}
