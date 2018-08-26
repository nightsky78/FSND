$(function() {
    // the main function is executed while the page loads
    // Defining the data object with my data object. If there is a new cat, I just add it.
    var data = {
        cat1 :  {
            id : 1,
            name : "Skippy",
            url : "https://i.pinimg.com/564x/37/d2/bd/37d2bdbbcfa7f104b4c7b75759ce197b.jpg",
            click_count : 0
            },

        cat2 : {
            id : 2,
            name : "Spotty",
            url : "https://i.pinimg.com/564x/3d/3a/04/3d3a04f3405c4191487b564c34197b78.jpg",
            click_count : 0
            },

        cat3 : {
            id : 3,
            name : "Pussy",
            url : "https://i.pinimg.com/564x/8a/26/54/8a265443031942424bdb77b3deec02db.jpg",
            click_count : 0
            }
    };


    var octopus = {

        // The View is not allowed to talk to the model. So we need to insert the tunnel
        getListOfCats: function(){
                cats = data;
                return cats;
            },
        // The View is not allowed to talk to the model. So we need to insert the tunnel
        getCat: function(){},

        // Just count up
        countUp : function(cat_id){
             // find the right cat

             // call the add count function
        },

        init: function() {
            view.init();
        }
     }


    var view = {
            // Init function to set things up
            init : function(){
                var catList = octopus.getListOfCats();
                //The first cat will always be the one appearing fist so I can build the main div here.
                $(picture).append('<img src="' + catList.cat1.url +
                     '" alt="' + catList.cat1.name + '"> <p>Clicks: ' + catList.cat1.click_count + '</p>');


                /* While page loads, the cats are shown in the below section
                for each cat in data add a div containing the cat.
                The ID of the cat needs to be different.
                We need a foreach function. */
                for (var key in catList) {
                  if (catList.hasOwnProperty(key)) {
                    console.log(key, catList[key]);
                    $(catlist).append('<div class="cat project" data-id=' + catList[key].id + ' >' +
                        '<p id="' + catList[key].name + '" class="text"></p>' +
                        '<img class="glow tile" ' +
                        ' alt="Cat1"src="' + catList[key].url +'">' +
                        catList[key].name +
                        '</div>')
                    };
                }



             },

            // render function to update the view.
            render : function(){
                // grab elements and html from the DOM to reuse it.
                // the catlist I need later to listen to where it is clicked

                // This just grabs some text to create a template.

                // Delegated event to listen for removal clicks
                // It listens to clicks on the whole pizza list on class remove pizza.
                // This function displays the cat in the middle, depending what is clicked.
                // Get the element which is clicked. I am not sure if i can do this.

            }
    };
    octopus.init();







    /*

    // Now I add a click function with the cat ID as input parameter.
    // This will help me to count the right cat upward.
    $(picture).click(function(cat_name) {

            // Find the right cat in data.
            console.log(cat_name)
            // Add a counter to the right cat.



    });

    var i = 0;
    var j = 0;
    var h = 0;

    // Now I have to program the clicks. The element had been generated with cat as the ID

    # Adding all cats in the data object
    $("#Cat_name1").text(data.cat1.name);
    $("#Cat_name2").text(data.cat2.name);
    $("#Cat_name3").text(data.cat3.name);

    $('#cat_img1').click(function(e) {

      console.log(i);

      $("#counter1").text('counter: ' + i);
      i++;
    });

    $('#cat_img2').click(function(e) {

      console.log(j);

      $("#counter2").text('counter: ' + j);
      j++;
    });

    $('#cat_img3').click(function(e) {

      console.log(h);

      $("#counter3").text('counter: ' + h);
      h++;
    });
    */
}());