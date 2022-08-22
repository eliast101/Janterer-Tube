import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoUploadFormComponent } from './video-upload-form.component';

describe('VideoUploadFormComponent', () => {
  let component: VideoUploadFormComponent;
  let fixture: ComponentFixture<VideoUploadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoUploadFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoUploadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
