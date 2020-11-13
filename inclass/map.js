       //set up svg, nothing new here
        var width = window.innerWidth
        var height = window.innerHeight

        var svg = d3.select("body")
            .append("svg")
            .attr("width",width)
            .attr("height", height);           

        //we need a data file, and a geopath file
        var geoPath = "nyc_boroughs.geojson";//this is a geojson, which is json format of outlines for nyc
        var parkData = "NYC_Parks_Events_2019.csv"
           
        //promise allows us to load many files, and only excutes the code inside it once the files have all loaded
        //before we used d3.csv to load 1 csv file and .then to excute code once its been loaded
        Promise.all([d3.json(geoPath),d3.csv(parkData)])//here we use d3.json to load the json data, and d3.csv to load the csv data
        .then(function(data) {//.then is the same as before, we are just saying wait till loading is done, then do this.
            var geo = data[0];// data in blue in the line above is the result of the promise, so the first item is the geo
            //console.log(data)//try uncommenting and seeing what data is at this point to get a better idea
            var park = data[1]
            
            drawOutline(geo) //call the draw outline function from below 
            drawCircles(park,geo)
            
        });
        
        
        function drawCircles(park,geo){
            var padding = 50
        
            var projection = d3.geoAlbers()
                    .fitExtent([[padding,padding],[width-padding,height-padding]],geo)
            
            var parkObj = {}
            for(var p in park){
                var parkId = park[p]["park_id"]
                
                var currentParkKeys = Object.keys(parkObj)
                
                if(currentParkKeys.indexOf(parkId)==-1){
                    parkObj[parkId]=1
                }else{
                    parkObj[parkId]=parkObj[parkId]+1
                }
            }
            console.log(parkObj)
            
            svg.selectAll("circle")
            .data(park)
            .enter()
            .append("circle")
            .attr("cx",function(d,i){
                var lat = d.lat
                var lng = d.long
                
                return projection([lng,lat])[0]
            })
            .attr("cy",function(d,i){
                return projection([d.long,d.lat])[1]
            })
            .attr("r",5)
            .attr("opacity",.05)
            
            console.log(park)
            
        }
        
        
        function drawOutline(geo){
            var padding = 50
        
            var projection = d3.geoAlbers()
                    .fitExtent([[padding,padding],[width-padding,height-padding]],geo)
            
            var path = d3.geoPath().projection(projection);

            svg.append("path")
                .attr("d", path(geo))
                .attr("fill", "none")
                .attr("stroke","black")
            
            
            
        }