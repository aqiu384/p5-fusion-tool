import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { Compendium } from '../models/compendium';
import { FusionTypes } from '../models/constants';
import { FusionRow, FusionIngredients } from '../models/models';
import { FusionChart } from '../models/fusion-chart';
import { calculateReverseFusions } from '../models/reverse-fusion-calculator';

import { FusionDataService } from '../services/fusion-data.service';
import { CurrentDemonService } from '../services/current-demon.service';

@Component({
    selector: 'app-special-reverse-fusion-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <table>
            <thead>
                <tr>
                    <th class="navbar-row" colspan="6">
                        <ng-content></ng-content>
                    </th>
                </tr>
                <tr>
                    <th class="navbar-row" colspan="6">
                        <app-fusion-navbar></app-fusion-navbar>
                    </th>
                </tr>
                <tr>
                    <th colspan=3>Special Fusion Recipe</th>
                </tr>
                <tr>
                    <th>Arcana</th>
                    <th>Lvl</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let ingredient of ingredients">
                    <td>{{ ingredient.race }}</td>
                    <td>{{ ingredient.lvl }}</td>
                    <td><a routerLink="/personas/{{ ingredient.name }}">{{ ingredient.name }}</a></td>
                </tr>
            </tbody>
        </table>
    `
})
export class SpecialReverseFusionTableComponent {
    @Input() ingredients: FusionIngredients;
}

@Component({
    selector: 'app-exception-reverse-fusion-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <table>
            <thead>
                <tr>
                    <th class="navbar-row">
                        <ng-content></ng-content>
                    </th>
                </tr>
                <tr>
                    <th class="navbar-row">
                        <app-fusion-navbar></app-fusion-navbar>
                    </th>
                </tr>
                <tr>
                    <th>Special Fusion Condition</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td *ngIf="fusionType === 'accident'">Recruitment Only</td>
                    <td *ngIf="fusionType === 'excluded'">DLC not Purchased</td>
                </tr>
            </tbody>
        </table>
    `
})
export class ExceptionReverseFusionTableComponent {
    @Input() fusionType: string;
}

@Component({
    selector: 'app-reverse-fusion-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <app-fusion-table *ngIf="fusionType === 'normal'"
            [rowData]="fusionRows" [headers]="headers">
            <app-compendium-navbar></app-compendium-navbar>
        </app-fusion-table>
        <app-special-reverse-fusion-table *ngIf="fusionType === 'special'"
            [ingredients]="fusionRows">
            <app-compendium-navbar></app-compendium-navbar>
        </app-special-reverse-fusion-table>
        <app-exception-reverse-fusion-table *ngIf="fusionType === 'accident' || fusionType === 'excluded'"
            [fusionType]="fusionType">
            <app-compendium-navbar></app-compendium-navbar>
        </app-exception-reverse-fusion-table>
    `
})
export class ReverseFusionTableComponent implements OnInit, OnDestroy {
    static readonly HEADERS = {
        left: 'Ingredient 1',
        right: 'Ingredient 2'
    };

    headers = ReverseFusionTableComponent.HEADERS;
    compendium: Compendium;
    fusionChart: FusionChart;
    currentDemon: string;

    subscriptions: Subscription[] = [];
    fusionType: string;
    fusionRows: (FusionRow|FusionIngredients)[];

    constructor(
        private fusionDataService: FusionDataService,
        private currentDemonService: CurrentDemonService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.subscriptions.push(
            this.fusionDataService.compendiumBS.subscribe(compendium => {
                this.compendium = compendium;
                this.getReverseFusions();
            }));

        this.subscriptions.push(
            this.fusionDataService.fusionChartBS.subscribe(fusionChart => {
                this.fusionChart = fusionChart;
                this.getReverseFusions();
            }));

        this.subscriptions.push(
            this.currentDemonService.currentNameBS.subscribe(name => {
                this.currentDemon = name;
                this.getReverseFusions();
            }));
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    getReverseFusions() {
        if (this.compendium && this.fusionChart && this.currentDemon) {
            const { type, data } = calculateReverseFusions(this.currentDemon, this.compendium, this.fusionChart);
            this.fusionType = type;
            this.fusionRows = data;
            this.changeDetectorRef.detectChanges();
        }
    }
}
