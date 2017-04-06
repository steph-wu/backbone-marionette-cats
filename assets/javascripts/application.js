// Initialize app and define region
MyApp = new Backbone.Marionette.Application();

MyApp.addRegions({
    mainRegion: "#content"
});

// Create model and collection
AngryCat = Backbone.Model.extend({});

AngryCats = Backbone.Collection.extend({
    model: AngryCat
});

// Create item view that renders a DOM element
AngryCatView = Backbone.Marionette.ItemView.extend({
    template: "#angry_cat-template",
    tagName: 'tr',
    className: 'angry_cat'
});

// Create collection view
AngryCatsView = Backbone.Marionette.CompositeView.extend({
  tagName: "table",
  id: "angry_cats",
  className: "table-striped table-bordered",
  template: "#angry_cats-template",
  itemView: AngryCatView,

  appendHtml: function(collectionView, itemView){
    collectionView.$("tbody").append(itemView.el);
  }
});

// Create a collection of AngryCats populated by AngryCat models when document is ready
$(document).ready(function() {
  var cats = new AngryCats([
    new AngryCat({ name: 'Wet Cat' }),
    new AngryCat({ name: 'Bitey Cat' }),
    new AngryCat({ name: 'Surprised Cat' })
  ]);

  MyApp.start({
    cats: cats
  });
});

// Initiailize app
MyApp.addInitializer(function(options) {
  var angryCatsView = new AngryCatsView({
    collection: options.cats
  });
  MyApp.mainRegion.show(angryCatsView);
});
