function BoxModelInspector(options) {
  this.el = options.el;
  this.className = options.className || '';

  if (this.el) {
    this._elComputedStyles = window.getComputedStyle(this.el);
    this.boxModel = this._buildDomNodes();
    this.refresh();
  } else {
    this.boxModel = this._buildDomNodes();
  }
}

// renders all required dom objects and appends to body
// returns a reference object containing all node objects
BoxModelInspector.prototype._buildDomNodes = function() {
  this._parentElement = document.createElement('div');

  var childElements = '<div class="padding"></div>' +
    '<div class="margin">' +
    '<div class="top"></div>' +
    '<div class="right"></div>' +
    '<div class="bottom"></div>' +
    '<div class="left"></div>' +
    '</div>' +
    '<div class="content">' +
    '<div class="top"></div>' +
    '<div class="right"></div>' +
    '<div class="bottom"></div>' +
    '<div class="left"></div>' +
    '</div>' +
    '<div class="element"></div>';

  this._parentElement.className = 'box-model ' + this.className;
  this._parentElement.innerHTML = childElements;
  document.body.appendChild(this._parentElement);

  return this._buildNodeReference(this._parentElement.childNodes);
}

BoxModelInspector.prototype._buildNodeReference = function(nodes, parent) {
  var nodeRef = {
    wrapper: this._parentElement
  }

  // loop through dom nodes
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var children = node.childNodes;
    var refEntry;

    if (parent) {
      parent[node.classList[0]] = node;
    } else if (children) {
      refEntry = nodeRef[node.classList[0]] = {};
      refEntry.wrapper = node;
      this._buildNodeReference(children, refEntry);
    }
  }

  return nodeRef;
}

BoxModelInspector.prototype._calculatePadding = function() {
  var padding = this.boxModel.content,
    styles = this._elComputedStyles,
    elDimensions = this._elDimensions,
    paddingLeft = parseFloat(styles.paddingLeft),
    paddingRight = parseFloat(styles.paddingRight),
    paddingTop = parseFloat(styles.paddingTop),
    paddingBottom = parseFloat(styles.paddingBottom);

  padding.wrapper.style.width = elDimensions.outerWidth - paddingLeft - paddingRight + 'px';
  padding.wrapper.style.height = elDimensions.outerHeight - paddingTop - paddingBottom + 'px';
  padding.wrapper.style.left = paddingLeft + 'px';
  padding.wrapper.style.top = paddingTop + 'px';

  padding.top.style.height = paddingTop + 'px';
  padding.top.style.width = elDimensions.width + 'px';
  padding.top.style.top = (paddingTop * -1) + 'px';
  padding.top.style.left = (paddingLeft * -1) + 'px';

  padding.right.style.height = elDimensions.outerHeight + 'px';
  padding.right.style.width = paddingRight + 'px';
  padding.right.style.top = (paddingTop * -1) + 'px';
  padding.right.style.right = (paddingRight * -1) + 'px';

  padding.bottom.style.height = paddingBottom + 'px';
  padding.bottom.style.width = elDimensions.outerWidth + 'px';
  padding.bottom.style.bottom = (paddingBottom * -1) + 'px';
  padding.bottom.style.left = (paddingLeft * -1) + 'px';

  padding.left.style.height = elDimensions.outerHeight + 'px';
  padding.left.style.width = paddingLeft + 'px';
  padding.left.style.top = (paddingTop * -1) + 'px';
  padding.left.style.left = (paddingLeft * -1) + 'px';
}

BoxModelInspector.prototype._calculateMargin = function() {
  var margin = this.boxModel.margin,
    styles = this._elComputedStyles,
    elDimensions = this._elDimensions,
    marginLeft = parseFloat(styles.marginLeft),
    marginRight = parseFloat(styles.marginRight),
    marginTop = parseFloat(styles.marginTop),
    marginBottom = parseFloat(styles.marginBottom);

  margin.wrapper.style.width = elDimensions.outerWidth + marginLeft + marginRight + 'px';
  margin.wrapper.style.height = elDimensions.outerHeight + marginTop + marginBottom + 'px';
  margin.wrapper.style.left = (marginLeft * -1) + 'px';
  margin.wrapper.style.top = (marginTop * -1) + 'px';

  margin.top.style.height = marginTop + 'px';
  margin.top.style.width = elDimensions.outerWidth + marginLeft + marginRight + 'px';

  margin.right.style.height = elDimensions.outerHeight + 'px';
  margin.right.style.width = marginRight + 'px';
  margin.right.style.top = marginTop + 'px';
  margin.right.style.right = 0 + 'px';

  margin.bottom.style.height = marginBottom + 'px';
  margin.bottom.style.width = elDimensions.outerWidth + marginLeft + marginRight + 'px';
  margin.bottom.style.bottom = 0 + 'px';

  margin.left.style.height = elDimensions.outerHeight + 'px';
  margin.left.style.width = marginLeft + 'px';
  margin.left.style.top = marginTop + 'px';
}

BoxModelInspector.prototype.setElement = function(el) {
  this.el = el;
  // this.boxModel = this._buildDomNodes();
  this._elComputedStyles = window.getComputedStyle(el);

  this.refresh();
}

BoxModelInspector.prototype.refresh = function() {
  var el = this.el;

  var elDimensions = {
    offset: {
      left: el.offsetLeft,
      top: el.offsetTop
    },
    width: el.clientWidth,
    height: el.clientHeight,
    outerHeight: el.offsetHeight,
    outerWidth: el.offsetWidth
  };

  this._elDimensions = elDimensions;

  this.boxModel.wrapper.style.left = elDimensions.offset.left + 'px';
  this.boxModel.wrapper.style.top = elDimensions.offset.top + 'px';
  this.boxModel.wrapper.style.height = elDimensions.outerHeight + 'px';
  this.boxModel.wrapper.style.width = elDimensions.outerWidth + 'px';

  this._calculatePadding();
  this._calculateMargin();

  return this;
}

module.exports = BoxModelInspector
