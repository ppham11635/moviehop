/** 
* Handles the data returned by the API, read the jsonObject and populate data into html elements
 * @param resultData jsonObject
 */
var autocomplete_cache = {}; //global cache 
$.widget("custom.catcomplete", $.ui.autocomplete, {

    _create: function () {

        this._super();

        this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");

    },

    _renderMenu: function (ul, items) {

        var that = this,

          currentCategory = "";

        $.each(items, function (index, item) {

            var li;

            if (item.category != currentCategory) {

                ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");

                currentCategory = item.category;

            }

            li = that._renderItemData(ul, item);

            if (item.category) {

                li.attr("aria-label", item.category + " : " + item.label);

            }

        });

    }

});
function addMovieTo(value){
	var addMovieUrl = "./items?newItem=" + value;
	var successMsg = "successfully added to cart";
	
	jQuery.ajax({
        dataType: "json", // Setting return data type
        method: "GET", // Setting request method
        url: addMovieUrl, // Setting request url, which is mapped by StarsServlet in Stars.java
        success: function (resultData) { // Setting callback function to handle data returned successfully by the StarsServlet
        	toastr.success(successMsg);
        }, 
        error: function (resultData) {
        	toastr.success(successMsg);
        },
        complete: function (resultData) {
            console.log("End Of Ajax call!");
            //A function to be called when the request finishes 
            // (after success and error callbacks are executed). 
        }
    });
}

function handleSearchResult(resultData) {
	//alert(resultData.length);
	
	var resultData2 = [];
	$.each(resultData, function(index, value){
		if (value.star != null)
		var arrStars = value.star.split(','); 
		if (value.starid != null)
		var arrStarIds = value.starid.split(',');
		
		value.movielink = "<a href='single-movie.html?id=" + value.movieid + "'>" + value.title + "</a>"; 
		
		//value.movietocart = "<button type='button' class='btn btn-primary btn-xs' onclick=window.location.href='items?newItem=" + value.movieid + "'>" + "Add to Cart</button>";
		value.movietocart = "<button type='button' class='btn btn-primary btn-xs' onclick='addMovieTo(\"" + value.movieid + "\");'>" + "Add to Cart</button>";
		
		var step;
		value.starlink = "";
		if (value.starid != null) {
		for (step = 0; step < arrStars.length; step++){
			value.starlink += "<a href='single-star.html?id=" + arrStarIds[step] + "'>" + arrStars[step] + "</a>, ";
		}}
		
		resultData2.push(value);
	});
	
    $('#patricktable').DataTable({
    	destroy: true,
    	"searching": false,
        "data": resultData2,
        "columns": [
//            { 
//            	"title": "Star Link",
//            	"data": "starlink",
//            	"defaultContent": ""
//            },
            { 
            	"title": "Title",
            	"data": "movielink",
            	"width": "15%",
            	"defaultContent": ""
            },
            { 
            	"title": "Add",
            	"data": "movietocart",
            	"defaultContent": ""
            },            
            { 
            	"title": "Year",
            	"data": "year",
            	"defaultContent": ""
            },
            { 
            	"title": "Star",
            	"data": "starlink",
            	"defaultContent": ""
            },
            { 
            	"title": "Director",
            	"data": "director",
            	"width": "15%",
            	"defaultContent": ""
            },
            { 
            	"title": "Genres",
            	"data": "genres",
            	"defaultContent": ""
            },
            { 
            	"title": "Rating",
            	"data": "rating",
            	"defaultContent": "0"
            }
        ]
    });
    
    //alert('end of call');
}

jQuery("#searchButton").click(function (e) {
    //call api to search by Tile
	console.log("Fulltext Search Intiated!");
	var movieAutoStr = "";
    var movieStr = $.trim($("#moviesearchauto").val());
	var arrStars = movieStr.split(' '); 
			for (step = 0; step < arrStars.length; step ++)
				{
					if (arrStars[step].length > 0){
						movieAutoStr += "+" + arrStars[step] + "* ";
					}
					else {
						movieAutoStr += "";
					}
				}
					//var movieAutoStr = " title like '%" + request.term + "%'";
	var movieAutoUrl = "api/fulltext?whereclause=" + encodeURIComponent(movieAutoStr);

    //encode uri for special characters

    // Makes the HTTP GET request and registers on success callback function handleStarResult
    jQuery.ajax({
        dataType: "json", // Setting return data type
        method: "GET", // Setting request method
        url: movieAutoUrl, // Setting request url, which is mapped by StarsServlet in Stars.java
        success: function (resultData) { // Setting callback function to handle data returned successfully by the StarsServlet
        	console.log(resultData);
        	handleSearchResult(resultData);
        }, 
        error: function (resultData) {
            console.log("there was an error");
        },
        complete: function (resultData) {
            //A function to be called when the request finishes 
            // (after success and error callbacks are executed). 
        }
    });
});

$('#moviesearchauto').keypress(function(event) {
	// keyCode 13 is the enter key
	if (event.keyCode == 13) {
		// pass the value of the input box to the handler function
		console.log("Fulltext Search Intiated!");
			var movieAutoStr = "";
		    var movieStr = $.trim($("#moviesearchauto").val());
			var arrStars = movieStr.split(' '); 
					for (step = 0; step < arrStars.length; step ++)
						{
							if (arrStars[step].length > 0){
								movieAutoStr += "+" + arrStars[step] + "* ";
							}
							else {
								movieAutoStr += "";
							}
						}
							//var movieAutoStr = " title like '%" + request.term + "%'";
			var movieAutoUrl = "api/fulltext?whereclause=" + encodeURIComponent(movieAutoStr);

		    //encode uri for special characters

		    // Makes the HTTP GET request and registers on success callback function handleStarResult
		    jQuery.ajax({
		        dataType: "json", // Setting return data type
		        method: "GET", // Setting request method
		        url: movieAutoUrl, // Setting request url, which is mapped by StarsServlet in Stars.java
		        success: function (resultData) { // Setting callback function to handle data returned successfully by the StarsServlet
		        	console.log(resultData);
		        	handleSearchResult(resultData);
		        }, 
		        error: function (resultData) {
		            console.log("there was an error");
		        },
		        complete: function (resultData) {
		            //A function to be called when the request finishes 
		            // (after success and error callbacks are executed). 
		        }
		    });
	}
})


jQuery("#clearButton").click(function (e) {
    //do something
    $("#moviesearchauto").val("");
});
$("#moviesearchauto").catcomplete(
		{
			// source: availableTags,
			source : function(request, response) {
				console.log("autocomplete initiated")
				var searchTerm = request.term.toUpperCase(), items = [];
				var step;
				var movieAutoStr = "";
				var arrStars = request.term.split(' '); 
				//found in cache
                if (autocomplete_cache[searchTerm]) {
                    $.each(autocomplete_cache[searchTerm], function (index, item) {
                    	items.push({
                        	label : item.title,
							value : item.title,
							movieid: item.movieid,
							category: "Movie"
                        });
                    });
                }
                
                if (items.length > 0) {  //found in cache
                	console.log("Get from autocomplete_cache[" + request.term + "] with " + items.length + " records.");
                    console.log(items)
                    response(items)
                    return;
                }             
				for (step = 0; step < arrStars.length; step ++)
				{
					if (arrStars[step].length > 0){
						movieAutoStr += "+" + arrStars[step] + "* ";
					}
					else {
						movieAutoStr += "";
					}
				}
				//var movieAutoStr = " title like '%" + request.term + "%'";
				var movieAutoUrl = "api/auto?whereclause=" + encodeURIComponent(movieAutoStr);
				// this is for beginning matches
				var count = 0;
//				var matcher = new RegExp("^"
//						+ $.ui.autocomplete.escapeRegex(request.term), "i");

				// this is for containing matches

//				var matcher = new RegExp($.ui.autocomplete
//						.escapeRegex(request.term), "i");
				console.log("sending AJAX request to backend Java Servlet")
				$.ajax({
					url : movieAutoUrl,
					type : "GET",
					contentType : "application/json; charset=utf-8",
					dataType : "json",
					cache : false,
					data : {
						//term : encodeURIComponent(movieAutoStr) //request.term
					},
					success : function(data) {
						//add to cache
						autocomplete_cache[request.term.toUpperCase()] = data;
						console.log("Add to autocomplete_cache[" + request.term + "] with " + data.length + " records.");
						console.log("lookup ajax successful")
						console.log(data)
						response($.map(data, function(item){
							if (count <= 10) {
								count += 1;
								return {
									label : item.title,
									value : item.title,
									movieid: item.movieid,
									category: "Movie"
								}
							}
						}));
						// response(data);
					},
					error : function(errorThrown) {
						console.log("lookup ajax error")
						console.log(errorThrown)
					}
				})
			},
			minLength : 3,
			select : function(event, ui) {
				var newUrl = "/project2/single-movie.html?id=" + ui.item.movieid;
				window.location.href = newUrl;
			}
});
			
