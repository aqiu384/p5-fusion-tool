import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { FusionRow } from '../models/models';
import { Compendium } from '../models/compendium';
import { FusionChart } from '../models/fusion-chart';
import { calculateForwardFusions } from '../models/forward-fusion-calculator';

import { FusionDataService } from '../services/fusion-data.service';
import { CurrentDemonService } from '../services/current-demon.service';

@Component({
    selector: 'app-forward-fusion-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <app-fusion-table [headers]="headers" [rowData]=fusionRows>
            <app-compendium-navbar></app-compendium-navbar>
        </app-fusion-table>
    `
})
export class ForwardFusionTableComponent implements OnInit, OnDestroy {
    static readonly HEADERS = {
        left: 'Ingredient 2',
        right: 'Result'
    };

    compendium: Compendium;
    fusionChart: FusionChart;
    currentDemon: string;

    subscriptions: Subscription[] = [];
    fusionRows: FusionRow[] = [];
    headers = ForwardFusionTableComponent.HEADERS;

    constructor(
        private fusionDataService: FusionDataService,
        private currentDemonService: CurrentDemonService,
        private changeDetector: ChangeDetectorRef
    ) { }

    ngOnInit() {
        const subs: { subject: BehaviorSubject<any>, prop: string }[] = [
            { subject: this.fusionDataService.compendiumBS, prop: 'compendium' },
            { subject: this.fusionDataService.fusionChartBS, prop: 'fusionChart' },
            { subject: this.currentDemonService.currentNameBS, prop: 'currentDemon' },
        ];

        for (const { subject, prop } of subs) {
            this.subscriptions.push(subject.subscribe(val => {
                this[prop] = val;
                this.getForwardFusions();
            }));
        }
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    getForwardFusions() {
        if (this.compendium && this.fusionChart && this.currentDemon) {
            this.fusionRows = calculateForwardFusions(this.currentDemon, this.compendium, this.fusionChart);
            this.changeDetector.detectChanges();
        }
    }
}
