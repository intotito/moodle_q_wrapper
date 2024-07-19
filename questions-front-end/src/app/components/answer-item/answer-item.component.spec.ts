import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerItemComponent } from './answer-item.component';

describe('AnswerItemComponent', () => {
  let component: AnswerItemComponent;
  let fixture: ComponentFixture<AnswerItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnswerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
