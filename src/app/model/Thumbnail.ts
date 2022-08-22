export class Thumbnail {
  id?: number;
  videoId: number;
  filePath: string;
  selected: number;

  constructor(videoId: number, filePath: string, selected: number, id?: number) {
    this.id = id;
    this.videoId = videoId;
    this.filePath = filePath;
    this.selected = selected;
  }
}
