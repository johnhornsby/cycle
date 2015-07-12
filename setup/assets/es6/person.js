export default class Person {
	
	constructor(name = "John Doe") {
		this._name = name;

		this._init();
	}


	get name() { return this._name; }


	set name(name = "") { this._name = name; }


	_init() {
		console.log(`My name is ${this.name}`);
	}
}