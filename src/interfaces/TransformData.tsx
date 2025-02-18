import {WorkTime} from "./enums/WorktimeEnum.tsx";

export function transformData(value: string | undefined): string | undefined {
    if (!value) return undefined;
    return value
        .split('_')
        .map((word, index) => index === 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase())
        .join(' ');
}

export function transformWorktime(workTime: string | undefined) {
    if (workTime) {
        const mapping: Record<string, WorkTime> = {
            MORE_THAN_ONE_HOUR: WorkTime.MORE_THAN_ONE_HOUR,
            ONE_TWO_HOURS: WorkTime.ONE_TWO_HOURS,
            TWO_FOUR_HOURS: WorkTime.TWO_FOUR_HOURS,
            FOUR_SIX_HOURS: WorkTime.FOUR_SIX_HOURS,
            FULL_TIME: WorkTime.FULL_TIME,
        };
        return mapping[workTime];
    }
}