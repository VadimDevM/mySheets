export function getCellValue(coords: string): number {
    const mockCellsValuesMock = {
        'C1': 10,
        'C4': 7,
        'A2': 3,
        'B4': 1
    };

    return mockCellsValuesMock[coords];
}

export function atomCalc(value1: number, value2 : number, op: string) {
    switch (op) {
        case '+': {
            return (value1 + value2);
        }
        case '*': {
            return (value1 * value2);
        }
        case '/': {
            return (value1 / value2);
        }
        case '-': {
            return (value1 - value2);
        }
    }
}