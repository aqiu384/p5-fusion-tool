import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { ElementOrder, APP_TITLE } from './models/constants';
import { Skill } from './models/models';
import { Compendium } from './models/compendium';

import { SortedTableHeaderComponent, SortedTableComponent } from './sorted-table/sorted-table.component';
import { FusionDataService } from './services/fusion-data.service';

@Component({
    selector: 'tr.app-skill-table-row',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <td><div class="element-icon {{ data.element }}">{{ data.element }}</div></td>
        <td>{{ data.name }}</td>
        <td>{{ data.cost | skillCostToString }}</td>
        <td>{{ data.effect }}</td>
        <td>
            <ul class="comma-list">
                <li *ngFor="let entry of data.learnedBy">
                    <a routerLink="/personas/{{ entry.demon }}">{{ entry.demon }}</a>
                    ({{ entry.level | skillLevelToString }})
                </li>
            </ul>
        </td>
        <td>
            <ul class="comma-list">
                <li *ngFor="let demon of data.talk">
                    <a routerLink="/personas/{{ demon }}">{{ demon }}</a>
                </li>
            </ul>
        </td>
        <td>
            <ul class="comma-list">
                <li *ngFor="let demon of data.fuse">
                    <a routerLink="/personas/{{ demon }}">{{ demon }}</a>
                </li>
            </ul>
        </td>
    `
})
export class SkillTableRowComponent {
    @Input() data: Skill;
}

@Component({
    selector: 'tfoot.app-skill-table-header',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <tr>
            <th class="navbar-row" colspan="19">
                <app-compendium-navbar></app-compendium-navbar>
            </th>
        </tr>
        <tr>
            <th colspan="4">Skill</th>
            <th colspan="3">How to Acquire</th>
        </tr>
        <tr>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[0]">Element</th>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[1]">Name</th>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[2]">Cost</th>
            <th #widthCol class="sortable" [style.width.%]="30" (click)="sortFun = sortFuns[3]">Effect</th>
            <th #widthCol class="sortable" [style.width.%]="30" (click)="sortFun = sortFuns[4]">Learned By</th>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[5]">Negotiation</th>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[6]">Fusion</th>
        </tr>
    `
})
export class SkillTableHeaderComponent extends SortedTableHeaderComponent<Skill> {
    static readonly SORT_FUNS: ((d1: Skill, d2: Skill) => number)[] = [
        (d1, d2) => (ElementOrder[d1.element] - ElementOrder[d2.element]) * 10000 + d1.cost - d2.cost,
        (d1, d2) => d1.name.localeCompare(d2.name),
        (d1, d2) => d1.cost - d2.cost,
        (d1, d2) => d1.effect.localeCompare(d2.effect),
        (d1, d2) => d2.learnedBy.length - d1.learnedBy.length,
        (d1, d2) => d2.talk.length - d1.talk.length,
        (d1, d2) => d2.fuse.length - d1.fuse.length
    ];

    sortFuns = SkillTableHeaderComponent.SORT_FUNS;

    constructor(private renderer: Renderer2) {
        super(renderer, SkillTableHeaderComponent.SORT_FUNS[0]);
    }
}

@Component({
    selector: 'app-skill-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <table class="sticky-header">
            <tfoot #stickyHeader
                class="sticky-header app-skill-table-header"
                (sortFunChanged)="sort()">
            </tfoot>
        </table>
        <table>
            <tfoot class="hidden-header app-skill-table-header"
                (colWidthsChanged)="stickyHeader.colWidths = $event">
            </tfoot>
            <tbody>
                <tr *ngFor="let data of rowData"
                    class="app-skill-table-row {{ data.unique ? 'skill unique' : null }}"
                    [data]="data">
                </tr>
            </tbody>
        </table>
    `
})
export class SkillListComponent extends SortedTableComponent<Skill> implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    timeout: number;

    constructor(
        private title: Title,
        private fusionDataService: FusionDataService,
        private changeDetector: ChangeDetectorRef,
    ) { super(); }

    ngOnInit() {
        this.title.setTitle(`List of Skills - ${APP_TITLE}`);

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

        const skills = compendium.getAllSkills();
        this.rowData = skills.slice(0, 50);

        this.timeout = setTimeout(() => {
            this.rowData = skills;
            this.changeDetector.detectChanges();
        });
    }
}
