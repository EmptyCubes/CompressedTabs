/* jshint browser:true, global:true */
/* global jQuery console */

(function ($) {
    'use strict';
    $.widget("ec.compressedTabs", $.ui.tabs, {
        _create: function () {
            this.element
                .addClass('ui-tabs-compressed');

            this._super();

            this.tablist
                .contents()
                .not(function () { return this.nodeType !== 3; })
                .remove();

            this.wrap =
                this.tablist
                    .wrap('<div>')
                    .parent();

            this.tablistWrap =
                this.tablist
                    .wrap('<div class="ui-tabs-compressed-nav-wrap"></div>')
                    .parent();

            var navs = { left: null, right: null },
                self = this;

            $.each(navs, function(key) {
                navs[key] = $('<em>', {
                    'class': 'ui-tabs-compressed-' + key,
                    'click': $.proxy(self._onClicked, self)
                });
            });

            this.navs = navs;
            this.wrap
                .addClass('ui-tabs-compressed-wrap')
                .prepend(navs.left)
                .append(navs.right);

            $.each(navs, function(key) {
                navs[key].wrap('<div class="ui-tabs-compressed-trigger"></div>');
            });

            this._resizeList(false);
        },

        _destory: function() {
            this.navs
                .left
                .remove();

            this.navs
                .right
                .remove();

            this.tablist
                .unwrap()
                .unwrap();

            this.element
                .removeClass('ui-tabs-compressed');

            this._super();
        },

        _activate: function( index ) {
            var activeIndex = this.active.index();
            if (activeIndex === index) {
                return;
            }

            var target = activeIndex < index ? this.active : this.tabs.eq(index);
            var direction = activeIndex < index ? '-=' : '+=';
            var distance = direction + target.width() + 'px';

            this._super(index);
            this._resizeList(true);
            this.tabs
                .animate({
                    left: distance
                });
        },

        _setupEvents: function() {
            this._on( this.anchors, {
                click: function(e) { e.preventDefault(); }
            });
            //Do nothing else
        },

        _resizeList: function(animate) {
            var width = this.active.width();

            this.tablist[animate ? 'animate' : 'css']({
                width: width
            });
        },

        _onClicked: function(event) {
            var moveNext =
                this.navs
                    .right
                    .is(event.target),
                distance = moveNext ? 1 : -1,
                index = this.active.index() + distance;

            if (index >= 0 && index < this.tabs.length) {
                this._activate(index);
            }
        }
    });
})(jQuery);