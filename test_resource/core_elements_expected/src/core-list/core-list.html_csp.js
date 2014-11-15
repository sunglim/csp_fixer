
(function() {

  Polymer('core-list', {
    
    publish: {
      /**
       * Fired when an item element is tapped.
       * 
       * @event core-activate
       * @param {Object} detail
       *   @param {Object} detail.item the item element
       */

      /**
       * 
       * An array of source data for the list to display.
       *
       * @attribute data
       * @type array
       * @default null
       */
      data: null,

      /**
       * 
       * An optional element on which to listen for scroll events.
       *
       * @attribute scrollTarget
       * @type Element
       * @default core-list
       */
      scrollTarget: null,

      /**
       * 
       * The height of a list item. `core-list` currently supports only fixed-height
       * list items. This height must be specified via the height property.
       *
       * @attribute height
       * @type number
       * @default 80
       */
      height: 80,

      /**
       * 
       * The number of extra items rendered above the minimum set required to
       * fill the list's height.
       *
       * @attribute extraItems
       * @type number
       * @default 30
       */
      extraItems: 30,

      /**
       * 
       * When true, tapping a row will select the item, placing its data model
       * in the set of selected items retrievable via the `selection` property.
       *
       * Note that tapping focusable elements within the list item will not
       * result in selection, since they are presumed to have their own action.
       *
       * @attribute selectionEnabled
       * @type {boolean}
       * @default true
       */
      selectionEnabled: true,

      /**
       * 
       * Set to true to support multiple selection.  Note, existing selection
       * state is maintained only when changing `multi` from `false` to `true`;
       * it is cleared when changing from `true` to `false`.
       *
       * @attribute multi
       * @type boolean
       * @default false
       */
      multi: false,

      /**
       * 
       * Data record (or array of records, if `multi: true`) corresponding to
       * the currently selected set of items.
       *
       * @attribute selection
       * @type {any}
       * @default null
       */
       selection: null
    },

    // Local cache of scrollTop
    _scrollTop: 0,
    
    observe: {
      'data template scrollTarget': 'initialize',
      'multi selectionEnabled': '_resetSelection'
    },

    ready: function() {
      this._boundScrollHandler = this.scrollHandler.bind(this);
      this._oldMulti = this.multi;
      this._oldSelectionEnabled = this.selectionEnabled;
    },

    attached: function() {
      this.template = this.querySelector('template');
      if (!this.template.bindingDelegate) {
        this.template.bindingDelegate = this.element.syntax;
      }
    },

    _resetSelection: function() {
      if (((this._oldMulti != this.multi) && !this.multi) || 
          ((this._oldSelectionEnabled != this.selectionEnabled) && 
            !this.selectionEnabled)) {
        this._clearSelection();
        this.refresh(true);
      } else {
        this.selection = this.$.selection.getSelection();
      }
      this._oldMulti = this.multi;
      this._oldSelectionEnabled = this.selectionEnabled;
    },

    // TODO(sorvell): it'd be nice to dispense with 'data' and just use 
    // template repeat's model. However, we need tighter integration
    // with TemplateBinding for this.
    initialize: function() {
      if (!this.template) {
        return;
      }
      
      // TODO(kschaaf): This is currently the only way to know that the array
      // was mutated as opposed to newly assigned; to be updated with better API
      if (arguments.length == 1) {
        var splices = arguments[0];
        for (var i=0; i<splices.length; i++) {
          var s = splices[i];
          for (var j=0; j<s.removed.length; j++) {
            var d = s.removed[j];
            this.$.selection.setItemSelected(d, false);
          }
        }
      } else {
        this._clearSelection();
      }

      var target = this.scrollTarget || this;
      if (this._target !== target) {
        if (this._target) {
          this._target.removeEventListener('scroll', this._boundScrollHandler, false);
        }
        this._target = target;
        this._target.addEventListener('scroll', this._boundScrollHandler, false);
      }
      // Only use -webkit-overflow-touch from iOS8+, where scroll events are fired
      var ios = navigator.userAgent.match(/iP(?:hone|ad;(?: U;)? CPU) OS (\d+)/);
      if (ios && ios[1] >= 8) {
        target.style.webkitOverflowScrolling = 'touch';
      }

      this.initializeData();
    },

    initializeData: function() {
      var currentCount = this._physicalCount || 0;
      var dataLen = this.data && this.data.length || 0;
      this._visibleCount = Math.ceil(this._target.offsetHeight / this.height);
      this._physicalCount = Math.min(this._visibleCount + this.extraItems, dataLen);
      this._physicalCount = Math.max(currentCount, this._physicalCount);
      this._physicalData = this._physicalData || new Array(this._physicalCount);
      var needItemInit = false;
      while (currentCount < this._physicalCount) {
        this._physicalData[currentCount++] = {};
        needItemInit = true;
      }
      this.template.model = this._physicalData;
      this.template.setAttribute('repeat', '');
      if (needItemInit) {
        this.onMutation(this, this.initializeItems);
      } else {
        this.refresh(true);
      }
    },

    initializeItems: function() {
      var currentCount = this._physicalItems && this._physicalItems.length || 0;
      this._physicalItems = this._physicalItems || new Array(this._physicalCount);
      for (var i = 0, item = this.template.nextElementSibling;
           item && i < this._physicalCount;
           ++i, item = item.nextElementSibling) {
        this._physicalItems[i] = item;
        item._transformValue = 0;
      }
      this.refresh(true);
    },

    updateItem: function(virtualIndex, physicalIndex) {
      var virtualDatum = this.data && this.data[virtualIndex];
      var physicalDatum = this._physicalData[physicalIndex];
      physicalDatum.model = virtualDatum;
      physicalDatum.physicalIndex = physicalIndex;
      physicalDatum.index = virtualIndex;
      physicalDatum.selected = this.selectionEnabled && virtualDatum ? 
          this._selectedData.get(virtualDatum) : null;
      var physicalItem = this._physicalItems[physicalIndex];
      physicalItem.hidden = !virtualDatum;
    },

    scrollHandler: function(e, detail) {
      this._scrollTop = e.detail ? e.detail.target.scrollTop : e.target.scrollTop;
      this.refresh(false);
    },

    /**
     * Refresh the list at the current scroll position.
     *
     * @method refresh
     */
    refresh: function(force) {
      // Check that the array hasn't gotten longer since data was initialized
      var dataLen = this.data && this.data.length || 0;
      if (force) {
        if (this._physicalCount < 
            Math.min(this._visibleCount + this.extraItems, dataLen)) {
          // Need to add more items; once new data & items are initialized,
          // refresh will be run again
          this.initializeData();
          return;
        }
        this._physicalHeight = this.height * this._physicalCount;
        this.$.viewport.style.height = this.height * dataLen + 'px';
      }

      var firstVisibleIndex = Math.floor(this._scrollTop / this.height);
      var visibleMidpoint = firstVisibleIndex + this._visibleCount / 2;

      var firstReifiedIndex = Math.max(0, Math.floor(visibleMidpoint - 
          this._physicalCount / 2));
      firstReifiedIndex = Math.min(firstReifiedIndex, dataLen - 
          this._physicalCount);
      firstReifiedIndex = (firstReifiedIndex < 0) ? 0 : firstReifiedIndex;

      var firstPhysicalIndex = firstReifiedIndex % this._physicalCount;
      var baseVirtualIndex = firstReifiedIndex - firstPhysicalIndex;

      var baseTransformValue = Math.floor(this.height * baseVirtualIndex);
      var nextTransformValue = Math.floor(baseTransformValue + 
          this._physicalHeight);

      var baseTransformString = 'translate3d(0,' + baseTransformValue + 'px,0)';
      var nextTransformString = 'translate3d(0,' + nextTransformValue + 'px,0)';

      this.firstPhysicalIndex = firstPhysicalIndex;
      this.baseVirtualIndex = baseVirtualIndex;

      for (var i = 0; i < firstPhysicalIndex; ++i) {
        var item = this._physicalItems[i];
        if (force || item._transformValue != nextTransformValue) {
          this.updateItem(baseVirtualIndex + this._physicalCount + i, i);
          setTransform(item, nextTransformString, nextTransformValue);
        }
      }
      for (var i = firstPhysicalIndex; i < this._physicalCount; ++i) {
        var item = this._physicalItems[i];
        if (force || item._transformValue != baseTransformValue) {
          this.updateItem(baseVirtualIndex + i, i);
          setTransform(item, baseTransformString, baseTransformValue);
        }
      }
    },

    // list selection
    tapHandler: function(e) {
      var n = e.target;
      var p = e.path;
      if (!this.selectionEnabled || (n === this)) {
        return;
      }
      requestAnimationFrame(function() {
        // Gambit: only select the item if the tap wasn't on a focusable child
        // of the list (since anything with its own action should be focusable
        // and not result in result in list selection).  To check this, we
        // asynchronously check that shadowRoot.activeElement is null, which 
        // means the tapped item wasn't focusable. On polyfill where
        // activeElement doesn't follow the data-hinding part of the spec, we
        // can check that document.activeElement is the list itself, which will
        // catch focus in lieu of the tapped item being focusable, as we make
        // the list focusable (tabindex="-1") for this purpose.  Note we also
        // allow the list items themselves to be focusable if desired, so those
        // are excluded as well.
        var active = window.ShadowDOMPolyfill ? 
            wrap(document.activeElement) : this.shadowRoot.activeElement;
        if (active && (active != this) && (active.parentElement != this) && 
            (document.activeElement != document.body)) {
          return;
        }
        // Unfortunately, Safari does not focus certain form controls via mouse,
        // so we also blacklist input, button, & select
        // (https://bugs.webkit.org/show_bug.cgi?id=118043)
        if ((p[0].localName == 'input') || 
            (p[0].localName == 'button') || 
            (p[0].localName == 'select')) {
          return;
        }

        var model = n.templateInstance && n.templateInstance.model;
        if (model) {
          var vi = model.index, pi = model.physicalIndex;
          var data = this.data[vi], item = this._physicalItems[pi];
          this.$.selection.select(data);
          this.asyncFire('core-activate', {data: data, item: item});
        }
      }.bind(this));
    },

    selectedHandler: function(e, detail) {
      this.selection = this.$.selection.getSelection();
      var i$ = this.indexesForData(detail.item);
      // TODO(sorvell): we should be relying on selection to store the
      // selected data but we want to optimize for lookup.
      this._selectedData.set(detail.item, detail.isSelected);
      if (i$.physical >= 0) {
        this.updateItem(i$.virtual, i$.physical);
      }
    },

    /**
     * Select the list item at the given index.
     *
     * @method selectItem
     * @param {number} index 
     */
    selectItem: function(index) {
      if (!this.selectionEnabled) {
        return;
      }
      var data = this.data[index];
      if (data) {
        this.$.selection.select(data);
      }
    },

    /**
     * Set the selected state of the list item at the given index.
     *
     * @method setItemSelected
     * @param {number} index 
     * @param {boolean} isSelected 
     */
    setItemSelected: function(index, isSelected) {
      var data = this.data[index];
      if (data) {
        this.$.selection.setItemSelected(data, isSelected);
      }
    },

    indexesForData: function(data) {
      var virtual = this.data.indexOf(data);
      var physical = this.virtualToPhysicalIndex(virtual);
      return { virtual: virtual, physical: physical };
    },

    virtualToPhysicalIndex: function(index) {
      for (var i=0, l=this._physicalData.length; i<l; i++) {
        if (this._physicalData[i].index === index) {
          return i;
        }
      }
      return -1;
    },

    /**
     * Clears the current selection state of the list.
     *
     * @method clearSelection
     */
    clearSelection: function() {
      this._clearSelection();
      this.refresh(true);
    },

    _clearSelection: function() {
      this._selectedData = new WeakMap();
      this.$.selection.clear();
      this.selection = this.$.selection.getSelection();
    },

    scrollToItem: function(index) {
      this.scrollTop = index * this.height;
    }

  });

  // determine proper transform mechanizm
  if (document.documentElement.style.transform !== undefined) {
    var setTransform = function(element, string, value) {
      element.style.transform = string;
      element._transformValue = value;
    }
  } else {
    var setTransform = function(element, string, value) {
      element.style.webkitTransform = string;
      element._transformValue = value;
    }
  }

})();
