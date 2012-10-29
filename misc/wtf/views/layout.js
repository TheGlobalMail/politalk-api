define([
  "backbone", "views/index-view", "views/members-view"
], function(Backbone, IndexView, MembersView){

  return new Backbone.Layout({
    template: "#layout",

    views: {
      "index": new IndexView(),
      "members": new MembersView()
    }
  });
});
