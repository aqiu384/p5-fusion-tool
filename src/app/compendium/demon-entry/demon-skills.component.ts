import { Component, ChangeDetectionStrategy, Input, OnChanges, Renderer2 } from '@angular/core';

import { ElementOrder } from '../models/constants';
import { Skill } from '../models/models';
import { Compendium } from '../models/compendium';

import { SortedTableHeaderComponent, SortedTableComponent } from '../sorted-table/sorted-table.component';

@Component({
    selector: 'tr.app-demon-skills-row',
    changeDetection: ChangeDetectionStrategy.Default,
    template: `
        <td><div class="element-icon {{ data.element }}">{{ data.element }}</div></td>
        <td>{{ data.name }}</td>
        <td>{{ data.cost | skillCostToString }}</td>
        <td>{{ data.effect }}</td>
        <td>{{ data.level | skillLevelToString }}</td>
    `
})
export class DemonSkillsRowComponent {
    @Input() data: Skill;
}

@Component({
    selector: 'tfoot.app-demon-skills-header',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <tr>
            <th colspan="5">Learned Skills</th>
        </tr>
        <tr>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[0]">Element</th>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[1]">Name</th>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[2]">Cost</th>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[3]">Effect</th>
            <th #widthCol class="sortable" (click)="sortFun = sortFuns[4]">Level</th>
        </tr>
    `
})
export class DemonSkillsHeaderComponent extends SortedTableHeaderComponent<Skill> {
    static readonly SORT_FUNS: ((a: Skill, b: Skill) => number)[] = [
        (d1, d2) => (ElementOrder[d1.element] - ElementOrder[d2.element]) * 10000 + d1.cost - d2.cost,
        (d1, d2) => d1.name.localeCompare(d2.name),
        (d1, d2) => d1.cost - d2.cost,
        (d1, d2) => d1.effect.localeCompare(d2.effect),
        (d1, d2) => (d1.level - d2.level) * 100 + ElementOrder[d1.element] - ElementOrder[d2.element]
    ];

    sortFuns = DemonSkillsHeaderComponent.SORT_FUNS;

    constructor(private renderer: Renderer2) {
        super(renderer, DemonSkillsHeaderComponent.SORT_FUNS[4]);
    }
}

@Component({
    selector: 'app-demon-skills',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <table class="sticky-header">
            <tfoot #stickyHeader
                class="sticky-header app-demon-skills-header"
                (sortFunChanged)="sort()">
            </tfoot>
        </table>
        <table>
            <tfoot class="hidden-header app-demon-skills-header"
                (colWidthsChanged)="stickyHeader.colWidths = $event">
            </tfoot>
            <tbody>
                <tr *ngFor="let data of rowData"
                    class="app-demon-skills-row {{ data.unique ? 'skill unique' : null }}"
                    [data]="data">
                </tr>
            </tbody>
        </table>
    `
})
export class DemonSkillsComponent extends SortedTableComponent<Skill> implements OnChanges {
    @Input() compendium: Compendium;
    @Input() skillLevels: { [id: string]: number };

    ngOnChanges(): void {
        this.setSkills(Object.keys(this.skillLevels).map(name => this.compendium.getSkill(name)));
    }

    setSkills(skills: Skill[]) {
        for (const skill of skills) {
            skill.level = this.skillLevels[skill.name];
        }

        this.rowData = skills;
    }
}
