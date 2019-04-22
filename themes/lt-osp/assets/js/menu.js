/*! Menu */
$(function () {
    'use strict';

    const ARIA_EXPANDED = "aria-expanded";

    function forEach(list, callback) {
        Array.prototype.forEach.call(list, callback);
    }
    function callEach(list) {
        Array.prototype.forEach.call(list, function (callback) {
            callback();
        });
    }

    const CLOSERS = [];
    var closeMenus = function () {
        callEach(CLOSERS);
    };

    /* Accounts for the height of a sticky banner at the top of the viewport */
    var scrollIntoView = function (elm) {
        elm.scrollIntoView(true);
        if (window.scrollY) {
            var banner = document.getElementById("banner");
            window.scroll(0, window.scrollY - banner.clientHeight);
        }
    };

    /* Side Menu */
    var sideMenu = document.getElementById("side-menu");

    var toggleMenu = function () {
        var isExpanded = sideMenu.getAttribute(ARIA_EXPANDED) == "true";
        isExpanded ? closeMenu() : openMenu();
    };
    var openMenu = function () {
        closeMenus();
        sideMenu.setAttribute(ARIA_EXPANDED, true);
    };
    var closeMenu = function () {
        sideMenu.setAttribute(ARIA_EXPANDED, false);
    }
    CLOSERS.push(closeMenu);
    var onToggleMenu = function (evt) {
        if (!sideMenu) return;

        evt.preventDefault();
        toggleMenu();
    };
    var onCloseMenu = function (evt) {
        if (!sideMenu) return;

        evt.preventDefault();
        closeMenu();
    }

    var menuToggles = document.getElementsByClassName("menu-toggle");
    forEach(menuToggles, function (button) {
        button.addEventListener("click", onToggleMenu);
    });

    var menuClosers = document.getElementsByClassName("menu-close");
    forEach(menuClosers, function (button) {
        button.addEventListener("click", onCloseMenu);
    });

    /* Help */
    var help = document.getElementById("help");
    var helpToggles = document.getElementsByClassName("help-toggle");

    var showHelp = function () {
        closeMenus();
        forEach(helpToggles, function (button) {
            button.classList.add("active");
        });
        help.setAttribute(ARIA_EXPANDED, true);
        scrollIntoView(help);
    };
    var hideHelp = function () {
        forEach(helpToggles, function (button) {
            button.classList.remove("active");
            button.blur();
        });
        help.setAttribute(ARIA_EXPANDED, false);
    };
    CLOSERS.push(hideHelp);
    var toggleHelp = function () {
        var isExpanded = help.getAttribute(ARIA_EXPANDED) == "true";
        isExpanded ? hideHelp() : showHelp();
    };
    var onToggleHelp = function (evt) {
        if (!help) return;

        evt.preventDefault();
        toggleHelp();
    };

    forEach(helpToggles, function (button) {
        button.addEventListener("click", onToggleHelp);
    });

    /* Search */
    var search = document.getElementById("header-search-results");
    var searchToggles = document.getElementsByClassName("search-toggle");

    var showSearch = function () {
        closeMenus();
        forEach(searchToggles, function (button) {
            button.classList.add("active");
        });
        search.setAttribute(ARIA_EXPANDED, true);
        scrollIntoView(search);
    };
    var hideSearch = function () {
        forEach(searchToggles, function (button) {
            button.classList.remove("active");
            button.blur();
        });
        search.setAttribute(ARIA_EXPANDED, false);
    };
    CLOSERS.push(hideSearch);
    var toggleSearch = function () {
        var isExpanded = search.getAttribute(ARIA_EXPANDED) == "true";
        isExpanded ? hideSearch() : showSearch();
    };
    var onToggleSearch = function (evt) {
        if (!search) return;

        evt.preventDefault();
        toggleSearch();
    };

    forEach(searchToggles, function (button) {
        button.addEventListener("click", onToggleSearch);
    });

});