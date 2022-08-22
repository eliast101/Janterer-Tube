import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonProviderComponent } from './button-provider.component';

describe('ButtonProviderComponent', () => {
  let component: ButtonProviderComponent;
  let fixture: ComponentFixture<ButtonProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonProviderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
