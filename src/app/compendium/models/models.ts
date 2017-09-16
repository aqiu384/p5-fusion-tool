export interface Demon {
    race: string;
    lvl: number;
    name: string;
    inherits: string;
    stats: number[];
    resists: string[];
    skills: { [skill: string]: number; };
    fusion: string;
}

export interface Skill {
    element: string;
    name: string;
    cost: number;
    effect: string;
    learnedBy: { demon: string, level: number }[];
    talk: string;
    fuse: string;
    level: number;
}

export interface ExcludedDemon {
    names: string[];
    excluded: boolean;
}

export interface FusionRecipe {
    name1: string;
    name2: string;
}

export interface FusionTableHeaders {
    left: string;
    right: string;
}

export interface FusionIngredients {
    race: string;
    lvl: number;
    name: string;
}

export interface FusionRow {
    race1: string;
    lvl1: number;
    name1: string;
    race2: string;
    lvl2: number;
    name2: string;
}
