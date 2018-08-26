
function loadData() {

    // In order to adress the ids on the html page
    // the ids have to be associated with variables.
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    // get the data from the forms
    var streetstr = $('#street').val();
    var citystr = $('#city').val();

    // Concatenate the strings
    var location = streetstr + ', ' + citystr;

    // add text to greeting ID.  The text() method sets or
    // returns the text content of the selected elements.
    $greeting.text(location);

    // Append the body element. Insert content, specified by the parameter,
    // to the end of each element in the set of matched elements.
    var googleurl = 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + location;
    $body.append('<img class="bgimg" src="' + googleurl + '">');

    // Now we need to built the NYT URL and get the response data back
    // with $.param I can add parameters to the URL
    var nyturl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nyturl += '?' + $.param({
      'api-key': "b0ce20dbb66d4e6ebe49f5a1f12acba3",
      'q': citystr,
      'sort': 'newest'
        });
    // get the data from the URL and pass it to the anonymous
    // function as data
   $.
    getJSON(nyturl, function(data){
        // Address the header element
        $nytHeaderElem.text('NY Times articles about ' + citystr);

        // create an array with the JSON objects
        // docs in response (VERY COOL)
        articles = data.response.docs;
        // iterate over the length of the array
        for (var i = 0; i < articles.length; i++) {
            // extract for each doc the web URL headline and snippet
            var article = articles[i]
            $nytElem.append('<li class="article">'+
                                '<a href="' + article.web_url + '">'+ article.headline.main + '</a>'+
                                 '<p>' + article.snippet + '</p>'+
                                 '</li>');
        };
    })
     // Just append the error function to the main function. If one failes, then
     // the error function is executed.
     .error(function(e){
            $nytHeaderElem.text('NY Times articles could not be loaded because');
        });

    // Now we need to built the NYT URL and get the response data back
    // with $.param I can add parameters to the URL
    var wikiurl = "https://en.wikipedia.org/w/api.php?";
    wikiurl += '?' + $.param({
      'action': "opensearch",
      'generator': 'allpages',
      'search': citystr,
      'format' : 'json'
        });

    $.ajax(wikiurl { dataType: "jsonp",
                    success: function(response) {
                    var articlelist = response[1];

                    for (var i; i < articlelist.length; i++) {
                        var articlestr = articlelist[i];
                        var url = $wikiElem.append('<p>' + articlestr + '</p>');
                        };

                    };
             };
    });
    .error(function(e){
            $wikiElem.text('Error loading wiki data.');
        });

    return false;
};

// execute the function load data when the form container receives a submit
$('#form-container').submit(loadData);
