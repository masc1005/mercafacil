export function formatName(name: string, storeName: string): string {
    const formattedName = 
        name.replace("Srta. ", '')
            .replace("Sr. ", '')
            .replace("Sra. ", '');

    if (storeName === 'macapa') {
        return formattedName.toUpperCase();
    }

    return formattedName;
}

function formatStoreName(name: string): string {
    return name.toLowerCase();
}