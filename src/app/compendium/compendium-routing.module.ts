import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompendiumComponent } from './compendium.component';
import { DemonListComponent } from './demon-list.component';
import { SkillListComponent } from './skill-list.component';
import { FusionSettingsComponent } from './fusion-settings.component';
import { DemonEntryComponent } from './demon-entry/demon-entry.component';
import { ReverseFusionTableComponent } from './demon-entry/reverse-fusion-table.component';
import { ForwardFusionTableComponent } from './demon-entry/forward-fusion-table.component';

const compendiumRoutes: Routes = [
    { path: '', redirectTo: 'personas', pathMatch: 'full' },
    {
        path: '',
        component: CompendiumComponent,
        children: [
            {
                path: 'personas/:demonName',
                component: DemonEntryComponent,
                children: [
                    {
                        path: 'reverse-fusions',
                        component: ReverseFusionTableComponent
                    },
                    {
                        path: 'forward-fusions',
                        component: ForwardFusionTableComponent
                    },
                    {
                        path: '**',
                        redirectTo: 'reverse-fusions',
                        pathMatch: 'full'
                    }
                ]
            },
            {
                path: 'personas',
                component: DemonListComponent
            },
            {
                path: 'skills',
                component: SkillListComponent
            },
            {
                path: 'dlc-settings',
                component: FusionSettingsComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'personas',
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [ RouterModule.forChild(compendiumRoutes) ],
    exports: [ RouterModule ]
})
export class CompendiumRoutingModule { }
