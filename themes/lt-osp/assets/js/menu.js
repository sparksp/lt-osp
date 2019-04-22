/*! Menu */
$(function () {
    'use strict';

    const ARIA_EXPANDED = "aria-expanded";

    /* Accounts for the height of a sticky banner at the top of the viewport */
    var scrollIntoView = function (elm) {
        elm.scrollIntoView(true);
        if (window.scrollY) {
            var banner = document.getElementById("banner");
            window.scroll(0, window.scrollY - banner.clientHeight);
        }
    };

    var sideMenu = document.getElementById("side-menu");

    var toggleMenu = function () {
        var expanded = sideMenu.getAttribute(ARIA_EXPANDED);
        sideMenu.setAttribute(ARIA_EXPANDED, expanded != "true");
    };
    var onToggleMenu = function (evt) {
        if (!sideMenu) return;

        evt.preventDefault();
        toggleMenu();
    };

    var menuToggles = document.getElementsByClassName("menu-toggle");
    Array.from(menuToggles).forEach(function (button) {
        button.addEventListener("click", onToggleMenu);
    });

    var menuClosers = document.getElementsByClassName("menu-close");
    Array.from(menuClosers).forEach(function (button) {
        button.addEventListener("click", onToggleMenu);
    });

    var help = document.getElementById("help");
    var helpToggles = document.getElementsByClassName("help-toggle");

    var showHelp = function () {
        Array.from(helpToggles).forEach(function (button) {
            button.classList.add("active");
        });
        help.setAttribute(ARIA_EXPANDED, true);
        scrollIntoView(help);
    };
    var hideHelp = function () {
        Array.from(helpToggles).forEach(function (button) {
            button.classList.remove("active");
            button.blur();
        });
        help.setAttribute(ARIA_EXPANDED, false);
    };
    var toggleHelp = function () {
        var isExpanded = help.getAttribute(ARIA_EXPANDED) == "true";
        isExpanded ? hideHelp() : showHelp();
    };
    var onToggleHelp = function (evt) {
        if (!help) return;

        evt.preventDefault();
        toggleHelp();
    };

    Array.from(helpToggles).forEach(function (button) {
        button.addEventListener("click", onToggleHelp);
    });
});