export class Transaction {
    reference: string;
    iban: string;
    description: string;
    startBalance: number;
    mutation: number;
    endBalance: number;
    invalidReasons: string[] = [];

    constructor (reference: string, iban:string, description:string, startBalance: number, mutation: number, endBalance: number) {
        this.reference = reference;
        this.iban = iban;
        this.description = description;
        this.startBalance = startBalance;
        this.mutation = mutation;
        this.endBalance = endBalance;
        this.validateEndBalance();
    }

    isValid() {
        return this.invalidReasons.length === 0;
    }

    validateEndBalance() {
        if(Number((this.startBalance + this.mutation).toFixed(2)) !== this.endBalance){
            this.addInvalidReason("Balance is incorrect");
        }
    }

    addInvalidReason(reason: string){
        this.invalidReasons.push(reason);
    }
}