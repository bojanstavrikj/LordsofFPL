d3.json("https://peaceful-harbor-25221.herokuapp.com/https://fantasy.premierleague.com/api/bootstrap-static/", function(error, data) {
	if (error) throw error;

	console.log(data["events"])
	// console.log(Object.keys(data))
	var elements_stat = ""
	for(i= 0; i < data["events"].length; i++){
		data["events"][i].id == data["events"].filter(d=>{return d.is_current == true})[0].id ? elements_stat += "<option selected value='"+ data["events"][i].id + "'>" + data["events"][i].id + "</option>" : elements_stat += "<option value='"+ data["events"][i].id + "'>" + data["events"][i].id + "</option>";
	}
	$(document).ready(function(){
	  // Initialize select2
	  $("#gw-selected").select2();
	});

	document.getElementById("gw-selected").innerHTML = elements_stat;

	var current_gw_data = data["events"].filter(d=>{return d.is_current == true})

	var gw_number = current_gw_data[0].id

	
	// var current_gw_data = data["events"].filter(d=>{return d.id == 8})
	update_gw_data (current_gw_data, data)
	
	$("#gw-selected").on("change",() => {
		var gw_to_show = $("#gw-selected").val()

		var current_gw_data = data["events"].filter(d=>{return d.id == gw_to_show})
		update_gw_data (current_gw_data, data)

		console.log(current_gw_data[0].id)
	})

	console.log(current_gw_data[0].id)
	
})

function update_gw_data (current_gw_data,data){
		$("#most_captained_img").empty()
		$("#most_captained_name").empty()
		$("#most_captained_value").empty()

		$("#most_selected_img").empty()
		$("#most_selected_name").empty()
		$("#most_selected_value").empty()

		$("#most_transferred_in_img").empty()
		$("#most_transferred_in_name").empty()
		$("#most_transferred_in_value").empty()

		$("#most_vicecaptained_img").empty()
		$("#most_vicecaptained_name").empty()
		$("#most_vicecaptained_value").empty()

		$("#top_scorrer_img").empty()
		$("#top_scorrer_name").empty()
		$("#top_scorrer_value").empty()


		$("#average_score").empty()
		$("#highest_score").empty()
		$("#transfers_made").empty()

		$("#highest-scorer").empty()
		$("#active_chip").empty()
		$("#transfer_cost").empty()
		$("#transfers_made_hs").empty()
		
		var player_data =  data.elements

		//GAMEWEEK
		// document.getElementById("gameweek").innerHTML= `Gameweek ${current_gw_data[0].id}`;

		//IMAGE FOR MOST PER GAMEWEEK
		document.getElementById("most_captained_img").src=`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player_data.filter(d=>{ return d.id == current_gw_data[0].most_captained})[0].code}.png`;
		document.getElementById("most_selected_img").src=`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player_data.filter(d=>{ return d.id == current_gw_data[0].most_selected})[0].code}.png`;
		document.getElementById("most_transferred_in_img").src=`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player_data.filter(d=>{ return d.id == current_gw_data[0].most_transferred_in})[0].code}.png`;
		document.getElementById("most_vicecaptained_img").src=`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player_data.filter(d=>{ return d.id == current_gw_data[0].most_vice_captained})[0].code}.png`;
		document.getElementById("top_scorrer_img").src=`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player_data.filter(d=>{ return d.id == current_gw_data[0].top_element})[0].code}.png`;

		//NAME FOR HIGHEST STATS PER GAMEWEEK
		document.getElementById("most_captained_name").innerHTML= `${player_data.filter(d=>{ return d.id == current_gw_data[0].most_captained})[0].web_name}`;
		document.getElementById("most_selected_name").innerHTML= `${player_data.filter(d=>{ return d.id == current_gw_data[0].most_selected})[0].web_name}`;
		document.getElementById("most_transferred_in_name").innerHTML= `${player_data.filter(d=>{ return d.id == current_gw_data[0].most_transferred_in})[0].web_name}`;
		document.getElementById("most_vicecaptained_name").innerHTML= `${player_data.filter(d=>{ return d.id == current_gw_data[0].most_vice_captained})[0].web_name}`;
		document.getElementById("top_scorrer_name").innerHTML= `${player_data.filter(d=>{ return d.id == current_gw_data[0].top_element})[0].web_name}`;


		// CHIPS PLAYED
		try {
    		bboost = (d3.format(",d"))(current_gw_data[0].chip_plays.filter(d=>{ return d.chip_name == "bboost"})[0].num_played)
    	} catch {
    		bboost = 0
    	}
    	try {
    		freehit = (d3.format(",d"))(current_gw_data[0].chip_plays.filter(d=>{ return d.chip_name == "freehit"})[0].num_played)
    	} catch {
    		freehit = 0
    	}
    	try {
    		wildcard = (d3.format(",d"))(current_gw_data[0].chip_plays.filter(d=>{ return d.chip_name == "wildcard"})[0].num_played)
    	} catch {
    		wildcard = 0
    	}
    	try {
    		tc = (d3.format(",d"))(current_gw_data[0].chip_plays.filter(d=>{ return d.chip_name == "3xc"})[0].num_played)
    	} catch {
    		tc = 0
    	}
		document.getElementById("bench_boost").innerHTML= `${bboost}`
		document.getElementById("freehit").innerHTML= `${freehit}`
		document.getElementById("wildcard").innerHTML= `${wildcard}`
		document.getElementById("tripplecaptain").innerHTML= `${tc}`
		console.log(current_gw_data[0].chip_plays[0].num_played)

		// document.getElementById("most_captained_value").innerHTML= `${player_data.filter(d=>{ return d.id == current_gw_data[0].most_captained})[0].event_points} pts`;
		// document.getElementById("most_selected_value").innerHTML= `${player_data.filter(d=>{ return d.id == current_gw_data[0].most_selected})[0].event_points} pts`;
		// document.getElementById("most_transferred_in_value").innerHTML= `${player_data.filter(d=>{ return d.id == current_gw_data[0].most_transferred_in})[0].event_points} pts`;
		// document.getElementById("most_vicecaptained_value").innerHTML= `${player_data.filter(d=>{ return d.id == current_gw_data[0].most_vice_captained})[0].event_points} pts`;
		// document.getElementById("top_scorrer_value").innerHTML= `${player_data.filter(d=>{ return d.id == current_gw_data[0].top_element})[0].event_points} pts`;
		

	    d3.json(`https://peaceful-harbor-25221.herokuapp.com/https://fantasy.premierleague.com/api/element-summary/${current_gw_data[0].most_captained}/`, function(error, player_data) {
	    	if (error) throw error;

	    	arr = player_data.history.filter(d=> {return d.round == current_gw_data[0].id})
	    	sum = arr.reduce((acc, curr) => acc + curr.total_points, 0)
	    	document.getElementById("most_captained_value").innerHTML= `${sum} pts`
		})
		d3.json(`https://peaceful-harbor-25221.herokuapp.com/https://fantasy.premierleague.com/api/element-summary/${current_gw_data[0].most_selected}/`, function(error, player_data) {
	    	if (error) throw error;
	    	
	    	arr = player_data.history.filter(d=> {return d.round == current_gw_data[0].id})
	    	sum = arr.reduce((acc, curr) => acc + curr.total_points, 0)
	    	
	    	document.getElementById("most_selected_value").innerHTML= `${sum} pts`
		})
		d3.json(`https://peaceful-harbor-25221.herokuapp.com/https://fantasy.premierleague.com/api/element-summary/${current_gw_data[0].most_transferred_in}/`, function(error, player_data) {
	    	if (error) throw error;
	    	
	    	arr = player_data.history.filter(d=> {return d.round == current_gw_data[0].id})
	    	sum = arr.reduce((acc, curr) => acc + curr.total_points, 0)

	    	document.getElementById("most_transferred_in_value").innerHTML= `${sum} pts`
		})
		d3.json(`https://peaceful-harbor-25221.herokuapp.com/https://fantasy.premierleague.com/api/element-summary/${current_gw_data[0].most_vice_captained}/`, function(error, player_data) {
	    	if (error) throw error;
	    	
	    	arr = player_data.history.filter(d=> {return d.round == current_gw_data[0].id})
	    	sum = arr.reduce((acc, curr) => acc + curr.total_points, 0)

	    	document.getElementById("most_vicecaptained_value").innerHTML= `${sum} pts`
		})
		d3.json(`https://peaceful-harbor-25221.herokuapp.com/https://fantasy.premierleague.com/api/element-summary/${current_gw_data[0].top_element}/`, function(error, player_data) {
	    	if (error) throw error;
	    	
	    	arr = player_data.history.filter(d=> {return d.round == current_gw_data[0].id})
	    	sum = arr.reduce((acc, curr) => acc + curr.total_points, 0)

	    	document.getElementById("top_scorrer_value").innerHTML= `${sum} pts`
		})

		document.getElementById("average_score").innerHTML= `${current_gw_data[0].average_entry_score}`;
		document.getElementById("highest_score").innerHTML= `${current_gw_data[0].highest_score}`;
		document.getElementById("transfers_made").innerHTML= `${(d3.format(",d"))(current_gw_data[0].transfers_made)}`;

		

		document.getElementById("highest_score").onclick = function () {
		    window.location.href = "index.html?user_id="+current_gw_data[0].highest_scoring_entry+"";
		};

		console.log(current_gw_data[0].highest_scoring_entry)
		console.log(player_data.filter(d=>{ return d.id == current_gw_data[0].most_captained})[0])

		d3.json(`https://peaceful-harbor-25221.herokuapp.com/https://fantasy.premierleague.com/api/entry/${current_gw_data[0].highest_scoring_entry}/`, function(error, player_data) {
	    	if (error) throw error;
	    	console.log(player_data)
	    	// arr = player_data.history.filter(d=> {return d.round == current_gw_data[0].id})
	    	// sum = arr.reduce((acc, curr) => acc + curr.total_points, 0)

	    	document.getElementById("team-name").innerHTML= `${player_data.name}`
	    	document.getElementById("overall-rank").innerHTML= `${(d3.format(",d"))(player_data.summary_overall_rank)}`
	    	document.getElementById("overall-points").innerHTML= `${(d3.format(",d"))(player_data.summary_overall_points)} pts`
		})

		// FOOTBALL PITCH TEAM SELECTION
		// Call update functions bsaed on callbacks 
		// function getUrlVars(){
		//     var vars = [], hash;
		//     var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		//     for(var i = 0; i < hashes.length; i++)
		//     {
		//         hash = hashes[i].split('=');
		//         vars.push(hash[0]);
		//         vars[hash[0]] = hash[1];
		//     }
		//     return vars;
		// }

		// if (window.location.href.includes("user_id")) {
		// 	// If redirected with selection
		// 	all_uniq_trans = []
		// 	bank_number = 0
		// 	tot_pts = 0
		// 	let redirect_options = getUrlVars()["user_id"]
		// 	update_players(redirect_options)
		// } else {
		// 	//default
		// 	all_uniq_trans = []
		// 	bank_number = 0
		// 	tot_pts = 0
		// 	update_players(3370907)
		// }
		update_players(current_gw_data[0].highest_scoring_entry)
		

		var floor10 = (value, exp) => decimalAdjust('floor', value, exp);
		const ceil10 = (value, exp) => decimalAdjust('ceil', value, exp);

		var tooltip_actions = d3.select("body")
		    .append("div")
		    .attr("class", "tooltip_actions")
		    .style("opacity", 0);

		var gw_next = 0
		var gw = 0
		var missing_players = []
		var unique_positions_missing = []
		var all_uniq_trans = []
		var bank_number = 0
		var tot_pts = 0
		function update_players (team_id) {
			$("#highest-scorer").empty()

			var scale = d3.scale.linear()
				.domain([0, 100])
				.range([0, 500]);
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			 
			 $("#error-message").empty()
				$("#error-message")[0].innerHTML = `Looks like you are on a mobile device, for optimal experience please visit on desktop!`
				$( "#error-message" ).dialog({
			      height: 150,
			      width: window.innerWidth/1.5,
			      modal: true
			    });
			   $("#error-message").show()
			 pitch_width = 65
			} else {
				// $("#planner").show()
				// $("#title")[0].innerHTML = "FPL Mania | Player Comparison Tool & Transfer Planner"
				pitch_width = 80
			}

			var pitch = {
				width: pitch_width,
				length: 110,
				centerCircleRadius: 10,
			penaltyArea: {
				width: 36,
				height: 18
			},
				padding: {
				top: 2,
				right: 2,
				bottom: 2,
				left: 2
			},
				paintColor: "#FFF",
				grassColor: "#1CB960",
			};

			var svg = d3.select("#highest-scorer").append("svg")
				.attr("width", scale(pitch.width + pitch.padding.left + pitch.padding.right))
				.attr("height", scale(pitch.length + pitch.padding.top + pitch.padding.bottom))
				.attr("style", "background:"+pitch.grassColor+";margin-left:-" + 0.01 * scale(pitch.width + pitch.padding.left + pitch.padding.right) + "");


			var pitchElement = svg.append("g")
				.attr("transform", "translate(" +scale(pitch.padding.left) + "," + scale(pitch.padding.top) + ")")

			var pitchOutline = pitchElement.append("rect")
				.attr("x", 0)
				.attr("y", 0)
				.attr("width", scale(pitch.width))
				.attr("height", scale(pitch.length))
				.attr("stroke", pitch.paintColor)
				.attr("fill", "none")

			var centerSpot = pitchElement.append("circle")
				.attr("cx", scale(pitch.width/2))
				.attr("cy", scale(pitch.length/2))
				.attr("r", 1)
				.attr("fill", pitch.paintColor)

			var centerCircle = pitchElement.append("circle")
				.attr("cx", scale(pitch.width/2))
				.attr("cy", scale(pitch.length/2))
				.attr("r", scale(pitch.centerCircleRadius))
				.attr("fill", 'none')
				.attr("stroke", pitch.paintColor)

			var halfwayLine = pitchElement.append("line")
				.attr("y1", scale(pitch.length/2))
				.attr("y2", scale(pitch.length/2))
				.attr("x1", 0)
				.attr("x2", scale(pitch.width))
				.attr("stroke", pitch.paintColor)

			var pitchImage = pitchElement.append("image")
				.attr("x",0)
				.attr("y",-5)
				.attr("width", 90)
				.attr("height", 40)
				.attr("xlink:href", "/FPL Mania.png")

			var pitchImage2 = pitchElement.append("image")
				.attr("x",310)
				.attr("y",-5)
				.attr("width", 90)
				.attr("height", 40)
				.attr("xlink:href", "/FPL Mania.png")

			// corners
			function addPath(pathData, parentElement){
				parentElement.append("path")
				.attr("d", pathData)
				.attr("stroke", pitch.paintColor)
				.attr("fill", "none") 
			}

			// top left
			var pathData = "M0," + scale(1) + "A " + scale(1) +" " + scale(1) + " 45 0 0" + scale(1) + ",0";
			addPath(pathData, pitchElement);

			// top right
			var pathData = "M"+scale(pitch.width - 1)+",0 A " + scale(1) +" " + scale(1) + " 45 0 0" + scale(pitch.width) + ","+ scale(1);
			addPath(pathData, pitchElement);

			// bottom left
			var pathData = "M0," + scale(pitch.length-1) + "A " + scale(1) +" " + scale(1) + " 45 0 1" + scale(1) + "," + scale(pitch.length);
			addPath(pathData, pitchElement);

			// top right
			var pathData = "M"+scale(pitch.width - 1)+","+scale(pitch.length)+" A " + scale(1) +" " + scale(1) + " 45 0 1" + scale(pitch.width) + ","+ scale(pitch.length-1);
			addPath(pathData, pitchElement);

			// Top Penalty Area
			var penaltyAreaTop = pitchElement.append("g");
			var pathData = "M" + scale(pitch.width/2 - 4 - 18) +",0L" + scale(pitch.width/2 - 4 - 18) + "," + scale(18) + "h" + scale(44) + "V0";
			addPath(pathData, penaltyAreaTop);

			// Top Penalty Area
			var pathData = "M" + scale(pitch.width/2 - 4 - 6) +",0L" + scale(pitch.width/2 - 4 - 6) + "," + scale(6) + "h" + scale(20) + "V0";
			addPath(pathData, penaltyAreaTop);

			// Top D
			var pathData = "M" + scale(pitch.width/2 - 8) +","+scale(18)+"A "+scale(10)+" "+ scale(10) +" 5 0 0 " + scale(pitch.width/2 + 8) +","+scale(18);
			addPath(pathData, penaltyAreaTop);

			// Top Penalty Spot
			var penaltySpotTop = penaltyAreaTop.append("circle")
				.attr("cx", scale(pitch.width/2))
				.attr("cy", scale(12))
				.attr("r", 1)
				.attr("fill", pitch.paintColor)
				.attr("stroke", pitch.paintColor)

			penaltyAreaBottom = pitchElement.append("g");
			penaltyAreaBottom.html(penaltyAreaTop.html());
			penaltyAreaBottom.attr("transform", "rotate(180) translate(-" + scale(pitch.width)+",-"+scale(pitch.length)+")")
			
			var opts = {
			  lines: 9, // The number of lines to draw
			  length: 9, // The length of each line
			  width: 5, // The line thickness
			  radius: 14, // The radius of the inner circle
			  color: '#320936', // #rgb or #rrggbb or array of colors
			  speed: 1.9, // Rounds per second
			  trail: 40, // Afterglow percentage
			  className: 'spinner', // The CSS class to assign to the spinner
			};

			var target = document.getElementById("highest-scorer");
			var spinner = new Spinner(opts).spin(target);

			d3.json("https://peaceful-harbor-25221.herokuapp.com/https://fantasy.premierleague.com/api/bootstrap-static/", function(error, player_data) {
		    	if (error) throw error;

		    	gw = current_gw_data[0].id
		    	try {
		    		gw_next = player_data.events.filter(d=>{return d.is_next == true})[0].id	
		    	} catch {
		    		gw_next = 38
		    	}
		    	
		    	gw_prev = gw-1

				var url = `https://peaceful-harbor-25221.herokuapp.com/https://fantasy.premierleague.com/api/entry/${team_id}/event/${gw}/picks/`;
			
				d3.json(url, function(error, data) {
				  	if (error) {
				  		$("#error-message").empty()
						$("#error-message")[0].innerHTML = `Looks like you have entered an incorrect team ID. For information on how to find your team ID, please click on the info icon above the submit button. If this doesn't work, please contact me through the form in the footer below!`
						$( "#error-message" ).dialog({
				          height: 100,
				          width: window.innerWidth/1.5,
				          modal: true
				        });
				       $("#error-message").show()
				  		throw error
				  	};

			    	d3.json(`https://peaceful-harbor-25221.herokuapp.com/https://fantasy.premierleague.com/api/entry/${team_id}/transfers/`, function(error,transfer_data){
			      		d3.csv("/data/gw1_prices.csv",function(error,gw1_prices){
			      			d3.json("https://peaceful-harbor-25221.herokuapp.com/https://fantasy.premierleague.com/api/fixtures/", function(error, fixtures) {
			    				if (error) throw error;

						        my_picks = []
						        data.picks.forEach(d=>{
					        		my_picks.push(d.element)
						        })
						        
						        // freet = d3.select("#free_transfers").append("text")
						        // point_cost = d3.select("#transfer_cost").append("text").text(0)
						        if (data.active_chip=="3xc"){
						        	activechip = "Tripple Captain"
						        } else if (data.active_chip=="bboost") {
						        	activechip = "Bench Boost"	
						        } else {
						        	activechip = data.active_chip
						        }
								
								$("#active_chip")[0].innerHTML = String(activechip)

								var transfers_made = transfer_data.filter(d=>{return d.event == gw}).length

						        // $("#transfer_cost")[0].innerHTML = String(0)
						        // element_color("transfer_cost",$("#transfer_cost")[0].innerHTML,"transfers")

						        $("#transfers_made_hs")[0].innerHTML = String(transfer_data.filter(d=>{return d.event == gw}).length)
						        console.log(data)
						        
						        console.log(transfer_data)

						        var transfers_current_gw = transfer_data.filter(d=>{return d.event == gw}).length
						        var transfers_previous_gw = transfer_data.filter(d=>{return d.event == gw_prev}).length
						        var transfers_previous2_gw = transfer_data.filter(d=>{return d.event == gw_prev-1}).length
						        var active_chip_hs = data.active_chip

						        console.log(gw)
								console.log(gw_prev)

								if (transfers_current_gw == 0 && active_chip_hs != "freehit" && active_chip_hs != "wildcard") {
									free_trans = transfers_made-2
									$("#transfer_cost")[0].innerHTML = String(-4*free_trans)
								} else if (active_chip_hs == "freehit") {
									free_trans = transfers_made-1
									$("#transfer_cost")[0].innerHTML = String(-4*free_trans)
								} else if (active_chip_hs == "wildcard") {
									free_trans = transfers_made-1
									$("#transfer_cost")[0].innerHTML = String(-4*free_trans)
								} else if (transfers_current_gw == 1 && transfers_previous_gw == 0){
									free_trans = transfers_made-2
									$("#transfer_cost")[0].innerHTML = String(-4*free_trans)
									console.log("this")
								} else if (transfers_current_gw == 1 && transfers_previous_gw == 1 && transfers_previous2_gw == 0){
									free_trans = transfers_made-2
									$("#transfer_cost")[0].innerHTML = String(-4*free_trans)
								} else if (transfers_previous_gw == 0){
									free_trans = transfers_made-2
									$("#transfer_cost")[0].innerHTML = String(-4*free_trans)
								} else if (transfers_current_gw > 1){
									free_trans = transfers_made-1
									$("#transfer_cost")[0].innerHTML = String(-4*free_trans)
								} else if (transfers_current_gw == 1){
									free_trans = transfers_made-1
									$("#transfer_cost")[0].innerHTML = String(-4*free_trans)
								}

								console.log(free_trans)
								console.log(transfers_current_gw)
								console.log(transfers_previous_gw)
								console.log(transfers_previous2_gw)

								element_color("transfer_cost",$("#transfer_cost")[0].innerHTML,"transfers")

								var user_data = []
								for (i=0; i<player_data.elements.length; i++) {
									player_data.elements[i].element_type == 1 ? pos = "GKP" : player_data.elements[i].element_type == 2 ? pos="DEF" :player_data.elements[i].element_type == 3 ? pos ="MID" : pos="FWD"

									user_data.push({"id":player_data.elements[i].id, "code":player_data.elements[i].code, "chance_of_playing_next_round":player_data.elements[i].chance_of_playing_next_round,"value":player_data.elements[i].now_cost/10,"name":player_data.elements[i].web_name,"position":pos,"team":player_data.elements[i].team})
								}
						        // console.log(player_data.elements)
						        // console.log(user_data)

						        var images_load = []
						        elements = []
						        my_picks_team = []
						        // console.log(my_picks)
						        // console.log(data.picks)
						        console.log(player_data)
						        
						        
								for (let i=0; i < data.picks.length; i++){
									elements.push(data.picks[i].element)
									var img_code = user_data.filter(d=> {return d.id == data.picks[i].element})[0].code
									var position_name = user_data.filter(d=> {return d.id == data.picks[i].element})[0].position
									var name = user_data.filter(d=> {return d.id == data.picks[i].element})[0].name
									var ch_play = user_data.filter(d=> {return d.id == data.picks[i].element})[0].chance_of_playing_next_round
									// var price_now = user_data.filter(d=> {return d.id == data.picks[i].element})[0].value
									
									// if(transfer_data.filter(d=> {return d.element_in == data.picks[i].element}).length == 0) {
									// 	price_purchase = gw1_prices.filter(d=> {return d.element == data.picks[i].element})[0].value/10
									// 	// price_purchase = 1.0
									// } else {
									// 	price_purchase = transfer_data.filter(d=> {return d.element_in == data.picks[i].element})[0].element_in_cost/10
									// }
									
									var team = user_data.filter(d=> {return d.id == data.picks[i].element})[0].team
									team_name = player_data.teams.filter(d => {return d.id == team})[0].short_name

									var url = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${img_code}.png`
									
									var next_gw_fixtures = fixtures.filter(d=>{return d.event == gw_next})
									
									var next_fix_full = fixtures.filter(d=>{return d.team_h == team || d.team_a == team})
									
									// var live_points = player_data.elements.filter(d=> {return d.id == data.picks[i].element})[0].event_points

									var multiplier = data.picks[i].multiplier
									
									

									var live_points = {};
								    $.ajax({
								        url: `https://peaceful-harbor-25221.herokuapp.com/https://fantasy.premierleague.com/api/element-summary/${data.picks[i].element}/`,
								        async: false,
								        dataType: 'json',
								        success: function(data) {
								        	try {
								        		all_points = data.history.filter(d=> {return d.round == current_gw_data[0].id})
									    		live_points = all_points.reduce((acc, curr) => acc + curr.total_points, 0);

									    	} catch {
									    		live_points = 0
									    	}
								        }
								    });

								    tot_pts += live_points * data.picks[i].multiplier
									// var points_data = jQuery.getJSON(`https://peaceful-harbor-25221.herokuapp.com/https://fantasy.premierleague.com/api/element-summary/${data.picks[i].element}/`,function(data_points){
									// 	console.log(data_points)
									// })
									// console.log(live_points)
									// console.log(points_data)
									// console.log(points_data.responseText)

									var opp_all = []
									if(next_fix_full.length == 0){
										opp_all.push("(blank)")
									} else {
										for (j=0;j<next_fix_full.length;j++){
											if (next_fix_full[j].team_h == team){
												opp_name = player_data.teams.filter(d => {return d.id == next_fix_full[j].team_a})[0].short_name
												opp_all.push({"opponent":`${opp_name} (H)`,"gw":next_fix_full[j].event})
											} else {
												opp_name = player_data.teams.filter(d => {return d.id == next_fix_full[j].team_h})[0].short_name
												opp_all.push({"opponent":`${opp_name} (A)`,"gw":next_fix_full[j].event})
											}
										}
									}

									images_load.push({"player_id":data.picks[i].element,"position":data.picks[i].position,"position_name":position_name,"url":url,"name":name,"ch_play":ch_play == null ? 100 : ch_play, "team":team_name,"opponent_all":opp_all,"total_points":live_points,"multiplier":multiplier})
								}
								
								// $("#gw_points")[0].innerHTML = String(tot_pts)
								
						        gkp = images_load.filter(d => {return d.position_name =="GKP"})
						        def = images_load.filter(d => {return d.position_name =="DEF"})
						        mid = images_load.filter(d => {return d.position_name =="MID"})
						        fwd = images_load.filter(d => {return d.position_name =="FWD"})
						        
						        player_order = [gkp,def,mid,fwd]
						        formation_images_load = []
						        
								m = 1
								for (let j=0; j<player_order.length;j++){
								  	for (let i=0; i < player_order[j].length; i++) {
								    	formation_images_load.push({"player_id":player_order[j][i].player_id,"position":m,"position_name":player_order[j][i].position_name,"url":player_order[j][i].url,"name":player_order[j][i].name,"ch_play":player_order[j][i].ch_play,"team":player_order[j][i].team,"opponent_all":player_order[j][i].opponent_all,"total_points":player_order[j][i].total_points,"multiplier":player_order[j][i].multiplier})

								  		my_picks_team.push({"player_id":player_order[j][i].player_id,"team":player_order[j][i].team,"position":m})
								    	m++
								  	}
								}
						        // console.log(m)
						        // console.log(my_picks_team)

						        // bank = d3.select("#bank").append("text")
						        bank_number = data.entry_history.bank/10

						        // team_value = d3.select("#team_value").append("text")
						        
						        // console.log(images_load)
						        // console.log(formation_images_load)

						        var playerPositions ={
						        	"desktop":[
									{x:30, y:10, pos:1,posn:"GKP"},
									{x:50, y:10, pos:2,posn:"GKP"},
									{x:75, y:37.5, pos:3,posn:"DEF"},
									{x:57.5, y:37.5, pos:4,posn:"DEF"},
									{x:40, y:37.5, pos:5,posn:"DEF"},
									{x:22.5, y:37.5, pos:6,posn:"DEF"},
									{x:5, y:37.5, pos:7,posn:"DEF"},
									{x:75, y:65, pos:8,posn:"MID"},
									{x:57.5, y:65, pos:9,posn:"MID"},
									{x:40, y:65, pos:10,posn:"MID"},
									{x:22.5, y:65, pos:11,posn:"MID"},
									{x:5, y:65, pos:12,posn:"MID"},
									{x:20, y:95, pos:13,posn:"FWD"},
									{x:40, y:95, pos:14,posn:"FWD"},
									{x:60, y:95, pos:15,posn:"FWD"}],
									"mobile":[
									{x:22, y:10, pos:1,posn:"GKP"},
									{x:42, y:10, pos:2,posn:"GKP"},
									{x:60, y:37.5, pos:3,posn:"DEF"},
									{x:46.25, y:37.5, pos:4,posn:"DEF"},
									{x:32.5, y:37.5, pos:5,posn:"DEF"},
									{x:18.75, y:37.5, pos:6,posn:"DEF"},
									{x:5, y:37.5, pos:7,posn:"DEF"},
									{x:60, y:65, pos:8,posn:"MID"},
									{x:46.25, y:65, pos:9,posn:"MID"},
									{x:32.5, y:65, pos:10,posn:"MID"},
									{x:18.75, y:65, pos:11,posn:"MID"},
									{x:5, y:65, pos:12,posn:"MID"},
									{x:12.5, y:95, pos:13,posn:"FWD"},
									{x:32.5, y:95, pos:14,posn:"FWD"},
									{x:52.5, y:95, pos:15,posn:"FWD"}]
								}

								if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
									 // $("#planner").hide()
									 // $("#title")[0].innerHTML = "FPL Mania | Player Comparison Tool"
									 // $("#error-message").empty()
										// $("#error-message")[0].innerHTML = `Looks like you are on a mobile device. Please visit us on desktop to get access to the transfer planner! If you receive this message and you are on desktop, please report the issue using the contact form below!`
										// $( "#error-message" ).dialog({
									 //      height: 300,
									 //      width: window.innerWidth/1.5,
									 //      modal: true
									 //    });
									 //   $("#error-message").show()
									 playerPositions = playerPositions.mobile
									} else {
										// $("#planner").show()
										// $("#title")[0].innerHTML = "FPL Mania | Player Comparison Tool & Transfer Planner"
										playerPositions = playerPositions.desktop
									}
								

						        var playersContainer = pitchElement.append("g")
						          	.attr("class", "players")

						        var player_picks = pitchElement.append("g")
						          	.attr("class","picks")

						        var remove_player = pitchElement.append("g")
						          	.attr("class","x_icon")

						        // var player_info = pitchElement.append("g")
						        //   	.attr("class","player_info")

						        var player_name = pitchElement.append("g")
						          	.attr("class","player_name")

						        var fixtures = pitchElement.append("g")
						          	.attr("class","fixtures_pitch")
						        
								player_picks.selectAll("image")
									.data(playerPositions)
									.enter()
									.append("image")
										.attr("id",function(d){return `position_${d.pos}_pick`})
										.attr("xlink:href", function(d){return formation_images_load.filter(i =>{return i.position == d.pos})[0].url})
										.attr("x", function(d){
										  	return scale(d.x - 6);
										})
										.attr("y", function(d){
										  	return scale(d.y - 10);
										})
										.attr("width", 60)
										.attr("height", 60)
										.attr("text-anchor","middle");
										// .on("click",function(d){
											   // d3.select(this).remove();
										// });

								var info_rect = playersContainer.selectAll("rect")
									.data(playerPositions)
									.enter()
									.append("rect")
									.attr("id",function(d){return `rect_${d.pos}`})
									.attr("x", function(d){
										return scale(d.x-6);
									})
									.attr("y", function(d){
						  				return scale(d.y+3);
									})
									.attr("width", 60)
									.attr("height", 60)
									.attr("rx", 6)
		    						.attr("ry", 6)
									.attr("fill", function(d){
									  	color_rect = formation_images_load.filter(i =>{return i.position == d.pos})[0].ch_play
									  	color_rect > 75 ? fill = "#0FA121" : color_rect > 50 ? fill = "#E5D125" :color_rect == 50 ? fill = "#E29019" : fill="#E33939"

									  	return fill
								});

								// player_info.selectAll("text")
								// 	.data(playerPositions)
								// 	.enter().append("text")
								// 		.attr("id",function(d){return `value_${d.pos}`})
								// 		.attr("x", function(d){
								// 			return scale(d.x);
								// 		})
								// 		.attr("y", function(d){
								// 			return scale(d.y+5);
								// 		})
								// 		.style("text-anchor", "middle")
								// 		.style("font-size", 10)
								// 		.text(function(d){ 
								// 			purch_val = formation_images_load.filter(i =>{return i.position == d.pos})[0].value_purchase
								// 			curr_val = formation_images_load.filter(i =>{return i.position == d.pos})[0].value
								// 			diff = (curr_val - purch_val)*0.5
								// 			return diff == 0 ? (d3.format(".1f"))(curr_val) : (d3.format(".1f"))(floor10((curr_val - diff),-1))
								// 		});

								player_name.selectAll("text")
									.data(playerPositions)
									.enter().append("text")
										.attr("id",function(d){return `name_${d.pos}`})
										.attr("x", function(d){
											return scale(d.x);
										})
										.attr("y", function(d){
											return scale(d.y+8);
										})
										.style("text-anchor", "middle")
										.style("font-size", 10)
										.text(function(d){ 
										
											return formation_images_load.filter(i =>{return i.position == d.pos})[0].name
										});
								
								fixtures.selectAll("text")
									.data(playerPositions)
									.enter().append("text")
										.attr("id",function(d){return `fix_${d.pos}`})
										.attr("x", function(d){
											return scale(d.x);
										})
										.attr("y", function(d){
											return scale(d.y+11);
										})
										.style("text-anchor", "middle")
										.style("font-size", 10)
										.text(function(d){ 
											fix_load = formation_images_load.filter(i =>{return i.position == d.pos})[0].total_points
											multip = formation_images_load.filter(i =>{return i.position == d.pos})[0].multiplier
											// fix_load = fix_load.filter(j=>{return j.gw==gw_next})
											// fix_load.length == 2 ? output = `${fix_load[0].opponent} ${fix_load[1].opponent}` : fix_load.length == 0 ? output = "(blank)": output = `${fix_load[0].opponent}`
											output = `${fix_load} x ${multip} = ${fix_load * multip} pts`
											return output
										})
										.call(wrap, 50);

					        spinner.stop();
				            })
				      	})
				    })
			  	})
			})
		};	
	}

function element_color(id,number,type){
	if (type == "bank"){
		if (number >= 0) {
			document.getElementById(id).style.color = "green";
		} else {
			document.getElementById(id).style.color = "red"
		}
	} if (type =="transfers"){
		if (number < 0) {
			document.getElementById(id).style.color = "red"
		} if (number >= 0) {
			document.getElementById(id).style.color = "black"
		}
	}
}

function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                .append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
            }
        }
    });
}

function decimalAdjust(type, value, exp) {
	// If the exp is undefined or zero...
	if (typeof exp === 'undefined' || +exp === 0) {
		return Math[type](value);
	}
	value = +value;
	exp = +exp;
	
	// If the value is not a number or the exp is not an integer...
	if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
		return NaN;
	}
	
	// Shift
	value = value.toString().split('e');
	value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
	
	// Shift back
	value = value.toString().split('e');
		return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
	}