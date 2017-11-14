'use strict';

var App = App || {};
App.Services = App.Services || {};


(function(){

	var id = 1;

	var Student = function(args) {

		var student = {
			id: id,
			get fullName () {
				return this.name + ' ' + this.lastname;
			},
			get searchText () {
				return [this.name, this.lastname, this.phone].join(' ');
			}
		};

		id++;

		return Object.assign(student, args);

	};


	var StudentService = function() {

		var	students = [],
				add = (name, lastname, age) => {
					students.push(new Student(name, lastname, age));
					App.Core.EventBus.fire('students_update');
				},
				remove = (id) => { 
					var index = students.findIndex( 
						student => student.id === id
					);
					students.splice(index, 1);
					App.Core.EventBus.fire('students_update');
				},
				get = (id) => {
					return students.find( (student) => student.id === parseInt(id) );
				},
				getAll = () => students,
				search = (phrase) => {
					var StudentIndexArray = students.map(
						(student)=> {
							return {
								search: student.searchText,
								id: student.id
							};
						});

					return StudentIndexArray.filter((studentIndex) => {
						if(studentIndex.search.search(phrase) !== -1) 
							return get(studentIndex.id);
					}).map((student) => get(student.id));
			}

		App.Core.EventBus.on('student_add', add);
		App.Core.EventBus.on('student_remove', remove);

		return {
			add: add,
			remove: remove,
			get: get,
			search: search,
			getAll: getAll,
		}
	};

	App.Services.StudentService = new StudentService();

}(this, this.document));