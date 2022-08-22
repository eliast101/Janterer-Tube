export class VideoMetadata {
  id?: number;
  uploadedBy?: string = '';
  title?: string;
  description?: string;
  privacy?: number;
  filePath?: string;
  category?: number;
  uploadedDate?: string;
  views?: number = 0;
  duration?: string;


  constructor(id?: number, uploadedBy?: string, title?: string, description?: string, privacy?: number, filePath?: string, category?: number, views?: number, duration?: string) {
    this.id = id;
    this.uploadedBy = uploadedBy;
    this.title = title;
    this.description = description;
    this.privacy = privacy;
    this.filePath = filePath;
    this.category = category;
    this.uploadedDate = new Date().toISOString();
    if (views) {
      this.views = views;
    }
    this.duration = duration;
  }
}
