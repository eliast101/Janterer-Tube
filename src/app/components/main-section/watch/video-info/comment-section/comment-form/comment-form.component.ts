import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VideoMetadata} from "../../../../../../model/VideoMetadata";
import {ButtonInput} from "../../../../../../model/ButtonInput";
import {Comment} from "../../../../../../model/Comment";
import {DataService} from "../../../../../../services/data.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AppUtil} from "../../../../../../shared/AppUtil";
import {UiService} from "../../../../../../services/ui.service";

@UntilDestroy()
@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit {

  @Input() videoData: VideoMetadata;

  @Input() isCommentReply: boolean = false;

  @Output() newComment$ = new EventEmitter<Comment>();

  @Output() updateComment$ = new EventEmitter<Comment>();

  // each parent comment
  @Input() parentComment: Comment;

  // each reply comment
  @Input() responseToComment: Comment;

  @Input() displayReplyInput: boolean = false;

  @Input() profilePictureClass: string[] = [];

  @Input() parentCommentToBeEdited: Comment;

  @Input() replyToBeEdited: Comment;

  finalReplyToBeEdited: Comment;

  //@Output() displayEditFormForReply$ = new EventEmitter<Comment>();

  commentBtnInput: ButtonInput;

  cancelBtnInput: ButtonInput;

  @Input() commentValue: string;

  @Input() displayCommentButtons: boolean = false;

  loggedInUsername: string;

  constructor(private dataService: DataService, private uiService: UiService) { }

  ngOnInit(): void {
    this.dataService.onLoggedInUserEvent()
      .pipe(untilDestroyed(this))
      .subscribe(userData => this.loggedInUsername = userData.username);

    this.commentBtnInput = new ButtonInput(
      {
        clazz: {'btn': true, 'commentBtnActive': this.commentValue !== undefined, 'commentBtnDisabled': this.commentValue === undefined},
        text: 'COMMENT',
        action: {
          parentComponent: CommentFormComponent.name,
          action: 'comment'
        }
      });

    this.cancelBtnInput = new ButtonInput(
      {
        clazz: {'btn': true, 'cancelBtn': true},
        text: 'CANCEL',
        action: {
          parentComponent: CommentFormComponent.name,
          action: 'cancel'
        }
      });

    this.uiService.onReplyActivated().pipe(untilDestroyed(this)).subscribe(replyActivated => {
      if (replyActivated?.id === this.replyToBeEdited?.id) {
        replyActivated.parentCommentId > 0 ? this.commentValue = `@${replyActivated?.postedBy} ` : this.commentValue;
        this.commentBtnInput.text = 'REPLY';
      }
    });

    this.uiService.onReplyToBeEdited().pipe(untilDestroyed(this)).subscribe(currentReply => {
      if (this.replyToBeEdited) {
        if (currentReply && currentReply.id === this.replyToBeEdited.id) {
          this.commentValue = currentReply.body;
          this.finalReplyToBeEdited = currentReply;
          this.displayCommentButtons = true;
        }
      }
    });

    this.uiService.onParentCommentToBeEdited().pipe(untilDestroyed(this)).subscribe(currentParentComment => {
      if (this.parentComment) {
        if (currentParentComment?.id === this.parentComment.id && this.parentComment.parentCommentId === 0 && this.parentComment.responseTo === 0) {
          this.uiService.emitEditParentComment(currentParentComment);
        }
      }
    });
  }

  handleCommentButton(event: {}, el: HTMLTextAreaElement) {
    if (AppUtil.isValidButtonEventObject(event) && CommentFormComponent.isCommentAction(event)) {
      if (this.commentValue && this.commentValue != '') {
        if (this.parentCommentToBeEdited) { // parent comment edit
          this.parentCommentToBeEdited.body = this.commentValue;

          this.dataService.updateComment(this.parentCommentToBeEdited).pipe(untilDestroyed(this)).subscribe(updatedComment => {
            //this.uiService.emitUpdatedParentComment(updatedComment);

            // emmit this for parent level comment only
            this.updateComment$.emit(updatedComment);

            this.parentCommentToBeEdited = undefined;
            this.commentValue = '';
            el.style.height = ''; // reset textarea height

            // update button style based on comment being empty or not
            this.updateCommentButtonStyle();
          });

        } else if (this.finalReplyToBeEdited) { // reply edit
          this.finalReplyToBeEdited.body = this.commentValue;

          this.dataService.updateComment(this.finalReplyToBeEdited).pipe(untilDestroyed(this)).subscribe(updatedReply => {
            this.finalReplyToBeEdited = undefined;

            this.commentValue = '';
            el.style.height = ''; // reset textarea height

            // after reply button is clicked, hide the reply input form
            this.uiService.emitReplyActivated(updatedReply);
            this.uiService.emitCancelReplyInput(updatedReply);

            // update button style based on comment being empty or not
            this.updateCommentButtonStyle();
          });

        } else { // here downwards is for new comment and reply
          let comment: Comment = new Comment({videoId: this.videoData.id, postedBy: this.loggedInUsername, body: this.commentValue});
          if (this.parentComment && this.responseToComment && this.displayReplyInput) {
            comment.parentCommentId = this.parentComment.id;
            comment.responseTo = this.responseToComment.id;
          }
          this.dataService.saveComment(comment).pipe(untilDestroyed(this)).subscribe(savedComment => {
            // emmit this for parent level comment only
            if (savedComment.parentCommentId === 0) {
              this.newComment$.emit(savedComment);
            } else {
              // emit new reply observable
              this.uiService.emitNewReply(savedComment);
            }

            this.commentValue = '';
            el.style.height = ''; // reset textarea height

            // after reply button is clicked, hide the reply input form
            if (this.parentComment && this.responseToComment && this.displayReplyInput) {
              this.uiService.emitReplyActivated(this.responseToComment);
              this.uiService.emitCancelReplyInput(comment);
            }

            // update button style based on comment being empty or not
            this.updateCommentButtonStyle();
          });
        }
      } else {
        console.log('No Comment entered!');
      }
    }
  }

  handleCancelButton(event: {}, el: HTMLTextAreaElement, comment: Comment) {
    if (AppUtil.isValidButtonEventObject(event) && CommentFormComponent.isCancelAction(event)) {
      if (!comment) {
        this.displayCommentButtons = false;
        this.commentValue = '';
        el.style.height = ''; // reset textarea height

        // update button style based on comment being empty or not
        this.updateCommentButtonStyle();
      } else {
        // console.log('selected comment: ' + JSON.stringify(comment));
        // console.log('current comment: ' + JSON.stringify(this.replyToBeEdited));
        if (comment.parentCommentId === this.replyToBeEdited?.parentCommentId && comment.id === this.replyToBeEdited?.id) {
          this.displayCommentButtons = false;
          this.commentValue = '';
          el.style.height = ''; // reset textarea height

          // for Reply input, behavior should be to hide the comment form all together instead of just hiding the buttons
          //this.displayReplyInput = false;
          this.uiService.emitCancelReplyInput(comment);

          // update button style based on comment being empty or not
          this.updateCommentButtonStyle();
        }
      }

      /*// for Reply input, behavior should be to hide the comment form all together instead of just hiding the buttons
      //this.displayReplyInput = false;
      this.uiService.emitCancelReplyInput();

      // update button style based on comment being empty or not
      this.updateCommentButtonStyle();*/
    }
  }

  private static isCommentAction(event: {}): boolean {
    const {parentComponent, action} = AppUtil.BUTTON_ACTION_OBJ;
    return event[parentComponent] === CommentFormComponent.name && event[action] === 'comment';
  }

  private static isCancelAction(event: {}): boolean {
    const {parentComponent, action} = AppUtil.BUTTON_ACTION_OBJ;
    return event[parentComponent] === CommentFormComponent.name && event[action] === 'cancel';
  }

  emitCommentTextChange(el: HTMLTextAreaElement) {
    // This will auto-grow textarea with text content
    el.style.height = '';
    el.style.height = Math.min(el.scrollHeight, 300) + 'px';

    // update button style based on comment being empty or not
    this.updateCommentButtonStyle();
  }

  onCommentAreaFocus(focusEvent: FocusEvent) {
    this.displayCommentButtons = true;
  }

  private updateCommentButtonStyle() {
    this.commentBtnInput.clazz =
      {
        'btn': true,
        'commentBtnActive': (this.commentValue && this.commentValue !== ''),
        'commentBtnDisabled': (!this.commentValue || this.commentValue === '')
      };
  }
}
