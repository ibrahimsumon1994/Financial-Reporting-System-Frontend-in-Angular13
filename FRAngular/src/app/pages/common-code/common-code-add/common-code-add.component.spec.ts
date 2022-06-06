import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonCodeAddComponent } from './common-code-add.component';

describe('CommonCodeAddComponent', () => {
  let component: CommonCodeAddComponent;
  let fixture: ComponentFixture<CommonCodeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonCodeAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonCodeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
