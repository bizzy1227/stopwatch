import { Component, OnInit, ElementRef } from '@angular/core';
import {fromEvent, Observable, Subscriber} from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public value = '00:00:00';
  public date = new Date();
  public myInterval: any;
  public timeStamp = 0;
  public obsTime: Observable<string>;
  public obsClick: any;
  public timerActive = false;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.date.setHours(0, 0, 0, 0);
    this.obsTime = new Observable(subscriber => {
      this.myInterval = setInterval(() => {
        this.date.setSeconds(this.date.getSeconds() + 1);
        let h = this.date.getHours();
        let m = this.date.getMinutes();
        let s = this.date.getSeconds();
        h = this.checkTime(h);
        m = this.checkTime(m);
        s = this.checkTime(s);
        const time = h + ':' + m + ':' + s;
        subscriber.next(time);
      }, 1000);
    });
    this.obsClick = fromEvent(document, 'click');
    this.obsClick
      .subscribe(event => {
        switch (event.toElement.className) {
          case 'start':
            this.start();
            break;
          case 'stop':
            this.stop();
            break;
          case 'wait':
            this.wait(event.timeStamp);
            break;
          case 'reset':
            this.reset();
            break;
          default:
            break;
        }
    });
  }

  checkTime(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

  start() {
    if (!this.timerActive) {
      this.timerActive = true;
      this.obsTime.subscribe(value => {
        this.value = value;
      });
    }
  }

  stop() {
    this.timerActive = false;
    clearInterval(this.myInterval);
    this.date.setHours(0, 0, 0, 0);
    this.value = '00:00:00';
  }

  wait(timeStamp: number) {
    if (timeStamp - this.timeStamp > 300) {
      console.log(timeStamp - this.timeStamp);
      this.timeStamp = timeStamp;
      return;
    }
    else {
      console.log(timeStamp - this.timeStamp);
      this.timeStamp = timeStamp;
      this.timerActive = false;
      clearInterval(this.myInterval);
    }

  }

  reset() {
    this.stop();
    this.start();
  }

}
