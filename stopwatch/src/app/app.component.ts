import { Component, OnInit } from '@angular/core';
import {fromEvent, Observable, Subscriber} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public value = '00:00:00';
  public date = new Date();
  public myInterval: any;
  public timeStatus = false;
  public obs: Observable<string>;
  public timerActive = false;

  constructor() { }

  ngOnInit() {
    this.date.setHours(0, 0, 0, 0);
    this.obs = new Observable(subscriber => {
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
      this.obs.subscribe(value => {
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

  wait() {
    this.timerActive = false;
    clearInterval(this.myInterval);
  }

  reset() {
    this.stop();
    this.start();
  }

}
