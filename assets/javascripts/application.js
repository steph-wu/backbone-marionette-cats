// Initialize app and define region
MyApp = new Backbone.Marionette.Application();

MyApp.addRegions({
    mainRegion: "#content"
});

// Create model and collection
AngryCat = Backbone.Model.extend({
  defaults: {
    votes: 0
  },

  addVote: function(){
    this.set('votes', this.get('votes') + 1);
  },

  rankUp: function() {
    this.set({rank: this.get('rank') - 1});
  },

  rankDown: function() {
    this.set({rank: this.get('rank') + 1});
  }
});

AngryCats = Backbone.Collection.extend({
    model: AngryCat,
    initialize: function(cats){
      var rank = 1;
      _.each(cats, function(cat) {
        cat.set('rank', rank);
        ++rank;
      });

      var self = this;

      MyApp.on('rank:up', function(cat){
        if (cat.get('rank') === 1) {
          return true;
        }
        self.rankUp(cat);
        self.sort();
        self.trigger('reset');
      });

      MyApp.on('rank:down', function(cat){
        if (cat.get('rank') === self.size()) {
          return true;
        }
        self.rankDown(cat);
        self.sort();
        self.trigger('reset');
      });
    },

    comparator: function(cat){
      return cat.get('rank');
    },

    rankUp: function(cat) {
      var rankToSwap = cat.get('rank') - 1;
      var otherCat = this.at(rankToSwap - 1);
      cat.rankUp();
      otherCat.rankDown();
    },

    rankDown: function(cat) {
      var rankToSwap = cat.get('rank') + 1;
      var otherCat = this.at(rankToSwap - 1);
      cat.rankDown();
      otherCat.rankUp();
    }
});

// Create item view that renders a DOM element (tr, table row) for each item
AngryCatView = Backbone.Marionette.ItemView.extend({
    template: "#angry_cat-template",
    tagName: 'tr',
    className: 'angry_cat',

    // Event listeners
    events: {
      'click .rank_up img': 'rankUp',
      'click .rank_down img': 'rankDown'
    },

    rankUp: function(){
      this.model.addVote();
      MyApp.trigger('rank:up', this.model);
    },

    rankDown: function(){
      this.model.addVote();
      MyApp.trigger('rank:down', this.model);
    }
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
    new AngryCat({
      name: 'Wet Cat',
      image_path: 'assets/images/cat2.jpg'
    }),
    new AngryCat({
      name: 'Bitey Cat',
      image_path: 'assets/images/cat1.jpg'
    }),
    new AngryCat({
      name: 'Surprised Cat',
      image_path: 'assets/images/cat3.jpg'
    })
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
