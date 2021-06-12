export class Item {
  name: string;
  date: Date;
  constructor(options: { name: string; date: Date }) {
    this.name = options.name;
    this.date = options.date;
  }
}
