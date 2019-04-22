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
        $(queryInput).on("keyup", function (evt) {
            var query = queryInput.value;
            delayed.search(query);
        });
        $(queryInput).on("search change blur", function (evt) {
            var query = queryInput.value;
            search(query);
        });

        $(form).submit(function (evt) {
            evt.preventDefault();
            var query = form.elements.namedItem("q").value;
            search(query)
        });
    });

    if (is_search_page) {
        $("input[name=q]").val(params.get("q"));
        search(params.get("q"));
    }

    $('#header-search-results')
        .on("mouseenter", "article", function (e) {
            $(e.target).closest("article").addClass("hover");
        })
        .on("mouseleave", "article", function (e) {
            $(e.target).closest("article").removeClass("hover");
        })
        .on("click", "article", function (e) {
            var href = $(e.target).closest("article").find("a[href]").attr("href");
            if (href) window.location = href;
        });

    function search(query) {
        if (!fuse) {
            return deferSearch(query);
        }
        deferSearch(null);
        if (query == last_query) {
            return;
        }
        last_query = query;
        updateInput(query);
        updateLocation(query);
        if (!query || query.length < min_query_length) {
            populateResults([], { query });
            return;
        }
        populateResults(fuse.search(query), { query });
    }

    function updateInput(query) {
        $('form[role=search] input[name=q]').val(query);
    }

    function updateLocation(query) {
        if (!is_search_page) return;

        var url = new URL(base_url);
        var search_title = page_title;
        if (query.length) {
            url.search = "?q=" + query;
            search_title = query + " - " + search_title;
        }
        document.title = search_title;
        history.replaceState(history.state, search_title, url);
    }

    function populateResults(results, { query }) {
        $(".no-search-query").hide();
        $(".no-search-results").hide();
        $(".search-results").hide();

        const max_results = 5;
        var result_count = results.length;

        if (query.length == 0) {
            $(".no-search-query").last().show();
            return;
        }
        if (result_count == 0) {
            $(".no-search-results").last().show();
            return;
        }
        $(".search-results").empty().last().show();
        if (!is_search_page) {
            results = results.slice(0, max_results);
        }
        $(results).each(function (_, result) {
            populateResult(result, { query });
        });
        if (!is_search_page && result_count > max_results) {
            var more_link = '<article class="more-results"><a href="/search/?q=' + query + '">See all ' + result_count + ' results</a></article>';
            $('.search-results').last().append(more_link);
        }
        $(document).scrollTop(0);
    }

    function populateResult(result, { query }) {
        var contents = result.contents;
        var output = render(templateDefinition, { id: result.id, title: text(result.title), link: result.permalink, guilds: result.guilds, summary: result.summary });
        $('.search-results').last().append(output);
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