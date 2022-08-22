import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {VideoMetadata} from "../../../model/VideoMetadata";
import {ActivatedRoute, Params} from "@angular/router";
import {UiService} from "../../../services/ui.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css']
})
export class WatchComponent implements OnInit, OnDestroy {

  video: VideoMetadata;

  private subscription: Subscription;
  private subscription2: Subscription;
  private updateVideoSubscription: Subscription;

  constructor(private dataService: DataService, private uiService: UiService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    let id: number = this.route.snapshot.params['id'];
    this.subscription = this.dataService.findVideoById(id).subscribe(videoMetadata => {
      let updatedVideo = videoMetadata[0];
      const currentView: number = updatedVideo.views;
      updatedVideo.views = currentView + 1;
      this.updateVideoSubscription = this.dataService.updateVideo(updatedVideo).subscribe(videoMetadata => {
        this.video = videoMetadata;
      });
    });

    // subscribing params observable is needed because user might click on related videos which is in
    // the same component and for that, unless we get subscribe to params observable for the current route,
    // video will never get updated because component will not reload which is default behaviour of angular
    this.route.params.subscribe((params: Params) => {
      id = params['id'];
      this.subscription2 = this.dataService.findVideoById(id).subscribe(videoMetadata => {
        this.video = videoMetadata[0];
      });
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
    this.updateVideoSubscription.unsubscribe();
  }

}
