import { Races, ResistanceElements, BaseStats, FusionTypes, EXCLUDED_DEMONS_KEY } from './constants';
import { Demon, Skill, ExcludedDemon } from './models';

import * as DEMON_DATA_JSON from '../data/demon-data.json';
import * as SKILL_DATA_JSON from '../data/skill-data.json';
import * as SPECIAL_RECIPES_JSON from '../data/special-recipes.json';
import * as DLC_DEMONS from '../data/dlc-demons.json';

export class Compendium {
    private demons: { [name: string]: Demon };
    private skills: { [name: string]: Skill };
    private specialRecipes: { [name: string]: string [] };
    private excludedDemons: ExcludedDemon[];
    private normalExceptions: { [name: string]: string };

    private invertedDemons: { [race: string]: { [lvl: number]: string } };
    private allIngredients: { [race: string]: number[] };
    private allResults: { [race: string]: number[] };
    private allDemons: Demon[];
    private allSkills: Skill[];

    constructor() {
        this.initImportedData();
        this.updateDerivedData();
    }

    initImportedData() {
        const demons: { [name: string]: Demon } = {};
        const skills: { [name: string]: Skill } = {};
        const specialRecipes: { [name: string]: string [] } = {};
        const inversions: { [race: string]: { [lvl: number]: string } } = {};
        const excludedDemons: ExcludedDemon[] = [];
        const normalExceptions: { [name: string]: string } = {};

        for (const [name, json] of Object.entries(DEMON_DATA_JSON)) {
            demons[name] = Object.assign({}, json, {
                name,
                stats: BaseStats.map(val => json.stats[val]),
                resists: ResistanceElements.map(val => json.resists[val] || 'no'),
                fusion: FusionTypes.Normal
            });
        }

        for (const [name, json] of Object.entries(SKILL_DATA_JSON)) {
            skills[name] = Object.assign({ unique: '' }, json, {
                name,
                cost: json.cost || 0,
                learnedBy: [],
                talk: json.talk ? json.talk.split(', ') : [],
                fuse: json.fuse ? json.fuse.split(', ') : []
            });
        }

        for (const [name, json] of Object.entries(SPECIAL_RECIPES_JSON)) {
            specialRecipes[name] = json;

            if (json.length === 2) {
                normalExceptions[json[0]] = json[1];
                normalExceptions[json[1]] = json[0];
            }

            demons[name].fusion = (json.length > 0) ? FusionTypes.Special : FusionTypes.Accident;
        }

        for (const race of Races) {
            inversions[race] = {};
        }

        for (const [name, demon] of Object.entries(demons)) {
            inversions[demon.race][demon.lvl] = name;
        }

        for (const demon of Object.values(demons)) {
            for (const name of Object.keys(demon.skills)) {
                skills[name].learnedBy.push({
                    demon: demon.name,
                    level: demon.skills[name]
                });
            }
        }

        for (const [index, dlcTuple] of Object.entries(DLC_DEMONS)) {
            excludedDemons.push({ names: dlcTuple.split(','), excluded: true });
        }

        this.demons = demons;
        this.skills = skills;
        this.specialRecipes = specialRecipes;
        this.invertedDemons = inversions;
        this.excludedDemons = excludedDemons;
        this.normalExceptions = normalExceptions;
    }

    updateDerivedData() {
        const demonEntries = Object.assign({}, this.demons);
        const skills = Object.keys(this.skills).map(name => this.skills[name]);

        const ingredients: { [race: string]: number[] } = {};
        const results: { [race: string]: number[] } = {};

        for (const race of Races) {
            ingredients[race] = [];
            results[race] = [];
        }

        for (const [name, demon] of Object.entries(this.demons)) {
            if (!this.isElementDemon(name)) {
                ingredients[demon.race].push(demon.lvl);
            }

            if (!this.specialRecipes.hasOwnProperty(name)) {
                results[demon.race].push(demon.lvl);
            }
        }

        for (const race of Races) {
            ingredients[race].sort((a, b) => a - b);
            results[race].sort((a, b) => a - b);
        }

        for (const { names, excluded } of this.excludedDemons) {
            if (excluded) {
                for (const name of names) {
                    const { race, lvl } = this.demons[name];
                    delete demonEntries[name];

                    ingredients[race] = ingredients[race].filter(l => l !== lvl);
                    results[race] = results[race].filter(l => l !== lvl);
                }
            }
        }

        this.allDemons = Object.keys(demonEntries).map(name => demonEntries[name]);
        this.allSkills = skills;
        this.allIngredients = ingredients;
        this.allResults = results;
    }

    getDemon(name: string): Demon {
        return this.demons[name];
    }

    getAllDemons(): Demon[] {
        return this.allDemons;
    }

    getSkill(name: string): Skill {
        return this.skills[name];
    }

    getAllSkills(): Skill[] {
        return this.allSkills;
    }

    getIngredientDemonLvls(race: string): number[] {
        return this.allIngredients[race];
    }

    getResultDemonLvls(race: string): number[] {
        return this.allResults[race];
    }

    getSpecialFusionIngredients(name: string) {
        return this.specialRecipes[name] || [];
    }

    getSpecialFusionResults() {
        return Object.keys(this.specialRecipes).filter(name => !this.isElementDemon(name));
    }

    getElementDemons(name: string) {
        return Object.keys(this.specialRecipes).filter(demon => this.isElementDemon(demon) && demon !== name);
    }

    getNormalException(name: string): string {
        return this.normalExceptions[name];
    }

    getExcludedDemons(): { names: string[], excluded: boolean }[] {
        return this.excludedDemons;
    }

    setExcludedDemons(excludedDemons: ExcludedDemon[]) {
        this.excludedDemons = excludedDemons;
        this.updateDerivedData();
    }

    reverseLookupDemon(race: string, lvl: number): string {
        return this.invertedDemons[race][lvl];
    }

    isElementDemon(name: string) {
        return this.specialRecipes.hasOwnProperty(name) && this.specialRecipes[name].length === 0;
    }

    isRecruitmentOnly(name: string) {
        return this.isElementDemon(name);
    }

    isExcludedDemon(name: string) {
        const { race, lvl } = this.getDemon(name);
        return this.allIngredients[race].indexOf(lvl) === -1;
    }

}
