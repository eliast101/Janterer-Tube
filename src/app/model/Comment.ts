export class Comment {
  id?: number;
  postedBy?: string;
  videoId?: number;
  parentCommentId: number;
  responseTo?: number; // id of the comment replied to
  body?: string;
  datePosted?: string;

  constructor(
    {
      id,
      postedBy,
      videoId,
      parentCommentId = 0,
      responseTo = 0,
      body,
      datePosted = new Date().toLocaleString()
    } : {id?: number, postedBy?: string, videoId?: number, parentCommentId?: number, responseTo?: number, body?: string, datePosted?: string} = {}) {
    this.id = id;
    this.postedBy = postedBy;
    this.videoId = videoId;
    this.parentCommentId = parentCommentId;
    this.responseTo = responseTo;
    this.body = body;
    this.datePosted = datePosted;
  }
}
