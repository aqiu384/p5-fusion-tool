function getEnumOrder(target: string[]): { [key: string]: number } {
    const result = {};
    for (let i = 0; i < target.length; i++) {
        result[target[i]] = i;
    }
    return result;
}

export const Races = [
    'Fool',
    'Magician',
    'Priestess',
    'Empress',
    'Emperor',
    'Hierophant',
    'Lovers',
    'Chariot',
    'Justice',
    'Hermit',
    'Fortune',
    'Strength',
    'Hanged',
    'Death',
    'Temperance',
    'Devil',
    'Tower',
    'Star',
    'Moon',
    'Sun',
    'Judgement'
];

export const ResistanceElements = [
    'phys',
    'gun',
    'fire',
    'ice',
    'elec',
    'wind',
    'nuke',
    'psy',
    'bless',
    'curse'
];

export const SkillElements = ResistanceElements.concat(
    'ailment',
    'healing',
    'almighty',
    'support',
    'passive'
);

export const BaseStats = [
    'st', 'ma', 'en', 'ag', 'lu'
];

export const ResistanceLevels = [
    'wk', 'no', 'rs', 'nu', 'rp', 'ab'
];

export const FusionTypes = {
    Normal: 'normal',
    Special: 'special',
    Accident: 'accident',
    Excluded: 'excluded'
};

export const RaceOrder = getEnumOrder(Races);
export const ElementOrder = getEnumOrder(SkillElements);
export const ResistanceOrder = getEnumOrder(ResistanceLevels);

export const PREVIOUS_DEMON_KEYS = ['p5-tool/hasDlc'];
export const EXCLUDED_DEMONS_KEY = 'p5-fusion-calculator/excluded-demons';
export const APP_TITLE = 'Persona 5 Fusion Tool';
