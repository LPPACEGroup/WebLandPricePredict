import { TestBed } from '@angular/core/testing';

import { MarkersortService } from './markersort.service';

describe('MarkersortService', () => {
  let service: MarkersortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkersortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
