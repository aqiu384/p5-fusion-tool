import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { PREVIOUS_DEMON_KEYS, EXCLUDED_DEMONS_KEY } from '../models/constants';
import { ExcludedDemon } from '../models/models';
import { FusionChart } from '../models/fusion-chart';
import { Compendium } from '../models/compendium';

@Injectable()
export class FusionDataService {
    compendium = new Compendium();
    fusionChart = new FusionChart();

    compendiumBS = new BehaviorSubject(this.compendium);
    fusionChartBS = new BehaviorSubject(this.fusionChart);

    constructor() {
        for (const demonKey of PREVIOUS_DEMON_KEYS) {
            localStorage.removeItem(demonKey);
        }

        const excludedDemons = JSON.parse(localStorage.getItem(EXCLUDED_DEMONS_KEY));

        if (excludedDemons) {
            this.updateExcludedDemons(excludedDemons);
        }

        window.addEventListener('storage', this.onStorageUpdated.bind(this));
    }

    updateExcludedDemons(excludedDemons: ExcludedDemon[]) {
        localStorage.setItem(EXCLUDED_DEMONS_KEY, JSON.stringify(excludedDemons));
        this.compendium.setExcludedDemons(excludedDemons);
        this.compendiumBS.next(this.compendium);
    }

    onStorageUpdated(e) {
        switch (e.key) {
            case EXCLUDED_DEMONS_KEY:
                this.compendium.setExcludedDemons(JSON.parse(e.newValue));
                this.compendiumBS.next(this.compendium);
                break;
            default:
                break;
        }
    }
}
