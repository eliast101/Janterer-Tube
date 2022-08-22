import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Comment} from "../model/Comment";

@Injectable({
  providedIn: 'root'
})
export class UiService {

  private showHideSideNav: boolean = false;

  private showHideSideNavSubject = new BehaviorSubject<boolean>(false);

  private videoLikesSubject = new BehaviorSubject<number>(0);

  private videoDislikesSubject = new BehaviorSubject<number>(0);

  private commentLikesCountSubject = new BehaviorSubject<[number?, Comment?]>([]); // [likes count, the comment object]

  private commentDislikesCountSubject = new BehaviorSubject<[number?, Comment?]>([]); // [dislikes count, the comment object]

  private likedCommentSubject = new BehaviorSubject<Comment>(new Comment());

  private dislikedCommentSubject = new BehaviorSubject<Comment>(new Comment());

  private deleteCommentLikeSubject = new BehaviorSubject<Comment>(new Comment());

  private deleteCommentDislikeSubject = new BehaviorSubject<Comment>(new Comment());

  private replyActivatedSubject = new Subject<Comment>();

  private cancelReplyInputSubject = new Subject<Comment>();

  private newReplySubject = new BehaviorSubject<Comment>(new Comment());

  private parentCommentDeletedSubject = new BehaviorSubject<Comment>(new Comment());

  private replyDeletedSubject = new BehaviorSubject<Comment>(new Comment());

  private parentCommentToBeEditedSubject = new Subject<Comment>();

  private replyToBeEditedSubject = new Subject<Comment>();

  private editParentCommentSubject = new Subject<Comment>();

  private commentForDeleteModalSubject = new Subject<Comment>();

  private deleteCommentDecidedSubject = new Subject<Comment>();

  private hideCommentDeletedInfoSubject = new Subject<boolean>();

  constructor() { }

  emitShowHideSideNavEvent(): void {
    this.showHideSideNav = !this.showHideSideNav;
    this.showHideSideNavSubject.next(this.showHideSideNav);
  }

  onShowHideSideNav(): Observable<boolean> {
    return this.showHideSideNavSubject.asObservable();
  }

  emitVideoLikes(likesCount: number): void {
    this.videoLikesSubject.next(likesCount);
  }

  onVideoLikes(): Observable<number> {
    return this.videoLikesSubject.asObservable();
  }

  emitVideoDislikes(dislikesCount: number) : void {
    this.videoDislikesSubject.next(dislikesCount);
  }

  onVideoDislikes(): Observable<number> {
    return this.videoDislikesSubject.asObservable();
  }

  emitCommentLikesCount(likesCount: number, comment: Comment): void {
    this.commentLikesCountSubject.next([likesCount, comment]);
  }

  onCommentLikesCount(): Observable<[number?, Comment?]> {
    return this.commentLikesCountSubject.asObservable();
  }

  emitCommentDislikesCount(dislikesCount: number, comment: Comment) : void {
    this.commentDislikesCountSubject.next([dislikesCount, comment]);
  }

  onCommentDislikesCount(): Observable<[number?, Comment?]> {
    return this.commentDislikesCountSubject.asObservable();
  }

  emitLikedComment(likedComment: Comment): void {
    this.likedCommentSubject.next(likedComment);
  }

  onLikedComment(): Observable<Comment> {
    return this.likedCommentSubject.asObservable();
  }

  emitDislikedComment(likedComment: Comment): void {
    this.dislikedCommentSubject.next(likedComment);
  }

  onDislikedComment(): Observable<Comment> {
    return this.dislikedCommentSubject.asObservable();
  }

  emitDeleteCommentLike(likedComment: Comment): void {
    this.deleteCommentLikeSubject.next(likedComment);
  }

  onDeleteCommentLike(): Observable<Comment> {
    return this.deleteCommentLikeSubject.asObservable();
  }

  emitDeleteCommentDislike(likedComment: Comment): void {
    this.deleteCommentDislikeSubject.next(likedComment);
  }

  onDeleteCommentDislike(): Observable<Comment> {
    return this.deleteCommentDislikeSubject.asObservable();
  }

  emitReplyActivated(replyActivated: Comment): void {
    this.replyActivatedSubject.next(replyActivated);
  }

  onReplyActivated(): Observable<Comment> {
    return this.replyActivatedSubject.asObservable();
  }

  emitCancelReplyInput(commentToBeReplied: Comment): void {
    this.cancelReplyInputSubject.next(commentToBeReplied);
  }

  onCancelReplyInput(): Observable<Comment> {
    return this.cancelReplyInputSubject.asObservable();
  }

  emitNewReply(newReply: Comment): void {
    this.newReplySubject.next(newReply);
  }

  onNewReply(): Observable<Comment> {
    return this.newReplySubject.asObservable();
  }

  emitParentCommentDeleted(deletedComment: Comment) {
    this.parentCommentDeletedSubject.next(deletedComment);
  }

  onParentCommentDeleted(): Observable<Comment> {
    return this.parentCommentDeletedSubject.asObservable();
  }

  emitReplyDeleted(comment: Comment) {
    this.replyDeletedSubject.next(comment);
  }

  onReplyDeleted(): Observable<Comment> {
    return this.replyDeletedSubject.asObservable();
  }

  emitParentCommentToBeEdited(commentToBeEdited: Comment) {
    this.parentCommentToBeEditedSubject.next(commentToBeEdited);
  }

  onParentCommentToBeEdited(): Observable<Comment> {
    return this.parentCommentToBeEditedSubject.asObservable();
  }

  emitReplyToBeEdited(replyToBeEdited: Comment) {
    this.replyToBeEditedSubject.next(replyToBeEdited);
  }

  onReplyToBeEdited(): Observable<Comment> {
    return this.replyToBeEditedSubject.asObservable();
  }

  emitCommentForDeleteModal(comment: Comment) {
    this.commentForDeleteModalSubject.next(comment);
  }

  onCommentForDeleteModal(): Observable<Comment> {
    return this.commentForDeleteModalSubject.asObservable();
  }

  emitDeleteCommentDecided(commentForModal: Comment) {
    this.deleteCommentDecidedSubject.next(commentForModal);
  }

  onDeleteCommentDecided(): Observable<Comment> {
    return this.deleteCommentDecidedSubject.asObservable();
  }

  emitHideCommentDeletedInfo() {
    this.hideCommentDeletedInfoSubject.next(true);
  }

  onHideCommentDeletedInfo(): Observable<boolean> {
    return this.hideCommentDeletedInfoSubject.asObservable();
  }

  emitEditParentComment(currentParentComment: Comment) {
    this.editParentCommentSubject.next(currentParentComment);
  }

  onEditParentComment(): Observable<Comment> {
    return this.editParentCommentSubject.asObservable();
  }

}
