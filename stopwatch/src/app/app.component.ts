import { Component, OnInit, ElementRef } from '@angular/core';
import {fromEvent, Observable, Subscriber} from 'rxjs';
import { map } from 'rxjs/operators';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public value = '00:00:00';
  public ms = 0;
  public myInterval: NodeJS.Timeout;
  public timeStamp = 0;
  public obsTime: Observable<string>;
  public obsClick: any;
  public timerActive = false;

  constructor() { }

  ngOnInit() {
    this.obsTime = new Observable(subscriber => {
      this.myInterval = setInterval(() => {
        this.ms = this.ms + 1000;
        let s = Math.floor((this.ms / 1000) % 60);
        let m = Math.floor((this.ms / 1000 / 60) % 60);
        let h = Math.floor((this.ms  / 1000 / 3600 ) % 99);
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
    this.ms = 0;
    this.value = '00:00:00';
  }

  wait(timeStamp: number) {
    if (timeStamp - this.timeStamp > 300) {
      this.timeStamp = timeStamp;
      return;
    }
    else {
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
