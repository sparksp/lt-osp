/*! Taxonomy */
onReady(function () {
    'use strict';
    var lineColor = "#999";
    var options = {
        color: lineColor,
        dash: false,
        dropShadow: false,
        endPlugColor: lineColor,
        gradient: false,
        startPlugColor: lineColor
    };
    var highlightColor = "black";
    var connectionColor = "#666";
    var highlightShadow = "0 0 2px 1px rgba(0, 0, 0, .3)";
    var skills = document.getElementsByClassName("skill");
    Array.from(skills).forEach(skill => {
        skill.addEventListener('touchend', (evt) => {
            if (document.activeElement == evt.target) {
                return;
            }
            evt.preventDefault();
            evt.target.focus();
        });

        if (!skill.dataset.prerequisite) {
            return;
        }
        var prerequisites = skill.dataset.prerequisite.split(";");
        prerequisites.forEach(prerequisiteId => {
            var prerequisite = document.getElementById(prerequisiteId);
            if (!prerequisite) {
                return;
            }
            var line = new LeaderLine(prerequisite, skill, options);

            var reset = () => {
                line.setOptions(options);
                prerequisite.style.boxShadow = "none";
                prerequisite.style.borderColor = null;
                skill.style.boxShadow = "none";
                skill.style.borderColor = null;
            };

            var onPrerequisiteFocus = () => {
                line.setOptions({
                    startPlugColor: highlightColor,
                    endPlugColor: connectionColor,
                    gradient: true
                });
                prerequisite.style.boxShadow = highlightShadow;
                skill.style.borderColor = connectionColor;
            };

            prerequisite.addEventListener('mouseenter', onPrerequisiteFocus);
            prerequisite.addEventListener('focus', onPrerequisiteFocus);
            prerequisite.addEventListener('mouseleave', reset);
            prerequisite.addEventListener('blur', reset);

            var onSkillFocus = () => {
                line.setOptions({
                    startPlugColor: connectionColor,
                    endPlugColor: highlightColor,
                    gradient: true
                });
                prerequisite.style.borderColor = connectionColor;
                skill.style.boxShadow = highlightShadow;
            };

            skill.addEventListener('mouseenter', onSkillFocus);
            skill.addEventListener('focus', onSkillFocus);
            skill.addEventListener('mouseleave', reset);
            skill.addEventListener('blur', reset);
        });
    });
});