export function removeEmptyValues(obj: any): any {
    if (Array.isArray(obj)) {
        return obj
            .map(removeEmptyValues)
            .filter(item => item !== undefined && item !== null && item !== '' && !(typeof item === 'object' && Object.keys(item).length === 0));
    } else if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj)
                .map(([k, v]) => [k, removeEmptyValues(v)])
                .filter(([_, v]) =>
                    v !== undefined &&
                    v !== null &&
                    v !== '' &&
                    !(typeof v === 'object' && Object.keys(v).length === 0)
                )
        );
    }
    return obj;
}
