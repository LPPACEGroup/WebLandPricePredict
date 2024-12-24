import { TestBed } from '@angular/core/testing';

import { GetRouteService } from './get-route.service';

describe('GetRouteService', () => {
  let service: GetRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
