$(document).ready(function(){
  loadTasks();
  
  function renderTasks(object) {
    $('ul.health').html('');
    $('ul.wealth').html('');
    $('ul.soul').html('');
    var headers = [];
    var $target = $('#accordion').find('h3');
    $target.each(function(){
      var header = $(this).text().toLowerCase().trim();
      if (headers.indexOf(header) == -1) {
        headers.push(header);
      }
    });
    for (var x in object) {
      var task = object[x];
      var category = task.category.toLowerCase();
      var description = task.description;
      var $ul = $('ul.'+category);
      if(headers.indexOf(category) > -1) {
        $ul.append('<li><a href="#" class="delete btn btn-danger" rel="' + task._id + '"><i class="glyphicon glyphicon-trash"></i></a>'+description+'</li>');   
      }
    }
    $("#accordion").accordion({
      header: "h3",
      icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" }
    });
    $( "#accordion li" ).draggable({
          appendTo: "body",
          helper: "clone"
    });
    $( "ol" ).droppable({
          activeClass: "ui-state-default",
          hoverClass: "ui-state-hover",
          accept: ":not(.ui-sortable-helper)",
          drop: function( event, ui ) {
            var task_id = $(ui.draggable.html()).attr('rel');
            console.log(task._id);
            $( this ).find( ".placeholder" ).remove();
            $( '<li></li>' ).text( ui.draggable.text() ).prepend('<a href="#" class="delete btn btn-danger" rel="' + task_id + '"><i class="glyphicon glyphicon-trash"></i></a>').appendTo( this );
          }
        }).sortable({
          items: "li:not(.placeholder)",
          sort: function() {
            // gets added unintentionally by droppable interacting with sortable
            // using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
            $( this ).removeClass( "ui-state-default" );
          }
      });
  }

  function loadTasks() {
    $.getJSON('/tasks', function(data) {
      renderTasks(data); 
    });  
  }

  function deleteTask(event) {
      event.preventDefault();
      var elem = $(event.currentTarget);
      var taskId = elem.attr('rel');
        $.ajax({
          type: 'DELETE',
          url: '/tasks/' + taskId
        }).done(function( response ) {
          if (response.msg === '') {
          }
          else {
            alert('Error: ' + response.msg);
          }
          loadTasks();
        });
  };

  $('#add').on('click', function(){
    var description = $('#description').val();
    var category = $("input[type=checkbox]:checked").val();
    var data = {'category': category, 'description': description};
    $.ajax({
      type:'POST',
      data: data,
      url: '/tasks',
      dataType: 'JSON'
    }).done(function(response) {
      if (response.msg === '') {
        loadTasks();
      }
      else {
        alert('Error: ' + response.msg);
      }
    });
    $('textarea').val('');
    $("input[type=checkbox]:checked").prop('checked', false);
    $('#myModal').modal('hide');
  });

  $('#accordion').on('click', '.delete', function(event){
    deleteTask(event);
  });
  $('.daily').on('click', '.delete', function(event){
    event.preventDefault();
    $(this).parent().remove();
  });
  
});











