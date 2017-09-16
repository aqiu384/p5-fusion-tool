import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Type } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { BaseStats, ResistanceElements, APP_TITLE } from '../models/constants';
import { Demon } from '../models/models';
import { Compendium } from '../models/compendium';

import { DemonSkillsComponent } from './demon-skills.component';
import { CompendiumNavbarComponent } from '../compendium-navbar.component';
import { CurrentDemonService } from '../services/current-demon.service';
import { FusionDataService } from '../services/fusion-data.service';

@Component({
    selector: 'app-demon-entry',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-container *ngIf="demon">
            <table>
                <thead>
                    <tr>
                        <th colSpan="{{ statHeaders.length }}">
                            Lvl {{ demon.lvl }}
                            {{ demon.race }}
                            {{ name }}
                        </th>
                    </tr>
                    <tr>
                        <th *ngFor="let stat of statHeaders">{{ stat }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td *ngFor="let stat of demon.stats">{{ stat }}</td>
                    </tr>
                </tbody>
            </table>
            <table>
                <thead>
                    <tr>
                        <th colSpan="{{ resistanceHeaders.length }}">Elemental Resistances</th>
                    </tr>
                    <tr>
                        <th *ngFor="let element of resistanceHeaders">
                            <div class="element-icon {{ element }}"></div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td *ngFor="let resist of demon.resists"
                        class="resists {{ resist }}">
                            {{ resist }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <app-demon-skills [skillLevels]="demon.skills" [compendium]="compendium"></app-demon-skills>
            <router-outlet></router-outlet>
        </ng-container>
        <ng-container *ngIf="!demon">
            <table>
                <thead>
                    <tr><th class="navbar-row">
                        <app-compendium-navbar></app-compendium-navbar>
                    </th></tr>
                    <tr><th>Entry for {{ name }}</th></tr>
                </thead>
                <tbody>
                    <tr><td>Error: Could not find entry in compendium for {{ name }}</td></tr>
                </tbody>
            </table>
        </ng-container>
    `
})
export class DemonEntryComponent implements OnInit, OnDestroy {
    statHeaders = BaseStats;
    resistanceHeaders = ResistanceElements;

    compendium: Compendium;
    subscriptions: Subscription[] = [];

    name: string;
    demon: Demon;

    constructor(
        private route: ActivatedRoute,
        private title: Title,
        private fusionDataService: FusionDataService,
        private currentDemonService: CurrentDemonService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        const subs: { subject: BehaviorSubject<any>, prop: string }[] = [
            { subject: this.fusionDataService.compendiumBS, prop: 'compendium' },
            { subject: this.currentDemonService.currentNameBS, prop: 'name' },
        ];

        for (const { subject, prop } of subs) {
            this.subscriptions.push(subject.subscribe(val => {
                this[prop] = val;
                this.getDemonEntry();
            }));
        }

        this.route.params.subscribe(params => {
            this.currentDemonService.currentNameBS.next(params['demonName']);
        });
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    getDemonEntry() {
        if (this.compendium && this.name) {
            this.demon = this.compendium.getDemon(this.name);
            this.title.setTitle(`${this.name} - ${APP_TITLE}`);
            this.changeDetectorRef.detectChanges();
        }
    }
}
