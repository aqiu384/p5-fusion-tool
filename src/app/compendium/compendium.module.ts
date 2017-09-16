import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

// Demons, Skills and Settings
import { CompendiumRoutingModule } from './compendium-routing.module';
import { CompendiumComponent } from './compendium.component';

import {
    DemonListComponent,
    DemonTableHeaderComponent,
    DemonTableRowComponent
} from './demon-list.component';

import {
    SkillListComponent,
    SkillTableHeaderComponent,
    SkillTableRowComponent
} from './skill-list.component';

import { FusionSettingsComponent } from './fusion-settings.component';
import { CompendiumNavbarComponent } from './compendium-navbar.component';

// Demon Entry
import { DemonEntryComponent } from './demon-entry/demon-entry.component';

import {
    DemonSkillsComponent,
    DemonSkillsHeaderComponent,
    DemonSkillsRowComponent
} from './demon-entry/demon-skills.component';

import {
    FusionTableRowComponent,
    FusionTableHeaderComponent,
    FusionTableComponent
} from './demon-entry/fusion-table.component';

import {
    SpecialReverseFusionTableComponent,
    ExceptionReverseFusionTableComponent,
    ReverseFusionTableComponent
} from './demon-entry/reverse-fusion-table.component';

import {
    ForwardFusionTableComponent
} from './demon-entry/forward-fusion-table.component';

import { FusionNavbarComponent } from './demon-entry/fusion-navbar.component';

// Pipes
import {
    SkillCostToStringPipe,
    SkillLevelToStringPipe
} from './pipes';

// Services
import { CurrentDemonService } from './services/current-demon.service';
import { FusionDataService } from './services/fusion-data.service';

@NgModule({
    imports: [
        BrowserModule,
        CompendiumRoutingModule
    ],
    declarations: [
        CompendiumComponent,
        // Demon List
        DemonListComponent,
        DemonTableHeaderComponent,
        DemonTableRowComponent,
        // Skill List
        SkillListComponent,
        SkillTableHeaderComponent,
        SkillTableRowComponent,
        // Demon Skills
        DemonSkillsComponent,
        DemonSkillsHeaderComponent,
        DemonSkillsRowComponent,
        // Fusion Tables
        FusionTableRowComponent,
        FusionTableHeaderComponent,
        FusionTableComponent,
        // Reverse FusionTables
        SpecialReverseFusionTableComponent,
        ExceptionReverseFusionTableComponent,
        ReverseFusionTableComponent,
        // Other Components
        ForwardFusionTableComponent,
        DemonEntryComponent,
        FusionSettingsComponent,
        FusionNavbarComponent,
        CompendiumNavbarComponent,
        // Pipes
        SkillCostToStringPipe,
        SkillLevelToStringPipe
    ],
    providers: [
        Title,
        CurrentDemonService,
        FusionDataService
    ]
})
export class CompendiumModule { }
