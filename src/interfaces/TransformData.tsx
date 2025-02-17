export function transformData(value: string | undefined): string | undefined {
    if (!value) return undefined;
    return value
        .split('_')
        .map((word, index) => index === 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase())
        .join(' ');
}