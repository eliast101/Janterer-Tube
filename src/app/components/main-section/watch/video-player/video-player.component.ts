import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {VideoMetadata} from "../../../../model/VideoMetadata";
import {UiService} from "../../../../services/ui.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {

  @Input() isAutoplay: boolean = true;

  @Input() videoMetadata: VideoMetadata;

  constructor() { }

  ngOnInit(): void {
  }

}
