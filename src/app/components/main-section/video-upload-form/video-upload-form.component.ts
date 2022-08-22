import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {Category} from "../../../model/Category";
import {NgForm} from "@angular/forms";
import {VideoMetadata} from "../../../model/VideoMetadata";
import {FileUploadService} from "../../../services/file-upload.service";
import {Thumbnail} from "../../../model/Thumbnail";
import * as bootstrap from 'bootstrap';
import {UiService} from "../../../services/ui.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-video-upload-form',
  templateUrl: './video-upload-form.component.html',
  styleUrls: ['./video-upload-form.component.css']
})
export class VideoUploadFormComponent implements OnInit, OnDestroy {

  categories: Category[] = [];

  fileInput: File;

  videoMetadata: VideoMetadata;

  showHideSideNav: boolean = false;

  onShowHideSideNavSubscription: Subscription;
  getCategoriesSubscription: Subscription;
  uploadFileSubscription: Subscription;
  onLoggedInUserEventSubscription: Subscription;
  persistVideoMetadataSubscription: Subscription;
  persistThumbnailSubscription: Subscription;

  constructor(private dataService: DataService, private fileUploadService: FileUploadService, private uiService: UiService) {
    this.videoMetadata = new VideoMetadata();
    this.videoMetadata.privacy = 0; // default selected in UI
    this.videoMetadata.category = 1; // default selected in UI

    this.onShowHideSideNavSubscription = this.uiService.onShowHideSideNav().subscribe(val => this.showHideSideNav = val);
  }

  ngOnInit(): void {
    this.getCategoriesSubscription = this.dataService.getCategories().subscribe(catList => this.categories = catList);
  }

  upload(uploadForm: NgForm) {

    // show spinner modal when upload button is clicked
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'), {backdrop: 'static', keyboard: false});
    loadingModal?.show();

    this.uploadFileSubscription = this.fileUploadService.uploadFile(this.fileInput)
      .subscribe(
        (fileUploadResponse) => {
          const {filePath, duration, thumbnailImagePathList} = fileUploadResponse;
          this.videoMetadata.filePath = filePath;
          this.videoMetadata.duration = duration;
          this.onLoggedInUserEventSubscription = this.dataService.onLoggedInUserEvent().subscribe(userData => {
            this.videoMetadata.uploadedBy = userData.username;

            this.persistVideoMetadataSubscription = this.dataService.persistVideoMetadata(this.videoMetadata).subscribe(savedVideoMetadata => {
              // Save Video thumbnails
              for (let thumbnailImagePath of thumbnailImagePathList) {
                //console.log('Thumbnail Path List: ' + thumbnailImagePathList.toString());
                //console.log('thumbnail Path: ' + thumbnailImagePath);
                const thumbnail = new Thumbnail(savedVideoMetadata.id, thumbnailImagePath, 0);
                this.persistThumbnailSubscription = this.dataService.persistThumbnail(thumbnail).subscribe(savedThumbnail => console.log(savedThumbnail), error => {
                  loadingModal.hide();
                  console.log(error);
                });
              }
            }, error => {
              loadingModal.hide();
              console.log(error);
            });
            loadingModal.hide();
            uploadForm.resetForm();
            // hide spinner modal
          }, error => {
            loadingModal.hide();
            console.log(error);
          });
        },
        error => {
          loadingModal.hide();
          console.log(error);
          uploadForm.resetForm();
          // hide spinner modal on error also
        });
  }

  onFileSelect($event: Event) {
    this.fileInput = $event.target['files'][0];
  }

  ngOnDestroy(): void {
    this.onShowHideSideNavSubscription ? this.onShowHideSideNavSubscription.unsubscribe(): null;
    this.getCategoriesSubscription ? this.getCategoriesSubscription.unsubscribe(): null;
    this.uploadFileSubscription ? this.uploadFileSubscription.unsubscribe(): null;
    this.onLoggedInUserEventSubscription ? this.onLoggedInUserEventSubscription.unsubscribe(): null;
    this.persistVideoMetadataSubscription ? this.persistVideoMetadataSubscription.unsubscribe(): null;
    this.persistThumbnailSubscription ? this.persistThumbnailSubscription.unsubscribe(): null;
  }

}
