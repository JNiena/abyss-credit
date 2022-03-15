export interface CreditSystem {

	give(id: string, amount: number, reason: string): void;

	take(id: string, amount: number, reason: string): void;

	balance(id: string): number;

}