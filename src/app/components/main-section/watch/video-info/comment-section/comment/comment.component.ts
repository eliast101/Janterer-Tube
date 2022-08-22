import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {VideoMetadata} from "../../../../../../model/VideoMetadata";
import {Comment} from "../../../../../../model/Comment";
import {DataService} from "../../../../../../services/data.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {UiService} from "../../../../../../services/ui.service";
import {AppUtil} from "../../../../../../shared/AppUtil";
import { faPenFancy, faTrashAlt} from '@fortawesome/free-solid-svg-icons';

@UntilDestroy()
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() videoData: VideoMetadata;

  @Input() commentData: Comment;

  @Input() parentComment: Comment;

  @Input() responseToComment: Comment;

  @Input() profilePictureClass: string[] = [];

  @Output() toBeDeletedComment = new EventEmitter<Comment>();

  @Output() showDeleteModal = new EventEmitter<boolean>();

  selectedComment: Comment;

  displayReplyForm: boolean = false;

  replyInputActive: boolean = false;

  timeAgo: string;

  showEditPopUp: boolean = false;

  faPenFancy = faPenFancy;

  faTrashAlt = faTrashAlt;

  constructor(private dataService: DataService, private uiService: UiService) { }

  ngOnInit(): void {
    this.timeAgo = AppUtil.calcTimeAgo(new Date(), new Date(this.commentData?.datePosted));
    this.uiService.onCancelReplyInput().pipe(untilDestroyed(this)).subscribe(toBeRepliedComment => {
      if (!toBeRepliedComment?.id) { // when reply button is clicked, need to hide the reply form after saving the reply
        this.replyInputActive = false;
        this.displayReplyForm = false;
      }
      if (toBeRepliedComment?.id === this.commentData?.id) { // when cancel button is clicked
        this.replyInputActive = false;
        this.displayReplyForm = false;
      }
    });

    this.uiService.onReplyToBeEdited().pipe(untilDestroyed(this)).subscribe(currentReply => {
      if (this.commentData) {
        if (currentReply?.id == this.commentData?.id) {
          this.displayReplyForm = true;
          this.replyInputActive = true;
          this.uiService.emitReplyActivated(this.commentData);
        }
      }
    });
  }

  showReplyForm(selectedComment) {
    this.displayReplyForm = true;
    this.replyInputActive = true;
    this.uiService.emitReplyActivated(selectedComment);
  }

  async deleteComment(comment: Comment) {
    this.uiService.emitCommentForDeleteModal(comment);
    this.showEditPopUp = false;
  }

  toggleEditPopUp(selectedComment: Comment, event: MouseEvent) {
    this.selectedComment = selectedComment;
    if (selectedComment?.id === this.commentData?.id) {
      this.showEditPopUp = !this.showEditPopUp;
      event.stopPropagation();
    }
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    if (this.selectedComment?.id === this.commentData?.id) {
      this.showEditPopUp = false;
    }
  }

  editComment(commentToBeEdited: Comment) {
    if (commentToBeEdited?.parentCommentId === 0) {
      this.uiService.emitParentCommentToBeEdited(commentToBeEdited);
    } else {
      this.uiService.emitReplyToBeEdited(commentToBeEdited);
    }
    this.showEditPopUp = false;
  }

}
