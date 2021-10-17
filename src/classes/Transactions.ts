import { Transaction } from "./Transaction";

export class Transactions {
    transactions: Transaction[];
    
    constructor (transactions: Transaction[]){
        this.transactions = transactions;
        this.markDuplicates();
    }

    getInvalids () {
        const invalids: Transaction[] = [];
        for(const transaction of this.transactions){
            if(!transaction.isValid()){
                invalids.push(transaction);
            }
        }
        return invalids;
    }

    markDuplicates () {
        const grouped: Record<string, Transaction[]> = {};
        for(const transaction of this.transactions){
            grouped[transaction.reference] = [transaction, ...(grouped[transaction.reference] ? grouped[transaction.reference]: [])];
        }
        for(const groupedTransactions of Object.values(grouped)) {
            if(groupedTransactions.length > 1){
                for(const transaction of groupedTransactions){
                    transaction.addInvalidReason("Duplicate");
                }
            }
        }
    }
}