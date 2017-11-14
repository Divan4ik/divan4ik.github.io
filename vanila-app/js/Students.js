'user strict';

var Students;

(function(w, d) {

  var studentService,
      renderer,
      node,
      sector;

  var StudentsModule = function(node) {

    var wrapperTpl = d.querySelector('#StudentsModule'),
        studentTpl = d.querySelector('#studentTpl'),
        studentFormTpl = d.querySelector('#studentFormTpl'),
        items,
        studentForm;

    function render() {
      renderer.clear(items);

      var students = studentService.getAll();

      if(students.length < 1) {
        items.appendChild(renderer.render('<div class="item">Записей не найдено</div>'));
      } else {
        students.forEach(function(student){
          items.appendChild( renderer.render(studentTpl, student) )
        });
      }
    }

    function bindEvents() {

      /**
      * TABLE
      */
      sector.addEventListener('click', function(event) {

        if (event.target.classList.contains('remove')) {
          var item = event.target.parentNode;
          var id = parseInt(item.getAttribute('data-id'))
          App.Core.EventBus.fire('student_remove', id);
        }

        if (event.target.classList.contains('add')) {
          studentForm.classList.add('in');
        }

      }, false);

      /**
      * Form
      */
      studentForm.addEventListener('click', function(event) {

        if (event.target.classList.contains('submit')) {
           App.Core.EventBus.fire('student_add', getFormData());
          studentForm.classList.remove('in');
        }

        if (event.target.classList.contains('abort')) {
          studentForm.classList.remove('in');
        }
      }, false);

       App.Core.EventBus.on('students_update', render);
    }

    function getFormData() {
      var form = {};
      form.name = d.querySelector('[name="name"]').value;
      form.lastname = d.querySelector('[name="lastname"]').value;
      form.phone = d.querySelector('[name="phone"]').value;
      return form;
    }

    function add() {
      studentService.add();
      render();
    }

    function remove() {
      studentService.remove(id);
      render();
    }

    function init() {
      studentService = App.Services.StudentService;
      renderer = new App.Core.Renderer();
      
      studentService.add({name:'John', lastname:'Dhoe', phone:'+7 905 7974388'});
      studentService.add({name:'Annita', lastname:'', phone:'+7 905 7974388'});
      studentService.add({name:'Mia', lastname:'Salvadore', phone:'+7 905 7974388'});
      studentService.add({name:'Max', lastname:'Payne', phone:'+7 905 7974388'});
      studentService.add({name:'Leo', lastname:'Jenkins', phone:'+7 905 7974388'});
      studentService.add({name:'Trinity', lastname:'Dhoe', phone:'+7 905 7974388'});
      studentService.add({name:'John', lastname:'Dhoe', phone:'+7 905 7974388'});
      studentService.add({name:'Annita', lastname:'', phone:'+7 905 7974388'});
      studentService.add({name:'Mia', lastname:'Salvadore', phone:'+7 905 7974388'});
      studentService.add({name:'Max', lastname:'Payne', phone:'+7 905 7974388'});
      studentService.add({name:'Leo', lastname:'Jenkins', phone:'+7 905 7974388'});
      studentService.add({name:'Trinity', lastname:'Dhoe', phone:'+7 905 7974388'});

      var wrapper = renderer.render(wrapperTpl);
      studentForm = renderer.render(studentFormTpl);
      wrapper.appendChild(studentForm);
      node.appendChild(wrapper);

      items = node.querySelector('.items');
      studentForm = node.querySelector('.student-form');
      sector = items.parentNode;

      render();
      bindEvents();
    }
    
    init();

    return {};

  };

  Students = StudentsModule;

})(this, this.document);