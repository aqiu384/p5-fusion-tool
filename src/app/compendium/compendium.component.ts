import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { DemonListComponent } from './demon-list.component';

@Component({
    selector: 'app-demon-compendium',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="demon-compendium">
            <router-outlet></router-outlet>
            <div class="center">
                <a href="https://www.youtube.com/watch?v=8eYf3OHqq9s">
                    https://www.youtube.com/watch?v=8eYf3OHqq9s
                </a>
            </div>
        </div>
    `
})
export class CompendiumComponent implements OnInit {
    constructor(private router: Router) { }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                window.scrollTo(0, 0);
            }
        });
    }
}
