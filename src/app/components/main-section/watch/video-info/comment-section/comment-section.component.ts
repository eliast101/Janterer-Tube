import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../../../services/data.service";
import {VideoMetadata} from "../../../../../model/VideoMetadata";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Comment} from "../../../../../model/Comment";
import {UiService} from "../../../../../services/ui.service";
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import {animate, style, transition, trigger} from "@angular/animations";

@UntilDestroy()
@Component({
  selector: 'app-comment-section',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('300ms', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('300ms', style({opacity: 0}))
      ])
    ]),
    trigger('fadeInOutInfo', [
      transition(':enter', [
        style({opacity: 0}),
        animate('600ms', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('600ms', style({opacity: 0}))
      ])
    ])
  ],
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit {

  @Input() videoData: VideoMetadata;

  activeComment: Comment;

  commentsCount: number;

  comments: Comment[] = []; // parent level comments

  parentCommentIndexToggleMap: [number?] = [];

  loggedInUsername: string;

  parentIdToRepliesMap: [{parentCommentId?: number, replies?: Comment[]}] = [{}];

  parentCommentToBeEdited: Comment;

  showDeleteModal: boolean = false;

  showCommentDeletedInfo: boolean = false;

  commentForModal: Comment;

  faCaretUp = faCaretUp;
  faCaretDown = faCaretDown;

  constructor(private dataService: DataService, private uiService: UiService) { }

  ngOnInit(): void {
    this.dataService.onLoggedInUserEvent()
      .pipe(untilDestroyed(this))
      .subscribe(userData => this.loggedInUsername = userData.username);

    this.dataService.findAllParentLevelComments(this.videoData?.id)
      .pipe(untilDestroyed(this))
      .subscribe(comments => {
        this.commentsCount = comments.length;
        this.comments = comments;
        for (let parentComment of this.comments) {
          this.dataService.findAllRepliesToParentComment(this.videoData.id, parentComment?.id)
            .pipe(untilDestroyed(this))
            .subscribe(replies => {
              if (replies) {
                this.parentIdToRepliesMap.push({parentCommentId: parentComment.id, replies: replies})
              }
            });
        }
      });

    this.uiService.onNewReply().pipe(untilDestroyed(this)).subscribe(newReply => {
      for (let parentToRepliesItem of this.parentIdToRepliesMap) {
        if (parentToRepliesItem.parentCommentId === newReply.parentCommentId) {
          if (!parentToRepliesItem.replies) {
            parentToRepliesItem.replies = [];
          }
          parentToRepliesItem.replies.push(newReply);
        }
      }
    });

    this.uiService.onParentCommentDeleted().pipe(untilDestroyed(this)).subscribe(deletedComment => {
      this.comments.forEach((comment, index) => {
        if (comment?.id === deletedComment?.id) {
          this.comments.splice(index, 1);
          return;
        }
      });

      this.parentIdToRepliesMap.forEach((item, index) => {
        if (item?.parentCommentId === deletedComment.id) {
          this.parentIdToRepliesMap.splice(index, 1);
          return;
        }
      });
    });

    this.uiService.onReplyDeleted().pipe(untilDestroyed(this)).subscribe(reply => {
      this.parentIdToRepliesMap.forEach(item => {
        if (item?.parentCommentId == reply?.parentCommentId) {
          item?.replies?.forEach((currentReply, index) => {
            if (currentReply?.id === reply.id) {
              item?.replies?.splice(index, 1);
              return;
            }
          });
        }
      });
    });

    this.uiService.onCommentForDeleteModal().pipe(untilDestroyed(this)).subscribe(commentForModal => {
      this.commentForModal = commentForModal;
      this.showDeleteModal = true;
    });

    this.uiService.onDeleteCommentDecided().pipe(untilDestroyed(this)).subscribe(commentToBeDeleted => {
      this.executeDeleteComment(commentToBeDeleted);
    });

    this.uiService.onHideCommentDeletedInfo().pipe(untilDestroyed(this)).subscribe(hide => this.showCommentDeletedInfo = false);

    this.uiService.onEditParentComment().pipe(untilDestroyed(this)).subscribe(commentToBeEdited => {
      this.parentCommentToBeEdited = commentToBeEdited;
    });
  }

  onNewComment(newComment: Comment) {
    this.comments.push(newComment);
    // also update parentIdToRepliesMap to include this parent id in the map
    if (newComment.parentCommentId === 0) {
      this.parentIdToRepliesMap.push({parentCommentId: newComment.id});
    }
  }

  onUpdateComment(updatedComment: Comment) {
    let commentsClone = this.comments.slice(0) as Comment[];
    for (let i = 0; i < commentsClone.length; i++) {
      if (commentsClone[i]?.id === updatedComment?.id) {
        this.comments[i] = updatedComment;
        return;
      }
    }
  }

  toggleShowReplies(comment: Comment, index: number) {
    let mapCopy = this.parentCommentIndexToggleMap;
    if (this.parentCommentIndexToggleMap.length > 0) {
      mapCopy = this.parentCommentIndexToggleMap.slice(0) as [number?];
    }

    let matchedVal = -1;
    for (let i = 0; i < mapCopy.length; i++) {
      if (mapCopy[i] === index) {
        matchedVal = mapCopy[i];
      }
    }
    if (matchedVal > -1) {
      let matchedIndex = this.parentCommentIndexToggleMap.indexOf(matchedVal);
      this.parentCommentIndexToggleMap.splice(matchedIndex, 1);
    } else {
      this.parentCommentIndexToggleMap.push(index);
    }
  }

  deleteCommentDecided(commentForModal: Comment) {
    this.uiService.emitDeleteCommentDecided(commentForModal);
    this.showDeleteModal = false;
  }

  async executeDeleteComment(commentToBeDeleted: Comment) {
    if (commentToBeDeleted.parentCommentId === 0) {
      this.dataService.findAllRepliesToParentComment(this.videoData?.id, commentToBeDeleted?.id).pipe(untilDestroyed(this)).subscribe(replies => {
        replies.forEach(async reply => {
          // when parent comment is deleted, not need to emit replyDeleted subject because
          // when parent comment is removed from map in comment-section component, it will also remove all associated replies
          const response = await this.dataService.deleteCommentById(reply);
        });
      });
      const response = await this.dataService.deleteCommentById(commentToBeDeleted);
      this.uiService.emitParentCommentDeleted(commentToBeDeleted);
      this.showCommentDeletedInfo = true;
      fadeInOutCommentDeletedInfo(this.uiService);
    } else {
      const response = await this.dataService.deleteCommentById(commentToBeDeleted);
      this.uiService.emitReplyDeleted(commentToBeDeleted);
      this.showCommentDeletedInfo = true;
      fadeInOutCommentDeletedInfo(this.uiService);
    }
  }

  cancelDeleteComment(commentForModal: Comment) {
    this.showDeleteModal = false;
  }
}

export function fadeInOutCommentDeletedInfo(uiService: UiService) {
  setTimeout(() => {
    uiService.emitHideCommentDeletedInfo();
  }, 3000);
}
