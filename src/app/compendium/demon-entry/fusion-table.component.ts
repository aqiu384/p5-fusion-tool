import { Component, ChangeDetectionStrategy, Input, Renderer2 } from '@angular/core';

import { RaceOrder } from '../models/constants';
import { FusionTableHeaders, FusionRow } from '../models/models';

import { SortedTableHeaderComponent, SortedTableComponent } from '../sorted-table/sorted-table.component';

@Component({
    selector: 'tr.app-fusion-table-row',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <td>{{ data.race1 }}</td>
        <td>{{ data.lvl1 }}</td>
        <td><a routerLink="/personas/{{ data.name1 }}">{{ data.name1 }}</a></td>
        <td>{{ data.race2 }}</td>
        <td>{{ data.lvl2 }}</td>
        <td><a routerLink="/personas/{{ data.name2 }}">{{ data.name2 }}</a></td>
    `
})
export class FusionTableRowComponent {
    @Input() data: FusionRow;
}

@Component({
    selector: 'tfoot.app-fusion-table-header',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
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
            <th colspan="3" [style.width.%]="50">{{ headers.left }}</th>
            <th colspan="3" [style.width.%]="50">{{ headers.right }}</th>
        </tr>
        <tr>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[0]">Arcana</th>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[1]">Lvl</th>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[2]">Name</th>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[3]">Arcana</th>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[4]">Lvl</th>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[5]">Name</th>
        </tr>
    `
})
export class FusionTableHeaderComponent extends SortedTableHeaderComponent<FusionRow> {
    static readonly SORT_FUNS: ((f1: FusionRow, f2: FusionRow) => number)[] = [
        (f1, f2) => (RaceOrder[f1.race1] - RaceOrder[f2.race1]) * 100 + f2.lvl1 - f1.lvl1,
        (f1, f2) => f1.lvl1 - f2.lvl1,
        (f1, f2) => f1.name1.localeCompare(f2.name1),
        (f1, f2) => (RaceOrder[f1.race2] - RaceOrder[f2.race2]) * 100 + f2.lvl2 - f1.lvl2,
        (f1, f2) => f1.lvl2 - f2.lvl2,
        (f1, f2) => f1.name2.localeCompare(f2.name2)
    ];

    @Input() headers: FusionTableHeaders;
    sortFuns = FusionTableHeaderComponent.SORT_FUNS;

    constructor(private renderer: Renderer2) {
        super(renderer, FusionTableHeaderComponent.SORT_FUNS[0]);
    }
}

@Component({
    selector: 'app-fusion-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <table class="sticky-header">
            <tfoot #stickyHeader
                class="sticky-header app-fusion-table-header"
                [headers]="headers"
                (sortFunChanged)="sort()">
                <ng-content></ng-content>
            </tfoot>
        </table>
        <table>
            <tfoot class="hidden-header
                app-fusion-table-header"
                [headers]="headers"
                (colWidthsChanged)="stickyHeader.colWidths = $event">
            </tfoot>
            <tbody>
                <tr *ngFor="let data of rowData" class="app-fusion-table-row" [data]="data"></tr>
            </tbody>
        </table>
    `
})
export class FusionTableComponent extends SortedTableComponent<FusionRow> {
    @Input() headers: FusionTableHeaders;
}
