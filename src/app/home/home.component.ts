import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as data from '../../assets/HolidayList.json';
import { Item } from '../model/item';

//https://getbootstrap.com/docs/4.3/components/modal/
//https://angular-calendar.com/#/kitchen-sink
@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4>Holiday</h4>
    </div>
    <div class="modal-body">
      <div class="col-md-12" style="border: thin solid #000000;padding: 10px;" 
      [innerHTML]="message"></div>
      <br>
      <div class="col-md-12" style="border: thin solid #000000;padding: 10px;">
        <h5>Add new holiday</h5>
        <div class="col-md-12">
          <label for="Holiday-Name" class="col-form-label">Holiday Name</label>
        </div>
        <div class="col-md-12" style="padding-bottom: 10px;">
          <input type="text" class="form-control" #holidayName />
        </div>
        <div class="col-md-12" style="">
        <button
          type="button"
          class="btn btn-outline-dark"
          (click)="addHoliday(holidayName.value)"
        >
          Add Holiday
        </button>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-outline-dark"
        (click)="activeModal.close('Close click')"
      >
        Close
      </button>
    </div>
  `,
})
export class NgbdModalContent {
  @Input() message: string = '';
  @Output() holidayMsg = new EventEmitter();
  constructor(public activeModal: NgbActiveModal) {}
  addHoliday(holidayName: string) {
    this.holidayMsg.emit(holidayName);
  }
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  //https://javascript.plainenglish.io/create-calendar-using-angular-and-bootstrap-monthly-weekly-and-daily-calendar-c441f1cb8b18

  dataJson: any = data;
  public dates: Item[] = [];
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  events: any;
  items: Array<CalendarEvent> = [];

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    var obj = <Array<Item>>this.dataJson.default;
    obj.forEach((element) => {
      this.dates.push(element);
    });
    if (localStorage.getItem('datesList') == null) {
      localStorage.setItem('datesList', JSON.stringify(this.dates));
    }
    this.setEvents();
  }

  setEvents() {
    for (let i = 0; i < this.dates.length; i++) {
      this.items.push({
        title: this.dates[i].name,
        start: new Date(this.dates[i].date),
        color: { primary: '#e3bc08', secondary: '#FDF1BA' },
      });
    }
    this.events = this.items;
  }
  //https://angular-calendar.com/#/clickable-events
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    var eventsMessage = '';
    events.forEach((element) => {
      eventsMessage += '<p>';
      eventsMessage = eventsMessage + element.title;
      eventsMessage += '</p>';
    });
    if (eventsMessage == '') {
      eventsMessage = 'No holidays today.';
    }
    //https://ng-bootstrap.github.io/#/components/modal/examples
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.message = eventsMessage;
    //https://stackoverflow.com/questions/42681556/event-emitter-from-bootstrap-modal-to-parent
    modalRef.componentInstance.holidayMsg.subscribe((value: any) => {
      var obj = {
        date: date,
        name: value,
      };
      this.dates.push(obj);
      localStorage.setItem('datesList', JSON.stringify(this.dates));
      this.events = [
        ...this.events,
        {
          title: obj.name,
          start: obj.date,
          color: { primary: '#e3bc08', secondary: '#FDF1BA' },
        },
      ];
      modalRef.close();
    });
    //this.openAppointmentList(date)
  }
}
