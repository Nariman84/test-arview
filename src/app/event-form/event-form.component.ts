import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventEntity } from '../entities/event.entity';
import { EventService } from '../services/event.service';


@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eventService: EventService
  ) { }

  subscriptions: Subscription[] = [];

  eventTypes = [
    { name: 'Праздничные дни', type: 'holiday' },
    { name: 'Мероприятия', type: 'event' },
    { name: 'Пометки/другое', type: 'note' }
  ];

  activeFormOptions = {
    budget: true,
    address: false,
    time: false,
    note: false
  };

  isHoliday = true;
  isEvent = false;
  isNote = false;

  eventDate: string;
  eventId: string;
  selectedEvent = null;
  isValidForm = false;

  @Output() updateEventList = new EventEmitter();

  eventFormGroup: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    address: new FormControl(),
    time: new FormControl(),
    note: new FormControl(),
    budget: new FormControl()
  });

  ngOnInit(): void {
    this.subscriptions.push(this.activatedRoute.queryParams.subscribe(params => {
      this.eventDate = params.eventDate ? params.eventDate : new Date().toLocaleDateString();

      if (params.eventId) {
        this.selectedEvent = this.eventService.getEventById(params.eventId);
        this.changeActiveFields(this.selectedEvent.type);
        this.setValuesInForm();
      }
    }));

    this.subscriptions.push(this.eventFormGroup.controls.type.valueChanges.subscribe(value => {
      this.changeActiveFields(value);
    }));

    this.subscriptions.push(this.eventFormGroup.statusChanges.subscribe(status => {
      this.isValidForm = status === 'VALID' ? true : false;
    }));
  }

  // установка в форму значений редактируемого события
  private setValuesInForm(): void {
    this.eventFormGroup.patchValue({
      title: this.selectedEvent.title,
      type: this.selectedEvent.type,
      address: this.selectedEvent.address,
      time: this.selectedEvent.time,
      note: this.selectedEvent.note,
      budget: this.selectedEvent.budget
    });
  }

  // установка дополнительных полей для выбранного типа события
  private changeActiveFields(value: string): void {
    switch(value) {
      case 'holiday':
        this.activeFormOptions = {
          budget: true,
          address: false,
          time: false,
          note: false
        };

        this.isHoliday = true;
        this.isEvent = false;
        this.isNote = false;
        break;
      case 'event':
        this.activeFormOptions = {
          budget: false,
          address: true,
          time: true,
          note: false
        };

        this.isHoliday = false;
        this.isEvent = true;
        this.isNote = false;

        break;
      case 'note':
        this.activeFormOptions = {
          budget: false,
          address: false,
          time: false,
          note: true
        };

        this.isHoliday = false;
        this.isEvent = false;
        this.isNote = true;

        break;
    }

    this.setValidators();
  }

  private setValidators(): void {
    for (let key in this.activeFormOptions) {
      if (this.activeFormOptions[key]) {
        this.eventFormGroup.controls[key].setValidators([Validators.required]);
      } else {
        this.eventFormGroup.controls[key].clearValidators();
        this.eventFormGroup.controls[key].reset();
      }

      this.eventFormGroup.controls[key].updateValueAndValidity();
    }
  }

  public cancel(): void {
    this.router.navigate(['']);
  }

  public saveEvent(): void {
    if (this.selectedEvent) {
      const selectedEvent = Object.assign(this.selectedEvent, this.eventFormGroup.value);
      this.eventService.editEvent(selectedEvent);
      this.selectedEvent = null;

    } else {
      const newEvent: EventEntity = this.eventFormGroup.value;
      newEvent.id = this.makeEventId();
      newEvent.date = this.eventDate;
      this.eventService.addEvent(newEvent);
    }

    this.router.navigate(['']);
  }

  private makeEventId(): string {
    return `${Date.now()}:${Math.random().toString().substr(2)}`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe);
    this.subscriptions.length = 0;
  }
}