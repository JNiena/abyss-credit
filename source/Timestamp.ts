export class Timestamp {
	public static now(): string {
		const date: Date = new Date();
		return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	}
}