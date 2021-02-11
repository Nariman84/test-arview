import { Component, OnInit } from '@angular/core';
import { EventService } from './services/event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'test-arview';

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.initializeApp();
  }

  initializeApp(): void {
    this.eventService.loadEventsFromStorage();
  }
}
