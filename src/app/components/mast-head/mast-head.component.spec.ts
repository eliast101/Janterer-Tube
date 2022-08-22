import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MastHeadComponent } from './mast-head.component';

describe('MastHeadComponent', () => {
  let component: MastHeadComponent;
  let fixture: ComponentFixture<MastHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MastHeadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MastHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
