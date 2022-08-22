import {Component, Input, OnInit} from '@angular/core';
import {VideoMetadata} from "../../../../model/VideoMetadata";
import {DataService} from "../../../../services/data.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Subscriber} from "../../../../model/Subscriber";
import {AuthService} from "../../../../services/auth.service";

@UntilDestroy()
@Component({
  selector: 'app-video-info',
  templateUrl: './video-info.component.html',
  styleUrls: ['./video-info.component.css']
})
export class VideoInfoComponent implements OnInit {

  @Input() videoInfo: VideoMetadata;

  loggedInUsername: string = '';

  isSubscribed: boolean = false;

  subscribersCount: number;

  constructor(private dataService: DataService, private authService: AuthService) { }

  ngOnInit(): void {

    let sessionUser: string = this.authService.getSessionUser();
    if (sessionUser) {
      this.dataService.emitLoggedInUserData(sessionUser);
    }
    this.loggedInUsername = sessionUser;
    //this.dataService.emitIsSubscribedTo(this.videoInfo?.uploadedBy, this.loggedInUsername);
    this.dataService.checkSubscription(this.videoInfo?.uploadedBy, this.loggedInUsername).pipe(untilDestroyed(this)).subscribe(subscribers => {
      this.isSubscribed = subscribers.length > 0;
    });
    this.dataService.checkSubscribersCount(this.videoInfo?.uploadedBy).pipe(untilDestroyed(this)).subscribe(subscribers => {
      this.subscribersCount = subscribers.length;
    });

    // Listen to subscribers count and isSubscribed changes
    this.dataService.onSubscribers().pipe(untilDestroyed(this)).subscribe(subCount => {
      this.subscribersCount = subCount;
    });
    this.dataService.onIsSubscribed().pipe(untilDestroyed(this)).subscribe(subscribed => {
      this.isSubscribed = subscribed;
    });
  }

  editVideo() {

  }

  subscribe() {
    this.dataService.checkSubscription(this.videoInfo?.uploadedBy, this.loggedInUsername).pipe(untilDestroyed(this)).subscribe(subscribers => {
      if (subscribers.length > 0) {
        this.dataService.unsubscribe(subscribers[0]?.id).pipe(untilDestroyed(this)).subscribe(response => {
          // update UI
          this.dataService.emitIsSubscribedTo(this.videoInfo?.uploadedBy, this.loggedInUsername);
          this.dataService.emitSubscribers(this.videoInfo?.uploadedBy);
        });
      } else {
        const subscriber: Subscriber = new Subscriber({subscribeTo: this.videoInfo?.uploadedBy, subscribeFrom: this.loggedInUsername});
        this.dataService.subscribe(subscriber).pipe(untilDestroyed(this)).subscribe(sub => {
          // update UI
          this.dataService.emitIsSubscribedTo(this.videoInfo?.uploadedBy, this.loggedInUsername);
          this.dataService.emitSubscribers(this.videoInfo?.uploadedBy);
        });
      }
    });
  }
}
