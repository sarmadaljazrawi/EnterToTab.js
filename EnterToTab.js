var SA = SA || {};

SA.EnterToTab = function () {
    var self = this;

    var KEY_CODE = 13;

    self._options = {
        keyCode: KEY_CODE,
        callback: null,
        callbackOnlyIf: null
    };

    self._selector = null;
    self._container = null;

    self.AddHandler = function (selector, container, userOptions) {

        $.extend(true, self._options, userOptions);

        self._selector = selector;
        self._container = container;
        if (self._container === null) {
            $(selector).off('keypress').on('keypress', self._emulateEnterToTab);
        } else {
            $(selector, container).off('keypress').on('keypress', self._emulateEnterToTab);
        }

    };

    self.RemoveHandler = function (selector, container) {
        if (container === undefined || container === '' || container === null) {
            $(selector).off('keypress', self._emulateEnterToTab);
        } else {
            $(selector, container).off('keypress', self._emulateEnterToTab);
        }

    };

    self._emulateEnterToTab = function (event) {

        if (event.which === self._options.keyCode) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            var $selector = (self._container === null) ? $(self._selector) : $(self._selector, self._container);

            var selectedItemIndex = $selector.index($(this));

            if (self._options.callback !== null && selectedItemIndex === $selector.length - 1) {
                self._options.callback();
                self.RemoveHandler(self._selector, self._container);
                self.AddHandler(self._selector, self._options, self._container);
                return false;
            }


            if (selectedItemIndex !== null) {
                var $nextSelectableItem = self._getNextSelectableItem(self._selector, selectedItemIndex, self._container);

                $nextSelectableItem.focus();

                return true;
            }


            return false;
        }

        return true;
    };

    self._getNextSelectableItem = function (selector, currentSelectedItemIndex, container) {

        var nextItemIndex = currentSelectedItemIndex + 1;

        var $items = (container === undefined || container === '' || container === null) ? $(selector) : $(selector, container);
        
        for (var i = nextItemIndex, len = $items.length; i < len; i++) {
            var $nextItem = $($items.get(i));
            if ($nextItem.is(":disabled") === false) {
                return $nextItem;
            }
        }


        return $($items.get(0));
    };
};
