import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-fusion-navbar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <nav>
            <a routerLink="../reverse-fusions" routerLinkActive="active">Reverse Fusions</a>
            <a routerLink="../forward-fusions" routerLinkActive="active">Forward Fusions</a>
        </nav>
    `
})
export class FusionNavbarComponent { }
