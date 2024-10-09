import { TestBed } from '@angular/core/testing';

import { XmlBuilderService } from './xml-builder.service';

describe('XmlBuilderService', () => {
  let service: XmlBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XmlBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
