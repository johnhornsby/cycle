// import $ from "jquery";

import Person from "./person";

const jane = new Person("Jane Doe");

// if you want to use jquery, ensure you have added it as dependancy in your require_paths
// $('p').html(`My name is ${me.name}, pleased to meet you!`);
const elm = document.getElementsByTagName('p')[0];
elm.innerHTML = `My name is ${jane.name}, pleased to meet you!`;