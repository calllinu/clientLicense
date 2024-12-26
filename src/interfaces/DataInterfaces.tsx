const dangerTimesMapping = {
    MORE_THAN_ONE_HOUR: '>1',
    ONE_TWO_HOURS: '1-2',
    TWO_FOUR_HOURS: '2-4',
    FOUR_SIX_HOURS: '4-6',
    FULL_TIME: '8',
};

const formatEngagement = (value: string): string => {
    return value
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
};

export interface DataFeedback {
    id: number;
    organization: string;
    cnp: string;
    salary: string;
    engagement: string;
    overtime: string;
    equipment: string;
    safety: string;
    protection: string;
    dangerTimes: string;
}

export interface TransformedEntry extends Omit<DataFeedback, 'dangerTimes' | 'engagement'> {
    dangerTimes: string;
    engagement: string;
}

export const transformEntries = (entries: DataFeedback[]): TransformedEntry[] => {
    return entries.map(entry => ({
        ...entry,
        dangerTimes: dangerTimesMapping[entry.dangerTimes as keyof typeof dangerTimesMapping] || entry.dangerTimes,
        engagement: formatEngagement(entry.engagement),
    }));
};
