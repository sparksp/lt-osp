/*! Taxonomy */
onReady(function () {
    'use strict';
    var lineColor = "#999";
    var options = {
        color: lineColor,
        dash: false,
        dropShadow: false,
        endPlugColor: lineColor,
        endSocket: 'top',
        gradient: false,
        startPlugColor: lineColor
    };
    var highlightColor = "black";
    var connectionColor = "#666";
    var highlightShadow = "0 0 2px 1px rgba(0, 0, 0, .3)";
    var cells = document.getElementsByClassName("cell");
    Array.from(cells).forEach(function (cell) {
        cell.addEventListener('touchend', function (evt) {
            if (document.activeElement == evt.target) {
                return;
            }
            evt.preventDefault();
            evt.target.focus();
        });

        if (!cell.dataset.prerequisite) {
            return;
        }
        var lines = [];
        addResizeListener(document.body, function () {
            lines.forEach(function (line) {
                line.position();
            });
        });

        var prerequisites = cell.dataset.prerequisite.split(";");
        prerequisites.forEach(function (prerequisiteId) {
            var prerequisite = document.getElementById(prerequisiteId);
            if (!prerequisite) {
                return;
            }
            cell.classList.add("has-prerequisite");
            var line = new LeaderLine(prerequisite, cell, options);
            addResizeListener(cell.parentNode, function () {
                line.position();
            });
            lines.push(line);

            var reset = function () {
                line.setOptions(options);
                prerequisite.style.boxShadow = "none";
                prerequisite.style.borderColor = null;
                cell.style.boxShadow = "none";
                cell.style.borderColor = null;
            };

            var onPrerequisiteFocus = function () {
                line.setOptions({
                    startPlugColor: highlightColor,
                    endPlugColor: connectionColor,
                    gradient: true
                });
                prerequisite.style.boxShadow = highlightShadow;
                cell.style.borderColor = connectionColor;
            };

            prerequisite.addEventListener('mouseenter', onPrerequisiteFocus);
            prerequisite.addEventListener('focus', onPrerequisiteFocus);
            prerequisite.addEventListener('mouseleave', reset);
            prerequisite.addEventListener('blur', reset);

            var onCellFocus = function () {
                line.setOptions({
                    startPlugColor: connectionColor,
                    endPlugColor: highlightColor,
                    gradient: true
                });
                prerequisite.style.borderColor = connectionColor;
                cell.style.boxShadow = highlightShadow;
            };

            cell.addEventListener('mouseenter', onCellFocus);
            cell.addEventListener('focus', onCellFocus);
            cell.addEventListener('mouseleave', reset);
            cell.addEventListener('blur', reset);
        });
    });
});