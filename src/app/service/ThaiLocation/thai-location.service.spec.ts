import { TestBed } from '@angular/core/testing';

import { ThaiLocationService } from './thai-location.service';

describe('ThaiLocationService', () => {
  let service: ThaiLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThaiLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
