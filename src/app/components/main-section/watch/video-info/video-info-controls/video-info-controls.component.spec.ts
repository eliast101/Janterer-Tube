import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoInfoControlsComponent } from './video-info-controls.component';

describe('VideoInfoControlsComponent', () => {
  let component: VideoInfoControlsComponent;
  let fixture: ComponentFixture<VideoInfoControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoInfoControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoInfoControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
