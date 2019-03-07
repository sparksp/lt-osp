/*! search.js */

function Delayed(_timeout) {
    var timeout = _timeout;
    var timer = null;

    this.delay = function (callback) {
        clearTimeout(timer);
        timer = setTimeout(callback, timeout);
    }
    this.callback = function (name, callback) {
        this[name] = function () {
            var args = arguments;
            this.delay(function () {
                callback.apply(null, args);
            });
        }
    }
}

$(function () {
    const fuseOptions = {
        distance: 100,
        location: 0,
        maxPatternLength: 32,
        minMatchCharLength: 3,
        shouldSort: true,
        threshold: 0.1,
        tokenize: true,
        keys: [
            { name: "title", weight: 0.8 },
            { name: "contents", weight: 0.5 },
            { name: "guilds", weight: 0.3 }
        ]
    };
    const page_title = document.title;
    const min_query_length = 3;
    const delayed = new Delayed(500);
    delayed.callback("search", search);

    var pages, fuse, last_query;
    var params = new URLSearchParams(location.search);
    var base_url = new URL(window.location);
    base_url.search = "";
    var is_search_page = false;
    var templateDefinition = $('#search-result-template').html();

    (function () {
        var search_later;
        this.deferSearch = function deferSearch(query) {
            if (query !== undefined) {
                return search_later = query;
            }
            query = search_later;
            search_later = null;
            search(query);
        }
    })();

    $.getJSON("/search/index.json", function (data) {
        pages = data;
        fuse = new Fuse(pages, fuseOptions);
        deferSearch();
    });

    $('form[role=search]').each(function (_, form) {
        if (!is_search_page) {
            is_search_page = (form.action == base_url.href);
        }

        var queryInput = form.elements.namedItem("q");
        $(queryInput).on("change keyup blur", function (evt) {
            var query = this.value;
            delayed.search(query);
        });
        $(queryInput).val(params.get("q"));

        $(form).submit(function (evt) {
            evt.preventDefault();
            var query = form.elements.namedItem("q").value;
            search(query)
        });
    });

    search(params.get("q"));

    function search(query) {
        if (!query || query == last_query || query.length < min_query_length) {
            return deferSearch(null);
        }
        if (!fuse) {
            return deferSearch(query);
        }
        last_query = query;
        updateLocation(query);
        populateResults(fuse.search(query), { query });
    }

    function updateLocation(query) {
        if (!is_search_page) return;

        var url = new URL(base_url);
        url.search = "?q=" + query;
        document.title = query + " - " + page_title;
        history.replaceState(history.state, document.title, url);
    }

    function populateResults(results, { query }) {
        $(".no-search-query").hide();
        $(".no-search-results").hide();
        $(".search-results").hide();

        if (results.length == 0) {
            $(".no-search-results").show();
            return;
        }
        $(".search-results").empty().show();
        $(results).each(function (_, result) {
            populateResult(result, { query });
        });
    }

    function populateResult(result, { query }) {
        var contents = result.contents;
        var output = render(templateDefinition, { id: result.id, title: text(result.title), link: result.permalink, guilds: result.guilds, summary: result.summary });
        $('.search-results').append(output);
        $("#summary-" + result.id).mark(query);
    }

    function render(templateString, data) {
        var key, find, re;
        for (key in data) {
            find = '\\$\\{\\s*' + key + '\\s*\\}';
            re = new RegExp(find, 'g');
            templateString = templateString.replace(re, data[key]);
        }
        return templateString;
    }

    function text(string) {
        return $('<div>').text(string).html();
    }
});