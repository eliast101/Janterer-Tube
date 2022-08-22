export class LikeDislike {
  id?: number;
  username?: string;
  videoId?: number;
  commentId?: number = 0;

  constructor({
                id,
                username,
                videoId,
                commentId = 0}: {id?: number, username?: string, videoId?: number, commentId?: number} = {}) {

    this.id = id;
    this.username = username;
    this.videoId = videoId;
    this.commentId = commentId;
  }


}
