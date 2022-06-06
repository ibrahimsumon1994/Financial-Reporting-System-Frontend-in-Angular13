import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderAddComponent } from './header-add.component';

describe('HeaderAddComponent', () => {
  let component: HeaderAddComponent;
  let fixture: ComponentFixture<HeaderAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
