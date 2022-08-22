import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {VideoMetadata} from "../../../../../model/VideoMetadata";
import {ButtonInput} from "../../../../../model/ButtonInput";
import {DataService} from "../../../../../services/data.service";
import {LikeDislike} from "../../../../../model/LikeDislike";
import {UserData} from "../../../../../model/UserData";
import {UiService} from "../../../../../services/ui.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AppUtil} from "../../../../../shared/AppUtil";
import {AppConstant} from "../../../../../constants/AppConstant";
import {Comment} from "../../../../../model/Comment";

@UntilDestroy()
@Component({
  selector: 'app-video-info-controls',
  templateUrl: './video-info-controls.component.html',
  styleUrls: ['./video-info-controls.component.css', '../../../../../shared/video-comment-shared-controls.css']
})
export class VideoInfoControlsComponent implements OnInit {

  private readonly thumbUpImg: string = 'assets/images/icons/thumb-up.png';
  private readonly thumbUpActiveImg: string = 'assets/images/icons/thumb-up-active.png';
  private readonly thumbDownImg: string = 'assets/images/icons/thumb-down.png';
  private readonly thumbDownActiveImg: string = 'assets/images/icons/thumb-down-active.png';

  @Input() videoInfoForCtrl: VideoMetadata;

  @Input() commentInput: Comment;

  @Input() controlType: string;

  @Input() stylesInput: string[] = [];

  @Input() additionalStyles: string[] = [];

  likeButton: ButtonInput = new ButtonInput({});
  dislikeButton: ButtonInput = new ButtonInput({});

  private videoLikesCount: number = 0;
  private videoDislikesCount: number = 0;

  private commentLikesCount: number = 0;
  private commentDislikesCount: number = 0;

  private loggedInUser: UserData;

  constructor(private dataService: DataService, private uiService: UiService) { }

  ngOnInit(): void {
    // =================================================== Initial Video like and dislikes ====================================================
    if (this.controlType === AppConstant.VIDEO_CONTROL) {
      this.dataService.getVideoLikes(this.videoInfoForCtrl.id).pipe(untilDestroyed(this)).subscribe(likeList => {
        this.videoLikesCount = likeList.length;

        this.likeButton = new ButtonInput(
          {
            text: this.videoLikesCount.toString(),
            imageSrc: this.thumbUpImg,
            action: {parentComponent: VideoInfoControlsComponent.name, action: 'likeVideo'},
            clazz: {'likeButton': true, 'active': false}
          }
        );
        // If user is already logged in and if user already liked video, make the like button activated
        if (this.loggedInUser?.username) {
          this.dataService.findVideoLikeByVideoIdAndUsername(this.videoInfoForCtrl.id, this.loggedInUser.username).pipe(untilDestroyed(this)).subscribe(likeList => {
            if (likeList.length > 0) {
              this.likeButton.clazz.active = true;
              this.likeButton.imageSrc = this.thumbUpActiveImg;
            }
          });
        }
      });

      this.dataService.getVideoDislikes(this.videoInfoForCtrl.id).pipe(untilDestroyed(this)).subscribe(likeList => {
        this.videoDislikesCount = likeList.length;

        this.dislikeButton = new ButtonInput(
          {
            text: this.videoDislikesCount.toString(),
            imageSrc: this.thumbDownImg,
            action: {parentComponent: VideoInfoControlsComponent.name, action: 'dislikeVideo'},
            clazz: {'dislikeButton': true, 'active': false}
          }
        );

        // If user is already logged in and if user already disliked video, make the dislike button activated
        if (this.loggedInUser?.username) {
          this.dataService.findVideoDislikeByVideoIdAndUsername(this.videoInfoForCtrl.id, this.loggedInUser.username).pipe(untilDestroyed(this)).subscribe(dislikeList => {
            if (dislikeList.length > 0) {
              this.dislikeButton.clazz.active = true;
              this.dislikeButton.imageSrc = this.thumbDownActiveImg;
            }
          });
        }
      });
      // ========================================================================================================================================

      // ============================== Reacting to video likes and dislikes ============================
      this.uiService.onVideoLikes().pipe(untilDestroyed(this)).subscribe(likesCount => {
        this.videoLikesCount = likesCount;
        this.likeButton.text = likesCount.toString();
      });

      this.uiService.onVideoDislikes().pipe(untilDestroyed(this)).subscribe(dislikesCount => {
        this.videoDislikesCount = dislikesCount;
        this.dislikeButton.text = dislikesCount.toString();
      });

      // =================================================== Initial Comments like and dislikes ====================================================

    } else if (this.controlType === AppConstant.COMMENT_CONTROL && this.commentInput) {
      this.dataService.getCommentLikes(this.videoInfoForCtrl.id, this.commentInput.id).pipe(untilDestroyed(this)).subscribe(likeList => {
        this.commentLikesCount = likeList.length;

        this.likeButton = new ButtonInput(
          {
            text: this.commentLikesCount.toString(),
            imageSrc: this.thumbUpImg,
            action: {parentComponent: VideoInfoControlsComponent.name, action: 'likeComment'},
            clazz: {'likeButton': true, 'active': false}
          }
        );
        // If user is already logged in and if user already liked video, make the like button activated
        if (this.loggedInUser?.username) {
          this.dataService.findCommentLikeByCommentIdAndUsername(
            this.videoInfoForCtrl.id,
            this.commentInput.id,
            this.loggedInUser.username
          ).pipe(untilDestroyed(this)).subscribe(likeList => {
            if (likeList.length > 0) {
              this.likeButton.clazz.active = true;
              this.likeButton.imageSrc = this.thumbUpActiveImg;
            }
          });
        }
      });

      this.dataService.getCommentDislikes(this.videoInfoForCtrl.id, this.commentInput.id).pipe(untilDestroyed(this)).subscribe(likeList => {
        this.commentDislikesCount = likeList.length;

        this.dislikeButton = new ButtonInput(
          {
            text: this.commentDislikesCount.toString(),
            imageSrc: this.thumbDownImg,
            action: {parentComponent: VideoInfoControlsComponent.name, action: 'dislikeComment'},
            clazz: {'dislikeButton': true, 'active': false}
          }
        );

        // If user is already logged in and if user already disliked video, make the dislike button activated
        if (this.loggedInUser?.username) {
          this.dataService.findCommentDislikeByCommentIdAndUsername(this.videoInfoForCtrl.id, this.commentInput.id, this.loggedInUser.username).pipe(untilDestroyed(this)).subscribe(dislikeList => {
            if (dislikeList.length > 0) {
              this.dislikeButton.clazz.active = true;
              this.dislikeButton.imageSrc = this.thumbDownActiveImg;
            }
          });
        }
      });

      // ============================== Reacting to comment likes and dislikes ============================

      this.uiService.onLikedComment().pipe(untilDestroyed(this)).subscribe(likedComment => {
        if (likedComment?.id === this.commentInput.id) {
          this.likeButton.clazz.active = true;
          this.dislikeButton.clazz.active = false;
          this.likeButton.imageSrc = this.thumbUpActiveImg;
          this.dislikeButton.imageSrc = this.thumbDownImg;
        }
      });

      this.uiService.onDislikedComment().pipe(untilDestroyed(this)).subscribe(dislikedComment => {
        if (dislikedComment?.id === this.commentInput.id) {
          this.dislikeButton.clazz.active = true;
          this.likeButton.clazz.active = false;
          this.dislikeButton.imageSrc = this.thumbDownActiveImg;
          this.likeButton.imageSrc = this.thumbUpImg;
        }
      });

      this.uiService.onDeleteCommentLike().pipe(untilDestroyed(this)).subscribe(comment => {
        if (comment?.id === this.commentInput.id) {
          this.likeButton.clazz.active = false;
          this.likeButton.imageSrc = this.thumbUpImg;
        }
      });

      this.uiService.onDeleteCommentDislike().pipe(untilDestroyed(this)).subscribe(comment => {
        if (comment?.id === this.commentInput.id) {
          this.dislikeButton.clazz.active = false;
          this.dislikeButton.imageSrc = this.thumbDownImg;
        }
      });


      this.uiService.onCommentLikesCount().pipe(untilDestroyed(this)).subscribe(likesCountToCommentMap => {
        const [likesCount, comment] = likesCountToCommentMap;
        if (comment?.id === this.commentInput.id) {
          this.commentLikesCount = likesCount;
          this.likeButton.text = likesCount.toString();
        }
      });

      this.uiService.onCommentDislikesCount().pipe(untilDestroyed(this)).subscribe(dislikesCountToCommentMap => {
        const [dislikesCount, comment] = dislikesCountToCommentMap;
        if (comment?.id === this.commentInput.id) {
          this.commentDislikesCount = dislikesCount;
          this.dislikeButton.text = dislikesCount.toString();
        }
      });
    }
    // ==========================================================================================================================================

    this.dataService.onLoggedInUserEvent().pipe(untilDestroyed(this)).subscribe(userData => this.loggedInUser = userData);
  }

  handleLikeButtonClick(event: {}) {
    if (AppUtil.isValidButtonEventObject(event)) {
      if (this.loggedInUser.username) {
        if (VideoInfoControlsComponent.isVideoLikeAction(event)) {
          this.dataService.findVideoLikeByVideoIdAndUsername(this.videoInfoForCtrl.id, this.loggedInUser.username).pipe(untilDestroyed(this)).subscribe(currentLikeList => {
            if (currentLikeList.length == 0) {
              this.dataService.findVideoDislikeByVideoIdAndUsername(this.videoInfoForCtrl.id, this.loggedInUser.username).pipe(untilDestroyed(this)).subscribe(dislikeList => {
                if (dislikeList.length !== 0) {
                  this.dataService.deleteVideoDislikeById(dislikeList[0].id).pipe(untilDestroyed(this)).subscribe(response => {
                    this.likeVideo();
                  });
                } else {
                  this.likeVideo();
                }
              });
            } else {
              this.dataService.findVideoLikeByVideoIdAndUsername(this.videoInfoForCtrl.id, this.loggedInUser.username).pipe(untilDestroyed(this)).subscribe(deleteLikeList => {
                const likeId: number = deleteLikeList[0]?.id;
                this.dataService.deleteVideoLikeById(likeId).pipe(untilDestroyed(this)).subscribe(response => {
                  this.updateVideoPreferenceButtonCounts();
                  this.likeButton.clazz.active = false;
                  this.likeButton.imageSrc = this.thumbUpImg;
                });
              });
            }
          });
        } else if (VideoInfoControlsComponent.isCommentLikeAction(event)) {
          this.dataService.findCommentLikeByCommentIdAndUsername(this.videoInfoForCtrl.id, this.commentInput.id, this.loggedInUser.username).pipe(untilDestroyed(this)).subscribe(currentLikeList => {
            if (currentLikeList.length == 0) {
              this.dataService.findCommentDislikeByCommentIdAndUsername(this.videoInfoForCtrl.id, this.commentInput.id, this.loggedInUser.username).pipe(untilDestroyed(this)).subscribe(dislikeList => {
                if (dislikeList.length !== 0) {
                  this.dataService.deleteCommentDislikeById(dislikeList[0].id).pipe(untilDestroyed(this)).subscribe(response => {
                    this.likeComment();
                  });
                } else {
                  this.likeComment();
                }
              });
            } else {
              this.dataService.findCommentLikeByCommentIdAndUsername(this.videoInfoForCtrl.id, this.commentInput.id, this.loggedInUser.username).pipe(untilDestroyed(this)).subscribe(deleteLikeList => {
                const likeId: number = deleteLikeList[0]?.id;
                this.dataService.deleteCommentLikeById(likeId).pipe(untilDestroyed(this)).subscribe(response => {
                  this.uiService.emitDeleteCommentLike(this.commentInput);
                  this.updateCommentPreferenceButtonCounts();
                  /*this.likeButton.clazz.active = false;
                  this.likeButton.imageSrc = this.thumbUpImg;*/
                });
              });
            }
          });
        }
      } else {
        alert('You are not logged in. Please login first to perform actions.');
      }
    }
  }

  handleDislikeButtonClick(event: {}) {
    if (AppUtil.isValidButtonEventObject(event)) {
      if (this.loggedInUser.username) {
        if (VideoInfoControlsComponent.isVideoDislikeAction(event)) {
          this.dataService.findVideoDislikeByVideoIdAndUsername(this.videoInfoForCtrl.id, this.loggedInUser.username).pipe(untilDestroyed(this)).subscribe(currentDislikeList => {
            if (currentDislikeList.length == 0) {
              this.dataService.findVideoLikeByVideoIdAndUsername(this.videoInfoForCtrl.id, this.loggedInUser.username).pipe(untilDestroyed(this)).subscribe(likeList => {
                if (likeList.length !== 0) {
                  this.dataService.deleteVideoLikeById(likeList[0].id).pipe(untilDestroyed(this)).subscribe(response => {
                    this.dislikeVideo();
                  });
                } else {
                  this.dislikeVideo();
                }
              });
            } else {
              this.dataService.findVideoDislikeByVideoIdAndUsername(this.videoInfoForCtrl.id, this.loggedInUser.username).pipe(untilDestroyed(this)).subscribe(deleteDislikeList => {
                const dislikeId: number = deleteDislikeList[0]?.id;
                this.dataService.deleteVideoDislikeById(dislikeId).pipe(untilDestroyed(this)).subscribe(response => {
                  this.updateVideoPreferenceButtonCounts();
                  this.dislikeButton.clazz.active = false;
                  this.dislikeButton.imageSrc = this.thumbDownImg;
                });
              });
            }
          });
        } else if (VideoInfoControlsComponent.isCommentDislikeAction(event)) {
          this.dataService.findCommentDislikeByCommentIdAndUsername(this.videoInfoForCtrl.id, this.commentInput.id, this.loggedInUser.username).pipe(untilDestroyed(this)).subscribe(currentDislikeList => {
            if (currentDislikeList.length == 0) {
              this.dataService.findCommentLikeByCommentIdAndUsername(this.videoInfoForCtrl.id, this.commentInput.id, this.loggedInUser.username).pipe(untilDestroyed(this)).subscribe(likeList => {
                if (likeList.length !== 0) {
                  this.dataService.deleteCommentLikeById(likeList[0].id).pipe(untilDestroyed(this)).subscribe(response => {
                    this.dislikeComment();
                  });
                } else {
                  this.dislikeComment();
                }
              });
            } else {
              this.dataService.findCommentDislikeByCommentIdAndUsername(this.videoInfoForCtrl.id, this.commentInput.id, this.loggedInUser.username).pipe(untilDestroyed(this)).subscribe(deleteDislikeList => {
                const dislikeId: number = deleteDislikeList[0]?.id;
                this.dataService.deleteCommentDislikeById(dislikeId).pipe(untilDestroyed(this)).subscribe(response => {
                  this.uiService.emitDeleteCommentDislike(this.commentInput);
                  this.updateCommentPreferenceButtonCounts();
                  /*this.dislikeButton.clazz.active = false;
                  this.dislikeButton.imageSrc = this.thumbDownImg;*/
                });
              });
            }
          });
        }
      } else {
        alert('You are not logged in. Please login first to perform actions.');
      }
    }
  }

  private likeVideo(): void {
    const like: LikeDislike = new LikeDislike({username: this.loggedInUser?.username, videoId: this.videoInfoForCtrl.id});
    this.dataService.persistLike(like).pipe(untilDestroyed(this)).subscribe(likeDislike => {
      this.updateVideoPreferenceButtonCounts();
      this.likeButton.clazz.active = true;
      this.dislikeButton.clazz.active = false;
      this.likeButton.imageSrc = this.thumbUpActiveImg;
      this.dislikeButton.imageSrc = this.thumbDownImg;
    });
  }

  private dislikeVideo(): void {
    const dislike: LikeDislike = new LikeDislike({username: this.loggedInUser?.username, videoId: this.videoInfoForCtrl.id});
    this.dataService.persistDislike(dislike).pipe(untilDestroyed(this)).subscribe(likeDislike => {
      this.updateVideoPreferenceButtonCounts();
      this.dislikeButton.clazz.active = true;
      this.likeButton.clazz.active = false;
      this.dislikeButton.imageSrc = this.thumbDownActiveImg;
      this.likeButton.imageSrc = this.thumbUpImg;
    });
  }

  private likeComment(): void {
    const like: LikeDislike = new LikeDislike({username: this.loggedInUser?.username, videoId: this.videoInfoForCtrl.id, commentId: this.commentInput.id});
    this.dataService.persistLike(like).pipe(untilDestroyed(this)).subscribe(likeDislike => {
      this.uiService.emitLikedComment(this.commentInput);
      this.updateCommentPreferenceButtonCounts();
      /*this.likeButton.clazz.active = true;
      this.dislikeButton.clazz.active = false;
      this.likeButton.imageSrc = this.thumbUpActiveImg;
      this.dislikeButton.imageSrc = this.thumbDownImg;*/
    });
  }

  private dislikeComment(): void {
    const dislike: LikeDislike = new LikeDislike({username: this.loggedInUser?.username, videoId: this.videoInfoForCtrl.id, commentId: this.commentInput.id});
    this.dataService.persistDislike(dislike).pipe(untilDestroyed(this)).subscribe(likeDislike => {
      this.uiService.emitDislikedComment(this.commentInput);
      this.updateCommentPreferenceButtonCounts();
      /*this.dislikeButton.clazz.active = true;
      this.likeButton.clazz.active = false;
      this.dislikeButton.imageSrc = this.thumbDownActiveImg;
      this.likeButton.imageSrc = this.thumbUpImg;*/
    });
  }

  private updateVideoPreferenceButtonCounts(): void {
    this.dataService.getVideoLikes(this.videoInfoForCtrl.id).pipe(untilDestroyed(this)).subscribe(likeList => this.uiService.emitVideoLikes(likeList.length));
    this.dataService.getVideoDislikes(this.videoInfoForCtrl.id).pipe(untilDestroyed(this)).subscribe(dislikeList => this.uiService.emitVideoDislikes(dislikeList.length));
  }

  private updateCommentPreferenceButtonCounts(): void {
    this.dataService.getCommentLikes(this.videoInfoForCtrl.id, this.commentInput.id).pipe(untilDestroyed(this)).subscribe(likeList => this.uiService.emitCommentLikesCount(likeList.length, this.commentInput));
    this.dataService.getCommentDislikes(this.videoInfoForCtrl.id, this.commentInput.id).pipe(untilDestroyed(this)).subscribe(dislikeList => this.uiService.emitCommentDislikesCount(dislikeList.length, this.commentInput));
  }

  private static isVideoLikeAction(event: {}): boolean {
    const {parentComponent, action} = AppUtil.BUTTON_ACTION_OBJ;
    return event[parentComponent] === VideoInfoControlsComponent.name && event[action] === 'likeVideo';
  }

  private static isVideoDislikeAction(event: {}): boolean {
    const {parentComponent, action} = AppUtil.BUTTON_ACTION_OBJ;
    return event[parentComponent] === VideoInfoControlsComponent.name && event[action] === 'dislikeVideo';
  }

  private static isCommentLikeAction(event: {}): boolean {
    const {parentComponent, action} = AppUtil.BUTTON_ACTION_OBJ;
    return event[parentComponent] === VideoInfoControlsComponent.name && event[action] === 'likeComment';
  }

  private static isCommentDislikeAction(event: {}): boolean {
    const {parentComponent, action} = AppUtil.BUTTON_ACTION_OBJ;
    return event[parentComponent] === VideoInfoControlsComponent.name && event[action] === 'dislikeComment';
  }

}
