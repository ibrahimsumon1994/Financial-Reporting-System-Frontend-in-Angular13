import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonCodeListComponent } from './common-code-list.component';

describe('CommonCodeListComponent', () => {
  let component: CommonCodeListComponent;
  let fixture: ComponentFixture<CommonCodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonCodeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonCodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
