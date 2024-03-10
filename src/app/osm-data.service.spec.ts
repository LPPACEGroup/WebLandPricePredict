import { TestBed } from '@angular/core/testing';

import { OSMDataService } from './osm-data.service';

describe('OsmDataService', () => {
  let service: OSMDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OSMDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
