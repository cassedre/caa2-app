$("#update_item").submit(function(event){
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {}

    $.map(unindexed_array, function(n, i){
        data[n['name']] = n['value']
    })


    var request = {
        "url" : `https://cafeitemlist.herokuapp.com/`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        window.location.replace('/')
    })

})

if(window.location.pathname == "/"){
    $ondelete = $(".delete");
    $ondelete.click(function(){
        var id= $(this).attr("data-id")
        var request = {
            "url" : `https://cafeitemlist.herokuapp.com/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Would you like to delete it?")){
            $.ajax(request).done(function(response){
                alert("Deleted Successfully!");
                location.reload();
            })
        }

    })
}
