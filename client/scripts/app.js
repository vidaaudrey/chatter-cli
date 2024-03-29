var Message = Backbone.Model.extend({
  // url: 'https://api.parse.com/1/classes/chatterbox/',
  url: 'http://localhost:3000/classes/messages',
  defaults: {
    username: '',
    message: ''
  }
});

var Messages = Backbone.Collection.extend({
  model: Message,
  url: 'http://localhost:3000/classes/messages',
  // url: 'https://api.parse.com/1/classes/chatterbox/',

  loadMsgs: function(){
    // this.fetch({dataType: 'jsonp', data: { order: '-createdAt' }});
    this.fetch();
  },

  parse: function(response, options){
    var results = [];
    for( var i = response.results.length-1; i >= 0; i-- ){
      results.push(response.results[i]);
    }
    return results;
  }
});

var FormView = Backbone.View.extend({

  initialize: function(){
    this.collection.on('sync', this.stopSpinner, this);
  },

  events: {
    'submit #send': 'handleSubmit'
  },

  handleSubmit: function(e){
    e.preventDefault();

    this.startSpinner();

    var $text = this.$('#message');
    this.collection.create({
      username: window.location.search.substr(10),
      message: $text.val()
    });
    $text.val('');
  },

  startSpinner: function(){
    this.$('.spinner img').show();
    this.$('form input[type=submit]').attr('disabled', "true");
  },

  stopSpinner: function(){
    this.$('.spinner img').fadeOut('fast');
    this.$('form input[type=submit]').attr('disabled', null);
  }

});

var MessageView = Backbone.View.extend({

  template: _.template('<div class="chat" data-id="<%- objectId %>"> \
                       <div class="user"><%- username %></div> \
                       <div class="text"><%- message %></div> \
                       </div>'),

  render: function(){
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MessagesView = Backbone.View.extend({

  initialize: function(){
    this.collection.on('sync', this.render, this);
    this.onscreenMessages = {};
  },

  render: function(){
    this.collection.forEach(this.renderMessage, this);
  },

  renderMessage: function(message){
    if( !this.onscreenMessages[message.get('objectId')] ){
      var messageView = new MessageView({model: message});
      console.log("messagesView", messageView);
      this.$el.prepend(messageView.render());
      this.onscreenMessages[message.get('objectId')] = true;
    }
  }

});
