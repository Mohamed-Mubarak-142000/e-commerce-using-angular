import { TestBed } from '@angular/core/testing';

import { WishList } from './wish-list';

describe('WishList', () => {
  let service: WishList;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WishList);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
