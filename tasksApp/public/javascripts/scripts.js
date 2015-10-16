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
        $ul.append('<li><a href="#" class="delete btn btn-danger rel="' + task._id + '"><i class="glyphicon glyphicon-trash"></i></a>'+description+'</li>');   
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
            $( this ).find( ".placeholder" ).remove();
            $( "<li></li>" ).text( ui.draggable.text() ).appendTo( this );
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

  $('#add').on('click', function(){
    var description = $('#description').val();
    var category = $("input[type=checkbox]:checked").val();
    var data = {'category': category, 'description': description};
    console.log(data);
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
    $('#myModal').modal('hide');
  });
  
});