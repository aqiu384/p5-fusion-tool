import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { BaseStats, ResistanceElements, RaceOrder, ElementOrder, ResistanceOrder, APP_TITLE } from './models/constants';
import { Demon } from './models/models';
import { Compendium } from './models/compendium';

import { SortedTableHeaderComponent, SortedTableComponent } from './sorted-table/sorted-table.component';
import { FusionDataService } from './services/fusion-data.service';

@Component({
    selector: 'tr.app-demon-table-row',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <td>{{ data.race }}</td>
        <td>{{ data.lvl }}</td>
        <td><a routerLink="/personas/{{ data.name }}">{{ data.name }}</a></td>
        <td><div class="element-icon {{ data.inherits }}">{{ data.inherits }}</div></td>
        <td *ngFor="let stat of data.stats">{{ stat }}</td>
        <td *ngFor="let resist of data.resists" class="resists {{ resist }}">{{ resist }}</td>
    `
})
export class DemonTableRowComponent {
    @Input() data: Demon;
}

@Component({
    selector: 'tfoot.app-demon-table-header',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <tr>
            <th class="navbar-row" colspan="19">
                <app-compendium-navbar></app-compendium-navbar>
            </th>
        </tr>
        <tr>
            <th colspan="4">Persona</th>
            <th colspan="5">Base Stats</th>
            <th colspan="10">Resistances</th>
        </tr>
        <tr>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[0]">Arcana</th>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[1]">Lvl</th>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[2]">Name</th>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[3]">Inherits</th>
            <th *ngFor="let pair of statColIndices"
                #widthCol
                class="sortable"
                (click)="sortFun = sortFuns[pair.index]">
                {{ pair.stat }}
            </th>
            <th *ngFor="let pair of elemColIndices"
                #widthCol
                class="sortable"
                (click)="sortFun = sortFuns[pair.index]">
                <div class="element-icon {{ pair.element }}"></div>
            </th>
        </tr>
    `
})
export class DemonTableHeaderComponent extends SortedTableHeaderComponent<Demon> {
    static readonly STAT_COL_INDICES = BaseStats.map((stat, i) => ({ stat, index: i + 4 }));
    static readonly ELEM_COL_INDICES = ResistanceElements.map((element, i) => ({ element, index: i + 9 }));
    static readonly SORT_FUNS: ((a: Demon, b: Demon) => number)[] = [
        (d1, d2) => (RaceOrder[d1.race] - RaceOrder[d2.race]) * 100 + d2.lvl - d1.lvl,
        (d1, d2) => d1.lvl - d2.lvl,
        (d1, d2) => d1.name.localeCompare(d2.name),
        (d1, d2) => ElementOrder[d1.inherits] - ElementOrder[d2.inherits]
    ].concat(
        BaseStats.map((stat, index) =>
            (d1, d2) => d2.stats[index] - d1.stats[index]),
        ResistanceElements.map((element, index) =>
            (d1, d2) => ResistanceOrder[d2.resists[index]] - ResistanceOrder[d1.resists[index]])
    );

    statColIndices = DemonTableHeaderComponent.STAT_COL_INDICES;
    elemColIndices = DemonTableHeaderComponent.ELEM_COL_INDICES;
    sortFuns = DemonTableHeaderComponent.SORT_FUNS;

    constructor(private renderer: Renderer2) {
        super(renderer, DemonTableHeaderComponent.SORT_FUNS[0]);
    }
}

@Component({
    selector: 'app-demon-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <table class="sticky-header">
            <tfoot #stickyHeader
                class="app-demon-table-header sticky-header"
                (sortFunChanged)="sort()">
            </tfoot>
        </table>
        <table>
            <tfoot class="app-demon-table-header hidden-header"
                (colWidthsChanged)="stickyHeader.colWidths = $event">
            </tfoot>
            <tbody>
                <tr *ngFor="let data of rowData"
                    class="app-demon-table-row {{ data.fusion !== 'normal' ?
                        'fusion ' + data.fusion :
                        null }}"
                    [data]="data">
                </tr>
            </tbody>
        </table>
    `
})
export class DemonListComponent extends SortedTableComponent<Demon> implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    timeout: number;

    constructor(
        private title: Title,
        private fusionDataService: FusionDataService,
        private changeDetector: ChangeDetectorRef
    ) { super(); }

    ngOnInit() {
        this.title.setTitle(`List of Personas - ${APP_TITLE}`);

        this.subscriptions.push(
            this.fusionDataService.compendiumBS.subscribe(
                this.onCompendiumUpdated.bind(this)));
    }

    ngOnDestroy() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    onCompendiumUpdated(compendium: Compendium) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        const demons = compendium.getAllDemons();
        this.rowData = demons.slice(0, 50);
        this.timeout = setTimeout(() => {
            this.rowData = demons;
            this.changeDetector.detectChanges();
        });
    }
}
