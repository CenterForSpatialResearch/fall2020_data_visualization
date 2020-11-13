
			//Width and height
			var w = 750;
			var h = 425;
			var padding = 40;

			var dataset, xScale, yScale, xAxis, yAxis, cScale;  //Empty, for now

			//Function for converting CSV values from strings to Dates and numbers
			var rowConverter = function(d) {
				return {
					Time: parseInt(d.Time),
					Amount: parseFloat(d.Amount),
					Hour: parseFloat(d.Hour)
				};
			}

			//Load in the data
			d3.csv("data01.csv", rowConverter)
            .then(function(data) {
//d3.csv("data01.csv", function(error, data) {
				//Copy data into global dataset
				dataset = data;

				//Create scale functions
				xScale = d3.scaleLinear()
							   .domain([
									 0,  //Because I want a zero baseline
 									d3.max(dataset, function(d) {
										if (d.Time<25){
											return d.Time;
										}
										})
								])
							   .range([padding, w - padding]);

				yScale = d3.scaleLinear()
							   .domain([
									0,  //Because I want a zero baseline
									d3.max(dataset, function(d) {

											return d.Amount;

										 })
								])
							   .range([h - padding, padding]);

				//Define X axis
				xAxis = d3.axisBottom()
								  .scale(xScale)
								  .ticks(24);//change ticks
								 // .tickFormat(formatTime);

				//Define Y axis
				yAxis = d3.axisLeft()
								  .scale(yScale)
								  .ticks(9);

				//Create SVG element
				var svg = d3.select("#scatter")
							.append("svg")
							.attr("width", w)
							.attr("height", h);

							//Generate guide lines
		/*						svg.selectAll("line")
							   .data(dataset)
							   .enter()
							   .append("line")
							   .attr("x1", function(d) {
								if(d.Time<25 && d.Time>0){
									return xScale(d.Time);
								}
							   })
							   .attr("x2", function(d) {
									 if(d.Time<25 && d.Time>0){
										 return xScale(d.Time);
									 }
							   })
							   .attr("y1", h - padding)
							   .attr("y2", padding)
			           .attr("stroke","white")
			           .attr("stroke-width", 0.5);     */

					 var showAmount = function(){
						svg.selectAll("circle")
						.append("title")
						.attr("id","tooltip")
/*						.text(d.Hour-1+":00~"+d.Hour+":00 :  "+d.Amount+" minute(s) on "+function(d){
							if(d.Time<25){
								return "WeChat";
							} else if(d.Time<49){
								return "Instagram";
							}else if(d.Time<73){
								return "HUPU";
							}else {
								return "Alipay";
							}
						})          */
						.text(function(d){
							if(d.Time<25){
								return d.Hour-1+":00~"+d.Hour+":00 :  "+d.Amount+" minute(s) on WeChat";
							} else if(d.Time<49){
								return d.Hour-1+":00~"+d.Hour+":00 :  "+d.Amount+" minute(s) on Instagram";
							}else if(d.Time<73){
								return d.Hour-1+":00~"+d.Hour+":00 :  "+d.Amount+" minute(s) on HUPU";
							}else {
								return d.Hour-1+":00~"+d.Hour+":00 :  "+d.Amount+" minute(s) on Alipay";
							}
						})
					}

				//Generate circles last, so they appear in front
				svg.selectAll("circle")
				   .data(dataset)
				   .enter()
				   .append("circle")
				   .attr("cx", function(d) {
			        return xScale(d.Hour);
				   })
				   .attr("cy", function(d) {
						// if(d.Time<25){
							 	return yScale(d.Amount);
				/*		 }else if(d.Time<49){
							 return yScale(d.Amount);
						 }  */

				   })
				   .attr("r", function(d) {
					//	 if(d.Time<25){
							 return Math.max(1.75*d.Amount,2.5);
						// }

				   })

					 .attr("fill",function(d){
						 if (d.Time<25){
							 return "rgba(243,182,209,0.75)";
						 } else if (d.Time <49){
							 return "rgba(160,125,183,0.75)";
						 }else if (d.Time <73){
							 return "rgba(124,162,213,0.75)";
						 }else  {
							 return "rgba(173,217,195,0.75)";
						 }
					 })
					.on("mouseover",function(d,i){
				//		if(d.Time<25){
							d3.select(this).attr("fill","white");
						 showAmount();//show tooltip here
				//		}

			})
					.on("mouseout",function(d,i){
								d3.select(this).attr("fill",function(d){
									if(d.Time<25){
										return "rgba(243,182,209,0.75)";
								}else if (d.Time<49){
									return "rgba(160,125,183,0.75)";
								}else if (d.Time <73){
	 							 return "rgba(124,162,213,0.75)";
	 						 }else  {
								 return "rgba(173,217,195,0.75)";
							 }
							});
								d3.select("#tooltip").remove()//hide tooltip here
							});


/*					svg.selectAll("text")
						.data(dataset)
						.enter()
						.append("text")
						.text(function(d) {
							return d.Amount;
						})
						.attr("x", function(d) {
							 return xScale(d.Date)-5.5;
						})
						.attr("y", function(d) {
							return yScale(d.Amount)-5;
						})
						.attr("font-family", "sans-serif")
						.attr("font-size", "10px")
						.attr("fill", "white"); */

	   			//Create X axis
	   			svg.append("g")
	   				.attr("class", "axis")
	   				.attr("transform", "translate(0," + (h - padding) + ")")
                            .call(xAxis);


	   			//Create Y axis
	   			svg.append("g")
	   				.attr("class", "axis")
	   				.attr("transform", "translate(" + padding + ",0)")
                            .call(yAxis);





					svg.selectAll("circle")
					   .enter()
					   .append("circle")
						 .attr("cx", "100")
						 .attr("cy", "270")
						 .attr("r", "50")
						 .attr("fill", "rgba(243,182,209,0.75)");


			});
