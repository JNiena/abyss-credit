import {Files} from "./Files";
import filesystemconfig from "../filesystemconfig";

export class PersistentData {

	private data: any;
	private path: string | undefined;

	public constructor(path: string) {
		this.path = path;
		this.data = filesystemconfig;
	}

	public get(): any {
		return this.data;
	}

	public set(data: any): void {
		this.data = data;
	}

	public save(): void {
		if (this.path !== undefined) {
			Files.delete(this.path);
			Files.write(this.path, JSON.stringify(this.data, null, "\t"));
		}
	}

}