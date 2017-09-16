import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'skillCostToString' })
export class SkillCostToStringPipe implements PipeTransform {
    transform(value: number): string {
        if (value === 0) { return 'Auto'; }
        if (value < 100) { return value + '% HP'; }
        return value / 100 + ' SP';
    }
}

@Pipe({ name: 'skillLevelToString' })
export class SkillLevelToStringPipe implements PipeTransform {
    transform(value: number): string {
        return value === 0 ? 'Innate' : value.toString();
    }
}
