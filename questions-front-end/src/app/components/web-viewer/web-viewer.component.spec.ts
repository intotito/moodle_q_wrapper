import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebViewerComponent } from './web-viewer.component';

describe('WebViewerComponent', () => {
  let component: WebViewerComponent;
  let fixture: ComponentFixture<WebViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
