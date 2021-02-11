import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EventType } from 'src/app/entities/event-type.enum';
import { EventEntity } from 'src/app/entities/event.entity';
import { EventService } from 'src/app/services/event.service';


@Component({
  selector: 'app-item-event',
  templateUrl: './item-event.component.html',
  styleUrls: ['./item-event.component.scss']
})
export class ItemEventComponent implements OnInit {

  constructor(
    private router: Router,
    private eventService: EventService
  ) { }

  static readonly EventType = EventType;
  readonly self = ItemEventComponent;

  @Input() event: EventEntity;
  @Output() updateEventList = new EventEmitter();

  ngOnInit(): void { }

  editEvent(): void {
    this.openEditPage();
  }

  deleteEvent(): void {
    this.eventService.deleteEvent(this.event.id);
    this.updateEventList.emit(this.event.date);
  }

  openEditPage(): void {
    this.router.navigate(['event-form'], { queryParams: { eventId: this.event.id }});
  }
}
