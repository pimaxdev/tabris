(function() {

  tabris.PageSelector = function() {
    var instance = new tabris.CollectionView();
    instance._create = _create;
    return instance;
  };

  tabris.PageSelector.prototype.type = "PageSelector";

  function _create(properties) {
    tabris.CollectionView.prototype._create.call(this, _.extend({
      items: getPages(),
      initializeCell: initializeCell,
      itemHeight: device.platform === "iOS" ? 40 : 48,
      layoutData: {left: 0, top: 0, right: 0, bottom: 0}
    }, properties));
    this.on("select", function(target, value) {
      if (value instanceof tabris.Page) {
        if (tabris.ui.drawer) {
          tabris.ui.drawer.close();
        }
        value.open();
      }
    });
    tabris.ui.on("addchild", function(ui, child) {
      if (child instanceof tabris.Page && child.get("topLevel")) {
        this.insert([child]);
      }
    }, this).on("removechild", function(ui, child) {
      var index = this.get("items").indexOf(child);
      if (index !== -1) {
        this.remove(index);
      }
    }, this);
    return this;
  }

  function getPages() {
    return tabris.ui.children("Page").toArray().filter(function(page) {
      return page.get("topLevel");
    });
  }

  function initializeCell(cell) {
    tabris.create("Composite", {
      layoutData: {left: 0, right: 0, bottom: 0, height: 1},
      background: "#bbb"
    }).appendTo(cell);
    var imageView = tabris.create("ImageView", {
      layoutData: {left: 10, top: 10, bottom: 10}
    }).appendTo(cell);
    var textView = tabris.create("TextView", {
      layoutData: {left: 72, centerY: 0},
      font: device.platform === "iOS" ? "17px .HelveticaNeueInterface-Regular" : "14px Roboto Medium",
      textColor: device.platform === "iOS" ? "rgb(22, 126, 251)" : "#212121"
    }).appendTo(cell);
    cell.on("change:item", function(widget, page) {
      imageView.set("image", page.get("image"));
      textView.set("text", page.get("title"));
    });
  }

})();
