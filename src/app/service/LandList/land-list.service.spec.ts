import { TestBed } from '@angular/core/testing';

import { LandListService } from './land-list.service';

describe('LandListService', () => {
  let service: LandListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
