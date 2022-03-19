export class Timestamp {

	public static now(): string {
		let date: Date = new Date();
		return date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	}

}