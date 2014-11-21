
    Polymer('core-menu-button', {

      publish: {

        /**
         * The icon to display.
         * @attribute icon
         * @type string
         */
        icon: 'dots',

        src: '',

        /**
         * Set to true to open the menu.
         * @attribute opened
         * @type boolean
         */
        opened: false,

        /**
         * Set to true to cause the menu popup to be displayed inline rather
         * than in its own layer.
         * @attribute inlineMenu
         * @type boolean
         */
        inlineMenu: false,

        /**
         * Horizontally align the overlay with the button.
         * @attribute halign
         * @type string
         */
        halign: 'left',

        /**
         * Display the overlay on top or below the button.
         * @attribute valign
         * @type string
         */
        valign: 'top',

        /**
         * If true, the selection will persist when the menu is opened
         * and closed multiple times.
         *
         * @attribute stickySelection
         * @type boolean
         * @default false
         */
        stickySelection: false,

        /**
         * The index of the selected menu item.
         * @attribute selected
         * @type number
         */
        selected: '',

        /**
         * Specifies the attribute to be used for "selected" attribute.
         *
         * @attribute valueattr
         * @type string
         * @default 'name'
         */
        valueattr: 'name',

        /**
         * Specifies the CSS class to be used to add to the selected element.
         *
         * @attribute selectedClass
         * @type string
         * @default 'core-selected'
         */
        selectedClass: 'core-selected',

        /**
         * Specifies the property to be used to set on the selected element
         * to indicate its active state.
         *
         * @attribute selectedProperty
         * @type string
         * @default ''
         */
        selectedProperty: '',

        /**
         * Specifies the attribute to set on the selected element to indicate
         * its active state.
         *
         * @attribute selectedAttribute
         * @type string
         * @default 'active'
         */
        selectedAttribute: 'active',

        /**
         * Returns the currently selected element. In multi-selection this returns
         * an array of selected elements.
         * Note that you should not use this to set the selection. Instead use
         * `selected`.
         *
         * @attribute selectedItem
         * @type Object
         * @default null
         */
        selectedItem: null,

        /**
         * In single selection, this returns the model associated with the
         * selected element.
         * Note that you should not use this to set the selection. Instead use
         * `selected`.
         *
         * @attribute selectedModel
         * @type Object
         * @default null
         */
        selectedModel: null,

        /**
         * In single selection, this returns the selected index.
         * Note that you should not use this to set the selection. Instead use
         * `selected`.
         *
         * @attribute selectedIndex
         * @type number
         * @default -1
         */
        selectedIndex: -1,

        /**
         * Nodes with local name that are in the list will not be included
         * in the selection items.
         *
         * @attribute excludedLocalNames
         * @type string
         * @default ''
         */
        excludedLocalNames: ''

      },

      closeAction: function() {
        this.opened = false;
      },

      /**
       * Toggle the opened state of the dropdown.
       * @method toggle
       */
      toggle: function() {
        this.opened = !this.opened;
      },

      /**
       * The selected menu item.
       * @property selection
       * @type Node
       */
      get selection() {
        return this.$.menu.selection;
      },

      openedChanged: function() {
        if (this.opened && !this.stickySelection) {
          this.selected = null;
        }
      }

    });
  