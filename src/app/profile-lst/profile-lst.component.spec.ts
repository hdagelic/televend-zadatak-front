import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLstComponent } from './profile-lst.component';

describe('ProfileLstComponent', () => {
  let component: ProfileLstComponent;
  let fixture: ComponentFixture<ProfileLstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileLstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
