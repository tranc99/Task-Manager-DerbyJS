var derby = require('derby');
var app = module.exports = derby.createApp('todos', __filename);

//make app global for access in the console
global.app = app;

app.loadViews(__dirname+'/views');
app.loadStyles(__dirname+'/css');

app.on('model', function(model) {
  model.fn('all',     function(item) { return true; });
  model.fn('completed', function(item) { return item.completed;});
  model.fn('active',    function(item) { return !item.completed;});
});

app.get('/', getPage('all'));
app.get('/active', getPage('active'));
app.get('/completed', getPage('completed'));

function getPage(filter) {
  return function(page, model) {
    model.subscribe('todos', function() {
      model.filter('todos', filter).ref('_page.todos');
      page.render();
    });
  }
}

app.proto.addTodo = function(newTodo) {
  if(!newTodo) return;

  this.model.add('todos', {
    text: newTodo,
    completed: false
  });

  this.model.set('_page.newTodo', '');
};

app.proto.deleteTodo = function(todoId) {
  this.model.del('todos.' + todoId);
};
