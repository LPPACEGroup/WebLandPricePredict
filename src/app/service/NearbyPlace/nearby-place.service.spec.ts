import { TestBed } from '@angular/core/testing';

import { NearbyPlaceService } from './nearby-place.service';

describe('NearbyPlaceService', () => {
  let service: NearbyPlaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NearbyPlaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
