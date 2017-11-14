'user strict';

var Abonements;

(function(w, d) {

  var abonementService,
      studentService,
      renderer,
      node,
      sector;

  var AbonementsModule = function(node) {

    var wrapperTpl = d.querySelector('#AbonementsModule'),
        abonementTpl = d.querySelector('#abonementTpl'),
        abonementFormTpl = d.querySelector('#abonementFormTpl'),
        items,
        abonementForm;

    function render() {
      renderer.clear(items);
      var abonements = abonementService.getAll();

      if(abonements.length < 1) {
        items.appendChild(renderer.render('<div class="item">Записей не найдено</div>'));
      } else {
        abonements.forEach(function(abonement){
          items.appendChild( renderer.render(abonementTpl, abonement) )
        });
      }

      updateForm()
    }

    function bindEvents() {

      /**
      * TABLE
      */
      sector.addEventListener('click', function(event) {

        if (event.target.classList.contains('remove')) {
          var item = event.target.parentNode;
          var id = parseInt(item.getAttribute('data-id'))
          App.Core.EventBus.fire('abonement_remove', id);
        }

        if (event.target.classList.contains('add')) {
          abonementForm.classList.add('in');
        }

      }, false);

      /**
      * Form
      */
      abonementForm.addEventListener('click', function(event) {

        if (event.target.classList.contains('submit')) {
           App.Core.EventBus.fire('abonement_add', getFormData());
           abonementForm.classList.remove('in');
        }

        if (event.target.classList.contains('abort')) {
          abonementForm.classList.remove('in');
        }
      }, false);

       App.Core.EventBus.on('abonements_update', render);
       App.Core.EventBus.on('students_update', updateForm);
    }

    function getFormData() {
      var form = {};
      form.client_id = d.querySelector('[name="client_id"]').value;
      form.till = d.querySelector('[name="till"]').value;
      return form;
    }

    function updateForm() {

      var students = studentService.getAll();
      var fragment = d.createDocumentFragment();
      var studentsSelectInput = abonementForm.querySelector('select');
      
      renderer.clear(studentsSelectInput);
      students.forEach(function(student) {
        fragment.appendChild(
          renderer.render('<option value="{{id}}">{{name}} {{lastname}}</option>', student)
          );
      });
      studentsSelectInput.appendChild(fragment);
    }

    function AbonementPage() {
      
    }


    function init() {
      abonementService = App.Services.AbonementService;
      studentService = App.Services.StudentService;
      renderer = new App.Core.Renderer();

      var wrapper = renderer.render(wrapperTpl);
      abonementForm = renderer.render(abonementFormTpl);
      wrapper.appendChild(abonementForm);
      node.appendChild(wrapper);

      items = node.querySelector('.items');
      abonementForm = node.querySelector('.abonement-form');
      sector = items.parentNode;

      render();
      bindEvents();
    }
    
    init();

    return {};

  };

  Abonements = AbonementsModule;

})(this, this.document);