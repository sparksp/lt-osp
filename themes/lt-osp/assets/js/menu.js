/*! Menu */
$(function () {
    'use strict';

    var mainMenu = document.getElementById("main-menu");

    var menuToggles = document.getElementsByClassName("menu-toggle");
    var expandMenu = function () {
        mainMenu.setAttribute("aria-expanded", true);
    };
    var onExpandMenu = function (evt) {
        evt.preventDefault();
        expandMenu();
    };
    Array.from(menuToggles).forEach(function (button) {
        button.addEventListener("click", onExpandMenu);
    });

    var menuClosers = document.getElementsByClassName("menu-close");
    var onCollapseMenu = function (evt) {
        evt.preventDefault();
        collapseMenu();
    };
    var collapseMenu = function () {
        mainMenu.setAttribute("aria-expanded", false);
    };
    Array.from(menuClosers).forEach(function (button) {
        button.addEventListener("click", onCollapseMenu);
    });
});