import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { APP_TITLE } from './models/constants';
import { ExcludedDemon } from './models/models';
import { Compendium } from './models/compendium';

import { CompendiumNavbarComponent } from './compendium-navbar.component';
import { FusionDataService } from './services/fusion-data.service';

@Component({
    selector: 'app-fusion-settings',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <table>
            <thead>
                <tr><th class="navbar-row" colspan="6">
                    <app-compendium-navbar></app-compendium-navbar>
                </th></tr>
                <tr><th>Included DLC</th></tr>
            </thead>
            <tbody>
                <tr *ngFor="let demon of excludedDemons">
                    <td>
                        <label>{{ demon.names.join(' and ') }}
                            <input type="checkbox"
                                [checked]="!demon.excluded"
                                (change)="toggleExcludedDemon(demon)">
                        </label>
                    </td>
                </tr>
            </tbody>
        </table>
    `
})
export class FusionSettingsComponent implements OnInit, OnDestroy {
    compendium: Compendium;
    excludedDemons: ExcludedDemon[] = [];
    subscriptions: Subscription[] = [];

    constructor(
        private title: Title,
        private fusionDataService: FusionDataService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.title.setTitle(`DLC Settings - ${APP_TITLE}`);
        this.subscriptions.push(this.fusionDataService.compendiumBS.subscribe(comp => {
            this.compendium = comp;
            this.excludedDemons = this.compendium.getExcludedDemons();
            this.changeDetectorRef.detectChanges();
        }));
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    toggleExcludedDemon(demon: ExcludedDemon) {
        demon.excluded = !demon.excluded;
        this.fusionDataService.updateExcludedDemons(this.excludedDemons);
    }
}
