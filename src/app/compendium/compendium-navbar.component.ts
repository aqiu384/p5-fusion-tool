import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-compendium-navbar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <nav>
            <a routerLink="/personas" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Personas</a>
            <a routerLink="/skills" routerLinkActive="active">Skills</a>
            <a routerLink="/dlc-settings" routerLinkActive="active">DLC Settings</a>
        </nav>
    `
})
export class CompendiumNavbarComponent { }
