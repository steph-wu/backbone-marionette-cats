MyApp = new Backbone.Marionette.Application();

MyApp.addRegions({
  mainRegion: '#content'
});

AngryCat = Backbone.Model.extend({});

AngryCats = Backbone.Collection.extend({
  model: AngryCat
});

// Creates view that renders an element into the template #angry_cat-template
AngryCatVew = Backbone.Marionette.ItemView.extend({
  template: '#angry_cat-template', // jQuery selector
  tagName: 'tr', // Backbone creates a div by default
  className: 'angry_cat' // adds a class attribute to the DOM element created
});

// Creates a view that renders a Collection
AngryCatsView = Backbone.Marionette.CompositeView.extend({
  tagName: 'table',
  id: 'angry_cat',
  className: 'table-striped table-bordered',
  template: 'angry_cats-template',
  itemView: AngryCatView,

  initialize: function(){
    this.listenTo(this.collection, 'sort', this.renderCollection);
  },

  appendHTML: function(collectionView, itemView){
    collectionView.$('tbody').append(itemView.el);
  }
});
