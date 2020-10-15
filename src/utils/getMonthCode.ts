export class MonthCode {
    public readonly month: number = 0;
    public readonly year: number = 0;

    constructor(date: Date = new Date()) {
        this.month = date.getMonth();
        this.year = date.getFullYear();
    }

    public toString(): string {
        return `${this.year}${this.month.toString().padStart(2, "0")}`;
    }

    public getNext(): MonthCode {
        return new MonthCode(new Date(this.year, this.month + 1));
    }

    public getPrev(): MonthCode {
        return new MonthCode(new Date(this.year, this.month - 1));
    }
}

export default MonthCode;
