import {CreditSystem} from "./CreditSystem";
import {PersistentData} from "./PersistentData";
import {Files} from "./Files";
import {Timestamp} from "./Timestamp";

export class FileCreditSystem implements CreditSystem {

	private creditPath: string;
	private storagePath: string;

	public constructor(config: PersistentData) {
		this.creditPath = config.get()["storage"]["users"];
		this.storagePath = config.get()["storage"]["transactions"];
	}

	public balance(id: string): number {
		let balance: number | undefined | null = this.getCredit().get()[id];
		if (balance === undefined || balance === null) {
			this.getCredit().get()[id] = 0;
			this.getCredit().save();
			return 0;
		}
		return balance;
	}

	public give(id: string, amount: number, reason: string): void {
		let data: PersistentData = this.getStorage(id);
		data.get().push({
			"timestamp": Timestamp.now(),
			"amount": amount,
			"reason": reason
		});
		data.save();
		data = this.getCredit();
		data.get()[id] = this.balance(id) + amount;
		data.save();
	}

	public take(id: string, amount: number, reason: string): void {
		this.give(id, -amount, reason);
	}

	private getStorage(id: string): PersistentData {
		let path: string = `${this.storagePath}/${id}.json`;
		if (!Files.exists(path)) {
			Files.create(path);
			Files.write(path, "[]");
		}
		return new PersistentData(path);
	}

	private getCredit(): PersistentData {
		if (!Files.exists(this.creditPath)) {
			Files.create(this.creditPath);
			Files.write(this.creditPath, "{}");
		}
		return new PersistentData(this.creditPath);
	}

}