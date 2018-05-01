/**
 * Handles the data returned by the API, read the jsonObject and populate data into html elements
 * @param resultData jsonObject
 */
function handleSearchResult(resultData) {
	debugger;
	alert(resultData.length);
	
	var resultData2 = [];
	$.each(resultData, function(index, value){
		var arrStars = value.star.split(',');
		var arrStarIds = value.starid.split(',');
		
		var step;
		value.starlink = "";
		for (step = 0; step < arrStars.length; step++){
			value.starlink += "<a target='_blank' href='single-star.html?id=" + arrStarIds[step] + "'>" + arrStars[step] + "</a><br>";
		}
		
		resultData2.push(value);
	});
	
	
	
    $('#patricktable').DataTable({
    	destroy: true,
        "data": resultData2,
        "columns": [
//            { 
//            	"title": "Star Link",
//            	"data": "starlink",
//            	"defaultContent": ""
//            },
            { 
            	"title": "Title",
            	"data": "title",
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
            	"defaultContent": ""
            },
            { 
            	"title": "Genres",
            	"data": "genres",
            	"defaultContent": ""
            }
        ]
    });
    
    alert('end of call');
}

jQuery("#searchButton").click(function (e) {
    //call api to search by Tile
    debugger;
    var searchStr = "";

    var movieStr = $.trim($("#movieText").val());
    var yearStr = $.trim($("#yearText").val());
    var directorStr = $.trim($("#directorText").val());
    var starStr = $.trim($("#starText").val());
    
    if (movieStr != "") {
        searchStr += " title like '%" + movieStr + "%'";
    }

    if (yearStr != "") {
        if (searchStr.length > 0) {
            searchStr += " and year = " + yearStr;
        }
        else {
            searchStr += "year = " + yearStr;
        }
    }

    if (directorStr != "") {
        if (searchStr.length > 0) {
            searchStr += " and director like '%" + directorStr + "%'";
        }
        else {
            searchStr += "director like '%" + directorStr + "%'";
        }
    }

    if (starStr != "") {
        if (searchStr.length > 0) {
            searchStr += " and stars.name like '%" + starStr + "%'";
        }
        else {
            searchStr += "stars.name like '%" + starStr + "%'";
        }
    }

    //encode uri for special characters
    var searchUrl = "api/stars?whereclause=" + encodeURIComponent(searchStr);

    // Makes the HTTP GET request and registers on success callback function handleStarResult
    jQuery.ajax({
        dataType: "json", // Setting return data type
        method: "GET", // Setting request method
        url: searchUrl, // Setting request url, which is mapped by StarsServlet in Stars.java
        success: function (resultData) { // Setting callback function to handle data returned successfully by the StarsServlet
            handleSearchResult(resultData);
        }, 
        error: function (resultData) {
            debugger;
            console.log("there was an error");
        },
        complete: function (resultData) {
            debugger;
            console.log("End Of Ajax call!");
            //A function to be called when the request finishes 
            // (after success and error callbacks are executed). 
        }
    });
});

jQuery("#clearButton").click(function (e) {
    //do something
    $("#movieText").val("");
    $("#yearText").val("");
    $("#directorText").val("");
    $("#starText").val("");
});