import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoViewerComponent } from './repo-viewer.component';

describe('RepoViewerComponent', () => {
  let component: RepoViewerComponent;
  let fixture: ComponentFixture<RepoViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepoViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepoViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
