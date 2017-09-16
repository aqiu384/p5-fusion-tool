import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CurrentDemonService {
    currentNameBS = new BehaviorSubject<string>('none');
}
