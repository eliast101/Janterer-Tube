import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Category} from "../model/Category";
import {AppConstant} from "../constants/AppConstant";
import {VideoMetadata} from "../model/VideoMetadata";
import {Thumbnail} from "../model/Thumbnail";
import {UserData} from "../model/UserData";
import {LikeDislike} from "../model/LikeDislike";
import {Subscriber} from "../model/Subscriber";
import {Comment} from "../model/Comment";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private loggedInUserDataSubject = new BehaviorSubject<UserData>(new UserData());
  private subscribersSubject = new BehaviorSubject<number>(0);
  private isSubscribedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(AppConstant.CATEGORIES_DB_API_URL);
  }

  persistVideoMetadata(videoMetadata: VideoMetadata): Observable<VideoMetadata> {
    return this.http.post<VideoMetadata>(AppConstant.VIDEOS_DB_API_URL, videoMetadata);
  }

  persistThumbnail(thumbnail: Thumbnail): Observable<Thumbnail> {
    return this.http.post<Thumbnail>(AppConstant.THUMBNAIL_DB_API_URL, thumbnail);
  }

  persistUser(userData: UserData): Observable<UserData> {
    return this.http.post<UserData>(AppConstant.USERS_DB_API_URL, userData);
  }

  // form input "name" attribute value should match the db column name. Otherwise this will not work
  filterUsersBy(currentControlName: string, val: string): Observable<UserData[]> {
    const url = `${AppConstant.USERS_DB_API_URL}?${currentControlName}=${val}`;
    return this.http.get<UserData[]>(url);
  }

  /*findByUsernameAndPassword(username: string, encryptedPassword: string): Observable<UserData[]> {
    const url = `${AppConstant.USERS_DB_API_URL}?username=${username}&password=${encryptedPassword}`;
    return this.http.get<UserData[]>(url);
  }*/
  emitLoggedInUserData(sessionUser: string) {
    this.filterUsersBy('username', sessionUser).subscribe(userDataList => {
      this.loggedInUserDataSubject.next(userDataList[0]);
    });
  }

  onLoggedInUserEvent(): Observable<UserData> {
    return this.loggedInUserDataSubject.asObservable();
  }

  findVideoById(id: number): Observable<VideoMetadata[]> {
    const url = `${AppConstant.VIDEOS_DB_API_URL}?id=${id}`;
    return this.http.get<VideoMetadata[]>(url);
  }

  updateVideo(updatedVideo: VideoMetadata): Observable<VideoMetadata> {
    const url: string = `${AppConstant.VIDEOS_DB_API_URL}/${updatedVideo.id}`;
    return this.http.put<VideoMetadata>(url, updatedVideo);
  }

  /* ======================= Video Likes and Dislikes ========================= */

  getVideoLikes(videoId: number): Observable<LikeDislike[]> {
    const url = `${AppConstant.LIKES_DB_API_URL}?videoId=${videoId}&commentId=0`;
    return this.http.get<LikeDislike[]>(url);
  }

  getVideoDislikes(videoId: number): Observable<LikeDislike[]> {
    const url = `${AppConstant.DISLIKES_DB_API_URL}?videoId=${videoId}&commentId=0`;
    return this.http.get<LikeDislike[]>(url);
  }

  persistLike(like: LikeDislike): Observable<LikeDislike> {
    return this.http.post<LikeDislike>(AppConstant.LIKES_DB_API_URL, like);
  }

  persistDislike(dislike: LikeDislike): Observable<LikeDislike> {
    return this.http.post<LikeDislike>(AppConstant.DISLIKES_DB_API_URL, dislike);
  }

  findVideoLikeByVideoIdAndUsername(videoId: number, username: string): Observable<LikeDislike[]> {
    const url: string = `${AppConstant.LIKES_DB_API_URL}?videoId=${videoId}&username=${username}&commentId=0`;
    return this.http.get<LikeDislike[]>(url);
  }

  findVideoDislikeByVideoIdAndUsername(videoId: number, username: string): Observable<LikeDislike[]> {
    const url: string = `${AppConstant.DISLIKES_DB_API_URL}?videoId=${videoId}&username=${username}&commentId=0`;
    return this.http.get<LikeDislike[]>(url);
  }

  deleteVideoLikeById(id: number): Observable<any> {
    const url: string = `${AppConstant.LIKES_DB_API_URL}/${id}`;
    return this.http.delete<any>(url, {observe: "response"});
  }

  deleteVideoDislikeById(id: number): Observable<any> {
    const url: string = `${AppConstant.DISLIKES_DB_API_URL}/${id}`;
    return this.http.delete<any>(url, {observe: "response"});
  }

  /* =========================================================================*/

  /* ============================ Comment Likes and Dislikes ========================= */

  getCommentLikes(videoId: number, commentId: number): Observable<LikeDislike[]> {
    let url = `${AppConstant.LIKES_DB_API_URL}?videoId=${videoId}&commentId=${commentId}`;
    return this.http.get<LikeDislike[]>(url);
  }

  getCommentDislikes(videoId: number, commentId: number): Observable<LikeDislike[]> {
    let url = `${AppConstant.DISLIKES_DB_API_URL}?videoId=${videoId}&commentId=${commentId}`;
    return this.http.get<LikeDislike[]>(url);
  }

  findCommentLikeByCommentIdAndUsername(videoId: number, commentId: number, username: string): Observable<LikeDislike[]> {
    let url: string = `${AppConstant.LIKES_DB_API_URL}?videoId=${videoId}&commentId=${commentId}&username=${username}`;
    return this.http.get<LikeDislike[]>(url);
  }

  findCommentDislikeByCommentIdAndUsername(videoId: number, commentId: number, username: string): Observable<LikeDislike[]> {
    let url: string = `${AppConstant.DISLIKES_DB_API_URL}?videoId=${videoId}&commentId=${commentId}&username=${username}`;
    return this.http.get<LikeDislike[]>(url);
  }

  deleteCommentLikeById(id: number): Observable<any> {
    const url: string = `${AppConstant.LIKES_DB_API_URL}/${id}`;
    return this.http.delete<any>(url, {observe: "response"});
  }

  deleteCommentDislikeById(id: number): Observable<any> {
    const url: string = `${AppConstant.DISLIKES_DB_API_URL}/${id}`;
    return this.http.delete<any>(url, {observe: "response"});
  }
  /* ====================================================================================*/

  emitSubscribers(subscribeTo: string): void {
    this.checkSubscribersCount(subscribeTo).subscribe(subscribers => {
      this.subscribersSubject.next(subscribers.length);
    });
  }

  checkSubscribersCount(subscribeTo: string): Observable<Subscriber[]> {
    const url = `${AppConstant.SUBSCRIBERS_DB_API_URL}?subscribeTo=${subscribeTo}`;
    return this.http.get<Subscriber[]>(url);
  }

  onSubscribers(): Observable<number> {
    return this.subscribersSubject.asObservable();
  }

  emitIsSubscribedTo(subscribeTo: string, subscribeFrom: string): void {
    //console.log('SubscribeTo: ' + subscribeTo + ', SubscribeFrom: ' + subscribeFrom);
    this.checkSubscription(subscribeTo, subscribeFrom).subscribe(subscriberList => {
      //console.log(subscriberList);
      this.isSubscribedSubject.next(subscriberList.length > 0);
    });
  }

  checkSubscription(subscribeTo: string, subscribeFrom: string): Observable<Subscriber[]> {
    const url = `${AppConstant.SUBSCRIBERS_DB_API_URL}?subscribeTo=${subscribeTo}&subscribeFrom=${subscribeFrom}`;
    return this.http.get<Subscriber[]>(url);
  }

  onIsSubscribed(): Observable<boolean> {
    return this.isSubscribedSubject.asObservable();
  }

  subscribe(subscribe: Subscriber): Observable<Subscriber> {
    return this.http.post<Subscriber>(AppConstant.SUBSCRIBERS_DB_API_URL, subscribe);
  }

  unsubscribe(id: number): Observable<any> {
    const url: string = `${AppConstant.SUBSCRIBERS_DB_API_URL}/${id}`;
    return this.http.delete<any>(url, {observe: "response"});
  }

  findAllParentLevelComments(videoId: number): Observable<Comment[]> {
    const url = `${AppConstant.COMMENTS_DB_API_URL}/?videoId=${videoId}&parentCommentId=0`;
    return this.http.get<Comment[]>(url);
  }

  findAllRepliesToParentComment(videoId: number, parentCommentId): Observable<Comment[]> {
    const url = `${AppConstant.COMMENTS_DB_API_URL}/?videoId=${videoId}&parentCommentId=${parentCommentId}`;
    return this.http.get<Comment[]>(url);
  }

  findCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${AppConstant.COMMENTS_DB_API_URL}/${id}`);
  }

  saveComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(AppConstant.COMMENTS_DB_API_URL, comment);
  }

  async deleteCommentById(comment: Comment) {
    return this.http.delete(`${AppConstant.COMMENTS_DB_API_URL}/${comment?.id}`).toPromise();
  }

  updateComment(parentCommentToBeEdited: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${AppConstant.COMMENTS_DB_API_URL}/${parentCommentToBeEdited?.id}`, parentCommentToBeEdited);
  }
}
