import { Component, Input, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as data from '../../assets/HolidayList.json';
import { Item } from '../model/item';

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header"></div>
    <div class="modal-body" [innerHTML]="message"></div>
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

  constructor(public activeModal: NgbActiveModal) {}
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
    if (eventsMessage != '') {
      //https://ng-bootstrap.github.io/#/components/modal/examples
      const modalRef = this.modalService.open(NgbdModalContent);
      modalRef.componentInstance.message = eventsMessage;
    }
    //this.openAppointmentList(date)
  }
}
