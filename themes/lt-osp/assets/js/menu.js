/*! Menu */
$(function () {
    'use strict';

    var mainMenu = document.getElementById("main-menu");

    var toggleMenu = function () {
        var expanded = mainMenu.getAttribute("aria-expanded");
        mainMenu.setAttribute("aria-expanded", expanded != "true");
    };
    var onToggleMenu = function (evt) {
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
});