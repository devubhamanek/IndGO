/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TfmApiService } from './tfm-api.service';

describe('Service: TfmApi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TfmApiService]
    });
  });

  it('should ...', inject([TfmApiService], (service: TfmApiService) => {
    expect(service).toBeTruthy();
  }));
});
