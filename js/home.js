	var margin = {top: 100, right: 100, bottom: 100, left: 100},
		width = Math.min(500, window.innerWidth - 10) - margin.left - margin.right,
		height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

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

	var target = document.getElementById("radar");
	var target_with = document.getElementById("radarChart_2");
	var spinner = new Spinner(opts).spin(target);
	var spinner_with = new Spinner(opts).spin(target_with);

	d3.csv("/data/timestamp.txt", function(error, data) {
		if (error) throw error;
		$("#timestamp")[0].innerHTML = data.columns[0] + ", " + data.columns[1]
		$("#timestamp2")[0].innerHTML = data.columns[0] + ", " + data.columns[1]
	}) 

	var color = d3.scale.ordinal()
		.range(["#CC333F","#00A0B0","#00A0B0"]);
		
	var radarChartOptions = {
	  w: width,
	  h: height,
	  margin: margin,
	  maxValue: 0.5,
	  levels: 5,
	  roundStrokes: true,
	  color: color
	};

	$(document).ready(function(){
	  // Initialize select2
	  $("#stat-select").select2({
	  	allowClear: true,
	  	placeholder:"Select stats",
	  	maximumSelectionLength: 12
	  });
	  $("#stat-select-with").select2({
	  	allowClear: true,
	  	placeholder:"Select stats",
	  	maximumSelectionLength: 12
	  });
	});
	
    // Initialize the tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var info = d3.select("#info-switch")
		.on('mouseover.tooltip', function(d) {
		    tooltip.transition()
		      .duration(300)
		      .style("opacity", 1);
		    tooltip.html(`Click to switch between Radar and Diverging chart.`)
		      .style("left", (d3.event.pageX) + "px")
		      .style("top", (d3.event.pageY + 10) + "px");
		  })
		.on("mouseout.tooltip", function() {
		    tooltip.transition()
		      .duration(100)
		      .style("opacity", 0);
		  })

		
	var info_with_without = d3.select("#info-with-without")
		.on('mouseover.tooltip', function(d) {
		    tooltip.transition()
		      .duration(300)
		      .style("opacity", 1);
		    tooltip.html(`This section allows users to compare a single player's stats based on three options: with/without another player, at different positions played, and between two ranges of gameweeks.
		    	For example, the default view shows Salah's stats when he plays with vs without Milner. If you select positions in the first dropdown, then you could compare Salah's stats when he plays as a forward or on the wing.
		    	If you select gw range in the first dropdown then you can compare Salah's stats between two ranges of gameweeks of your choice!`)
		      .style("left", (d3.event.pageX) + "px")
		      .style("top", (d3.event.pageY + 10) + "px");
		  })
		.on("mouseout.tooltip", function() {
		    tooltip.transition()
		      .duration(100)
		      .style("opacity", 0);
		  })
	
	
	var info_team_id = d3.select("#team_id_info")
		.on('click.tooltip', function(d) {
		    tooltip.transition()
		      .duration(300)
		      .style("opacity", 1)
		      .style("pointer-events", "auto");
		    tooltip.html(
		    	`<button type="button" id="close" style="float:right;">X</button><br>To find your team ID, go to the official fantasy premier league page and then go to the points tab.<br>
		    	<img src="/data/img/points-page.png" style="width:100%"><br>
		    The url should look something like this: <br> https://fantasy.premierleague.com/entry/xxxxxxx/event/27.<br>
		    Take the 7 digit number (shown above as xxxxxxx), input it in the box below and click submit to see your team!`)
		      .style("left", (d3.event.pageX) + "px")
		      .style("top", (d3.event.pageY + 10) + "px");

		   d3.select("button#close").on("click",function() {
			    tooltip.transition()
			      .duration(100)
			      .style("opacity", 0)
			      .style("pointer-events", "none");
			  })
		  })
		

	var info_short = d3.select("#table-select-info")
		.on('click.tooltip', function(d) {
		    tooltip.transition()
		      .duration(300)
		      .style("opacity", 1)
		      .style("pointer-events", "auto");
		    tooltip.html(
		    	`<button type="button" id="close" style="float:right;">X</button><br>You can use the dropdown menu to select which column you want to search for.<br>
		    	<strong>The available options are</strong>: name, position, team. <br>
		    	For example, if you select position in the dropdown, and search fwd, all forwards will show up in the table.<br>
		    	Once you have found the player you need, simply click on them in the table and you will see a pop-up window with 3 options.<br>
		    	One is adding the player to your team. The other two allow you to select which comparison field to add them to in the comparison tool below.`)
		      .style("left", (d3.event.pageX)-300 + "px")
		      .style("top", (d3.event.pageY + 10) + "px");

		   d3.select("button#close").on("click",function() {
			    tooltip.transition()
			      .duration(100)
			      .style("opacity", 0)
			      .style("pointer-events", "none");
			  })
		  })

	$(document).ready(function(){
	  // Initialize select2
	  $("#player1").select2();
	  $("#player2").select2();
	  $("#player1_with").select2();
	  $("#player2_without").select2();
	  $("#stat").select2();
	  $("#stat-with").select2();
	  $("#select-stat-player-table").select2();
	  $("#comparison_type").select2();
	});
	

	var pos_pos1 = ["MID MID", "MID FWD", "FWD FWD", "FWD MID"]
	var pos_pos2 = ["GKP DEF", "DEF GKP"]
	var pos_pos3 = ["DEF MID", "MID DEF"]
	var pos_pos4 = ["GKP FWD", "DEF FWD", "FWD GKP", "FWD DEF","MID GKP", "GKP MID"]
	var pos_pos5 = ["DEF DEF"]
	var pos_pos6 = ["GKP GKP"]

	// features1 = ["xG","goals_scored","minutes", "npg", "npxG", "xA", "assists", "shots", "key_passes", "total_points", "bonus"]
	features = ['total_points', 'minutes','goals_scored', 'assists', 'clean_sheets', 'goals_conceded',
	   'own_goals', 'penalties_saved', 'penalties_missed', 'yellow_cards','red_cards', 'saves',
	   'bonus', 'bps', 'influence', 'creativity','threat', 'ict_index','shots', 'xG', 'time', 
	   'xA', 'key_passes', 'npg', 'npxG','xGChain', 'xGBuildup',"form","round_points"]

	// load_stats(features,features1)
	
	

    function load_stats (features,pos,id) {
    	if (pos_pos1.includes(pos)) {
			var featuresx = ["xG","goals_scored","minutes", "npg", "npxG", "xA", "assists", "shots", "key_passes", "total_points", "bonus"]
		} if (pos_pos2.includes(pos)) {
	    	var featuresx = ["total_points", "bonus", "goals_conceded", "saves", "penalties_saved", "minutes", "own_goals","clean_sheets"]
	    } if (pos_pos3.includes(pos)){
	    	var featuresx = ["goals_scored", "npg", "assists", "shots", "key_passes", "total_points", "bonus", "goals_conceded", "clean_sheets"]
	    } if (pos_pos4.includes(pos)) {
	    	var featuresx = ["npg", "yellow_cards", "clean_sheets", "total_points", "bonus", "time"]
	    } if (pos_pos5.includes(pos)) {
	    	featuresx = ["bonus","assists","xA","clean_sheets","total_points","time","goals_scored","xG"]
	    } if (pos_pos6.includes(pos)) {
	    	featuresx = ["total_points","bonus","clean_sheets","time","goals_conceded","saves","penalties_saved"]
	    }

		var elements_stat = ""
		for(i= 0; i < features.length; i++){
			featuresx.includes(features[i]) ? elements_stat += "<option selected value='"+ features[i] + "'>" + features[i] + "</option>" : elements_stat += "<option value='"+ features[i] + "'>" + features[i] + "</option>";
		}

		document.getElementById(id).innerHTML = elements_stat;
	}


	var var_explanation = {"element":"player id", "kickoff_time":"kickoff time", "fixture":"fixture id","opponent_team":"opponent team id",
	"total_points":"total points","was_home":"boolean home/away","team_h_score":"home team score","team_a_score":"away team score",
	"round":"gameweek", "minutes":"minutes played", "goals_scored": "goals scored", "assists":"assists", "clean_sheets":"clean sheets",
	"goals_conceded":"goals conceded", "own_goals":"own goals", "penalties_saved":"saved penalties", "penalties_missed":"missed penalties",
	"yellow_cards":"yellow cards", "red_cards":"red cards", "saves":"saves", "bonus":"bonus points", "bps":"bonus point system",
	"influence":"player's impact in a match","creativity":"performance in terms of goal scoring opportunities", "threat":"likeliness of scorring",
	"ict_index":"index of player as FPL asset", "value":"price in GBP", "transfers_balance":"transfers balance", "selected":"selected",
	"transfers_in": "transfers in", "transfers_out":"transfers out", "opponent":"opponent team", "opponent_short":"opponent short name",
	"position_short":"player position", "team":"player team", "team_short":"player team short name", "first_name":"first name", "last_name":"last name",
	"web_name":"name shown in search bar", "selected_by_percent":"selected by % of managers", "corners_and_indirect_freekicks_order":"order in taking corners in indirect freekicks",
	"direct_freekicks_order":"order in taking direct freekicks", "penalties_order":"order in taking penalties", "chance_playing_tr":"chance of playing this round",
	"chance_playing_nx":"chance of playing next round", "news":"news about player", "shots":"shots taken", "xG":"expected goals",
	"time":"minutes played", "position":"position", "date":"date", "xA":"expected assists", "key_passes":"important passes", "npg":"non-penalty goals",
	"npxG":"non-penalty expected goals", "xGChain":"total expected goals of every possession the player is involved in",
	"xGBuildup":"total expected goals of every possession a player is involved in without key passes and shots", "player_id":"player id",
	"code":"player image code", "GW":"gameweek","against":"team playing against","G":"goals","A":"assists","xGA":"expected goals against",
	"GA":"goals against","pts":"total points","CS":"clean sheets","YC":"yellow cards","S":"saves","B":"bonus","difficulty":"difficulty of opponent",
	"form":"Form","round_points":"Round points",
	'ARS': 'Arsenal', 'AVL': 'Aston Villa', 'BHA': 'Brighton', 'BUR': 'Burnley', 'CHE': 'Chelsea', 'CRY': 'Crystal Palace', 'EVE': 'Everton',
	'FUL': 'Fulham', 'LEI': 'Leicester', 'LEE': 'Leeds', 'LIV': 'Liverpool', 'MCI': 'Man City', 'MUN': 'Man Utd', 'NEW': 'Newcastle',
	'SHU': 'Sheffield Utd', 'SOU': 'Southampton', 'TOT': 'Spurs', 'WBA': 'West Brom', 'WHU': 'West Ham', 'WOL': 'Wolves'}

	d3.csv("/data/players_full.csv", function(error, data) {
		if (error) throw error;

		var max_gw = Math.max.apply(null, data.map(function(a){return a.round;}))

	    $("#gw-slider").slider({
	      min: 1,
	      max: max_gw,
	      step: 1,
	      values: [ 1, max_gw ],
	      range: true,
	      stop: (event, ui) => {
	      }
	    });
	    $("#top-gws")[0].innerHTML = String($("#gw-slider").slider("values",0) + "-" + $("#gw-slider").slider("values",1))
		
		document.getElementById("gw2-vs1").defaultValue = max_gw;
	    document.getElementById("gw2-vs2").defaultValue = max_gw;

	    var elem_load_id = []
	    data.filter(d => {
	    	elem_load_id.push({"key": Number(d.element), "value": `${d.web_name} (${d.team_short})`})
	    });
	    var elem_load_id = elem_load_id.reduce((unique, o) => {
		    if(!unique.some(obj => obj.key === o.key)) {
		      unique.push(o);
		    }
		    return unique;
		},[]);

	    var elementsp1 = ""
		for(i= 0; i < elem_load_id.length; i++){
		    elem_load_id[i].key == 254 ? elementsp1 += "<option selected value='"+ elem_load_id[i].key + "'>" + elem_load_id[i].value + "</option>" : elementsp1 += "<option value='"+ elem_load_id[i].key + "'>" + elem_load_id[i].value + "</option>";
		}
		var elementsp2 = ""
		for(i= 0; i < elem_load_id.length; i++){
		    elem_load_id[i].key == 302 ? elementsp2 += "<option selected value='"+ elem_load_id[i].key + "'>" + elem_load_id[i].value + "</option>" : elementsp2 += "<option value='"+ elem_load_id[i].key + "'>" + elem_load_id[i].value + "</option>";
		}

		// for(i= 0; i < elem_load_id.length; i++){
		//     elem_load_id[i].key == 302 ? elementsp2 += "<option selected value='"+ elem_load_id[i].key + "'>" + elem_load_id[i].value + "</option>" : elementsp2 += "<option value='"+ elem_load_id[i].key + "'>" + elem_load_id[i].value + "</option>";
		// }
		// console.log(elem_load_id)

		document.getElementById("player1").innerHTML = elementsp1;
		document.getElementById("player2").innerHTML = elementsp2;
		var elementsp3 = ""
		for(i= 0; i < elem_load_id.length; i++){
		    elem_load_id[i].key == 254 ? elementsp3 += "<option selected value='"+ elem_load_id[i].key + "'>" + elem_load_id[i].value + "</option>" : elementsp3 += "<option value='"+ elem_load_id[i].key + "'>" + elem_load_id[i].value + "</option>";
		}

		document.getElementById("player1_with").innerHTML = elementsp3;
		// document.getElementById("player2_without").innerHTML = elementsp2;
		// console.log(elementsp2.filter(d=>{return d.str.contains}))

		var p1_selected = $( "#player1_with option:selected" ).text().split(" ")
		// console.log(p1_selected)
    	var elementsp4 = ""
		for(i= 0; i < elem_load_id.length; i++){
			// console.log(elem_load_id[i].value.includes(p1_selected[p1_selected.length - 1]))
			if (elem_load_id[i].value.includes(p1_selected[p1_selected.length - 1])){
		    elementsp4 += "<option value='"+ elem_load_id[i].key + "'>" + elem_load_id[i].value + "</option>"
			}
		}
		// console.log(elementsp4)
		
		document.getElementById("player2_without").innerHTML = elementsp4;

		data.forEach(d => {
		    d.assists = Number(d.assists)
		    d.bonus = Number(d.bonus)
		    d.bps = Number(d.bps)
		    d.clean_sheets = Number(d.clean_sheets)
		    d.creativity = Number(d.creativity)
		    // d.date = d.date
		    d.element = Number(d.element)
		    d.fixture = Number(d.fixture)
		    d.goals_conceded = Number(d.goals_conceded)
		    d.goals_scored = Number(d.goals_scored)
		    d.ict_index = Number(d.ict_index)
		    d.influence = Number(d.influence)
		    d.key_passes = Number(d.key_passes)
		    d.minutes = Number(d.minutes)
		    d.npg = Number(d.npg)
		    d.npxG = Number(d.npxG)
		    d.opponent_team = Number(d.opponent_team)
		    d.own_goals = Number(d.own_goals)
		    d.penalties_missed = Number(d.penalties_missed)
		    d.penalties_saved = Number(d.penalties_saved)
		    d.player_id = Number(d.player_id)
		    d.red_cards = Number(d.red_cards)
		    d.round = Number(d.round)
		    d.saves = Number(d.saves)
		    d.selected = Number(d.selected)
		    d.shots = Number(d.shots)
		    d.team_a_score = Number(d.team_a_score)
		    d.team_h_score = Number(d.team_h_score)
		    d.threat = Number(d.threat)
		    d.time = Number(d.time)
		    d.total_points = Number(d.total_points)
		    d.transfers_balance = Number(d.transfers_balance)
		    d.transfers_in = Number(d.transfers_in)
		    d.transfers_out = Number(d.transfers_out)
		    d.value = Number(d.value)
		    d.xA = Number(d.xA)
	    	d.xG = Number(d.xG)
	    	d.xGBuildup = Number(d.xGBuildup)
	    	d.xGChain = Number(d.xGChain)
	    	d.yellow_cards = Number(d.yellow_cards)
	    	d.chance_playing_tr = Number(d.chance_playing_tr)
	    	d.chance_playing_nx = Number(d.chance_playing_nx)
	    	d.form = Number(d.form)
	    	d.round_points = Number(d.round_points)
		});


		to_fill = `${data.filter(d => {return d.element == $("#player1").val()})[0].position_short} ${data.filter(d => {return d.element == $("#player2").val()})[0].position_short}`
		load_stats(features,to_fill,"stat-select")
		to_fill_with = `${data.filter(d => {return d.element == $("#player1_with").val()})[0].position_short} ${data.filter(d => {return d.element == $("#player2_without").val()})[0].position_short}`
		load_stats(features,to_fill_with,"stat-select-with")
		
		update(data)
		update_2(data)
		
		$("#comparison_type").on("change", function(){
			if ($("#comparison_type").val()=="with/without") {
        		to_fill = `${data.filter(d => {return d.element == $("#player1_with").val()})[0].position_short} ${data.filter(d => {return d.element == $("#player2_without").val()})[0].position_short}`
	        	load_stats(features,to_fill,"stat-select-with")
	          	
	          	var p1_selected = $( "#player1_with option:selected" ).text().split(" ")
	        	var elementsp3 = ""
				for(i= 0; i < elem_load_id.length; i++){
					if (elem_load_id[i].value.includes(p1_selected[p1_selected.length - 1])){
				    elementsp3 += "<option value='"+ elem_load_id[i].key + "'>" + elem_load_id[i].value + "</option>"
					}
				}
				document.getElementById("player2_without").innerHTML = elementsp3;
				$("#position_select").hide();
        		$("#pl1_without_div").show();
        		$("#gw_vs_select").hide();
        		$("#gws-without").show();

        	} else if($("#comparison_type").val()=="position") {
        		to_fill = `${data.filter(d => {return d.element == $("#player1_with").val()})[0].position_short} ${data.filter(d => {return d.element == $("#player1_with").val()})[0].position_short}`
	        	load_stats(features,to_fill,"stat-select-with")

        		var positions = []
        		var elementsp3 = ""
			    data.filter(i => {return i.element == $("#player1_with").val()}).forEach(d=>{
			    	positions.push(d.position)
			    })
			    positions = positions.filter(onlyUnique)
			    // elementsp3 += "<option selected value='All'>All</option>"
			    for (i=0;i<positions.length;i++){
			    	elementsp3 += "<option value='"+ positions[i] + "'>" + positions[i] + "</option>"
			    }

			    document.getElementById("pos_vs1").innerHTML = elementsp3;
        		document.getElementById("pos_vs2").innerHTML = elementsp3;
        		$("#position_select").show();
        		$("#pl1_without_div").hide();
        		$("#gw_vs_select").hide();
        		$("#gws-without").hide();
        	} else if ($("#comparison_type").val()=="gw-range"){
        		$("#position_select").hide();
        		$("#pl1_without_div").hide();
        		$("#gw_vs_select").show();
        		$("#gws-without").hide();
        	}
        	

          	update_2(data)
		})

		$("#player1_with")
	        .on("change", function(){
	        	if ($("#comparison_type").val()=="with/without") {
	        		to_fill = `${data.filter(d => {return d.element == $("#player1_with").val()})[0].position_short} ${data.filter(d => {return d.element == $("#player2_without").val()})[0].position_short}`
		        	load_stats(features,to_fill,"stat-select-with")
		          	
		          	var p1_selected = $( "#player1_with option:selected" ).text().split(" ")
		        	var elementsp3 = ""
					for(i= 0; i < elem_load_id.length; i++){
						if (elem_load_id[i].value.includes(p1_selected[p1_selected.length - 1])){
					    elementsp3 += "<option value='"+ elem_load_id[i].key + "'>" + elem_load_id[i].value + "</option>"
						}
					}
					document.getElementById("player2_without").innerHTML = elementsp3;
					$("#position_select").hide();
        			$("#pl1_without_div").show();
        			$("#gw_vs_select").hide();
        			$("#gws-without").show();
	        	} else if($("#comparison_type").val()=="position") {
	        		to_fill = `${data.filter(d => {return d.element == $("#player1_with").val()})[0].position_short} ${data.filter(d => {return d.element == $("#player1_with").val()})[0].position_short}`
	        		load_stats(features,to_fill,"stat-select-with")

	        		var positions = []
	        		var elementsp3 = ""
				    data.filter(i => {return i.element == $("#player1_with").val()}).forEach(d=>{
				    	positions.push(d.position)
				    })
				    positions = positions.filter(onlyUnique)
				    // elementsp3 += "<option selected value='All'>All</option>"
				    for (i=0;i<positions.length;i++){
				    	elementsp3 += "<option value='"+ positions[i] + "'>" + positions[i] + "</option>"
				    }
				    document.getElementById("pos_vs1").innerHTML = elementsp3;
        			document.getElementById("pos_vs2").innerHTML = elementsp3;
        			$("#position_select").show();
        			$("#pl1_without_div").hide();
        			$("#gw_vs_select").hide();
        			$("#gws-without").hide();
	        	}

	          	update_2(data)
	        })
	    $("#pos_vs1").on("change", function(){
	    	update_2(data)
	    })

	    $("#pos_vs2").on("change", function(){
	    	update_2(data)
	    })
	    $("#gw_vs_button").on("click", function(){
	    	update_2(data)
	    })

		$("#player2_without")
	        .on("change", () => {
				to_fill = `${data.filter(d => {return d.element == $("#player1_with").val()})[0].position_short} ${data.filter(d => {return d.element == $("#player2_without").val()})[0].position_short}`
				load_stats(features,to_fill,"stat-select-with")
	          	update_2(data)
	        })
	    $("#stat-with")
	        .on("change", () => {
	          update_2(data)
	        })

	    $("#player1")
	        .on("change", function(){
	        	to_fill = `${data.filter(d => {return d.element == $("#player1").val()})[0].position_short} ${data.filter(d => {return d.element == $("#player2").val()})[0].position_short}`
	        	load_stats(features,to_fill,"stat-select")
	          	update(data)
	        })

		$("#player2")
	        .on("change", () => {
	          to_fill = `${data.filter(d => {return d.element == $("#player1").val()})[0].position_short} ${data.filter(d => {return d.element == $("#player2").val()})[0].position_short}`
        	  load_stats(features,to_fill,"stat-select")
	          update(data)
	        })

		$("#stat")
	        .on("change", () => {
	          update(data)
	        })

	    $("#gw-slider").slider({
			stop: (event,ui) => {
				update(data)
				$("#top-gws")[0].innerHTML = String(ui.values[0] + "-" + ui.values[1])
    	}
		});
		
		$("#check")
	        .on("click", () => {
	          update(data)
	        })
	    $("#stat-select")
	    .on("change", () => {
	      update(data)
	    })
	    $("#stat-select-with")
	    .on("change", () => {
	      update_2(data)
	    })

	    $(function() {
		   $("#info1").on("click", function(){ 
		   		update(data)
		       $( "#p1-full-table" ).dialog({
		          height: window.innerHeight-100,
		          width: window.innerWidth/1.5,
		          modal: true
		        });
		       $("#p1-full-table").show();

		    });
		 });

		$(function() {
		   $("#info2").on("click", function(){ 
		   		update(data)
		       $( "#p2-full-table" ).dialog({
		          height: window.innerHeight-100,
		          width: window.innerWidth/2,
		          modal: true
		        });

		       $("#p2-full-table").show();
		    });
		 });

		$(function() {
		   $("#full_fix1").on("click", function(){
		   	update(data)
		       $( "#p1-full-fixtures" ).dialog({
		          height: window.innerHeight-100,
		          width: window.innerWidth/1.5,
		          modal: true
		        });
		       $("#p1-full-fixtures").show();
		    });
		 });

		$(function() {
		   $("#full_fix2").on("click", function(){ 
		   	update(data)
		       $( "#p2-full-fixtures" ).dialog({
		          height: window.innerHeight-100,
		          width: window.innerWidth/1.5,
		          modal: true
		        });
		       $("#p2-full-fixtures").show();
		    });
		 });
		spinner.stop();
		spinner_with.stop();
	});

function update_2 (data,chart_type) {
	d3.select("#radarChart_2").selectAll("*").remove();
	// d3.selectAll(".bars").remove()
	// d3.selectAll(".labels").remove()

	console.log(data)
	var player1 = $('#player1_with option:selected').val()
    var player2 = $('#player2_without option:selected').val()

    var pos_vs1 = $('#pos_vs1').val()
    var pos_vs2 = $('#pos_vs2').val()

    var gw1_vs1 = $('#gw1-vs1').val()
    var gw1_vs2 = $('#gw1-vs2').val()
    var gw2_vs1 = $('#gw2-vs1').val()
    var gw2_vs2 = $('#gw2-vs2').val()

    // console.log($('#check option:checked').val())
    var gws_compare = []
    data.filter(d => {return d.element == player2 && d.minutes == 0}).forEach(i=>{
    	gws_compare.push(i.round)
    })
    
    // console.log(gws_compare)
    // console.log(data)
    // console.log(data.filter(d => {return d.element == player2 && d.minutes == 0}))

    if($("#comparison_type").val()=="with/without") {
    	if (data.filter(function(d) {return gws_compare.indexOf(d.round) !== -1 && d.element == player1;}).length == 0) {
	    	var filtered_p1 = data.filter(function(d) {
		        return d.element == player1;
			})
	    } else {
	    	var filtered_p1 = data.filter(function(d) {
		        return gws_compare.indexOf(d.round) !== -1 && d.element == player1;
			})
	    }

	    if (data.filter(function(d) {return gws_compare.indexOf(d.round) !== -1 && d.element == player2;}).length == 0) {
	    	var filtered_p2 = data.filter(function(d) {
		        return gws_compare.indexOf(d.round) == -1 && d.element == player1;
			})
	    } else {
	    	var filtered_p2 = data.filter(function(d) {
		        return gws_compare.indexOf(d.round) == -1 && d.element == player1;
			})
	    }
    } else if ($("#comparison_type").val()=="position") {
		var filtered_p1 = data.filter(function(d) {
	        return d.element == player1 && d.position == pos_vs1
		})

		var filtered_p2 = data.filter(function(d) {
	        return d.element == player1 && d.position == pos_vs2
		})
    	
    } else if ($("#comparison_type").val()=="gw-range") {
    	var filtered_p1 = data.filter(function(d) {
	        return d.element == player1 && d.round <= gw2_vs1 && d.round >= gw1_vs1
		})

		var filtered_p2 = data.filter(function(d) {
	        return d.element == player1 && d.round <= gw2_vs2 && d.round >= gw1_vs2
		})
    }
    


 //    var gw_low = $("#gw-slider").slider("values",0)
 //    var gw_high = $("#gw-slider").slider("values",1)

	// var filtered_p1_old = data.filter(d => {
 //    	return d.element == player1 && d.round <= gw_high && d.round >= gw_low
 //    });
 	
 	document.getElementById("pl1_with").src=`https://resources.premierleague.com/premierleague/photos/players/110x140/p${filtered_p1[0].code}.png`;
    // document.getElementById("pl1_without").src=`https://resources.premierleague.com/premierleague/photos/players/110x140/p${data.filter(d => {return d.element == player2})[0].code}.png`;
	
	console.log(filtered_p1)
	// console.log(filtered_p1_old)
	console.log(filtered_p2)

	if($("#comparison_type").val()=="with/without") { 
		let p1_info_with = `${filtered_p1[0].web_name}'s stats without ${data.filter(d => {return d.element == player2})[0].web_name}`
		let p1_info_without = `${filtered_p1[0].web_name}'s stats with ${data.filter(d => {return d.element == player2})[0].web_name}`
		let gws_together = "Gameweeks not played together: "
	 	for (i=0; i < gws_compare.length; i++){
	 		i == gws_compare.length-1 ? gws_together += `and ${gws_compare[i]}.` : gws_together += `${gws_compare[i]}, `
	 	}
	 	document.getElementById('gws-without').innerHTML = gws_together

		document.getElementById('p1-color-with-info').innerHTML = p1_info_with
		document.getElementById('p1-color-without-info').innerHTML = p1_info_without
	} else if($("#comparison_type").val()=="position") {
		let p1_info_with = `${filtered_p1[0].web_name}'s stats at position ${pos_vs1}`
		let p1_info_without = `${filtered_p1[0].web_name}'s stats position ${pos_vs2}`
		
		document.getElementById('p1-color-with-info').innerHTML = p1_info_with
		document.getElementById('p1-color-without-info').innerHTML = p1_info_without
	} else if($("#comparison_type").val()=="gw-range") {
		let p1_info_with = `${filtered_p1[0].web_name}'s stats between ${gw1_vs1} - ${gw2_vs1}`
		let p1_info_without = `${filtered_p1[0].web_name}'s stats between ${gw1_vs2} - ${gw2_vs2}`
		
		document.getElementById('p1-color-with-info').innerHTML = p1_info_with
		document.getElementById('p1-color-without-info').innerHTML = p1_info_without
	}	
    
    features = ['total_points', 'minutes','goals_scored', 'assists', 'clean_sheets', 'goals_conceded',
       'own_goals', 'penalties_saved', 'penalties_missed', 'yellow_cards','red_cards', 'saves',
       'bonus', 'bps', 'influence', 'creativity','threat', 'ict_index','shots', 'xG', 'time', 
       'xA', 'key_passes', 'npg', 'npxG','xGChain', 'xGBuildup',"form","round_points"]

    var total_p1 = []
    var total_p2 = []
    tot_varsp1 = []
    tot_varsp2 = []
    for (var i=0; i<features.length; i++) {
    	tot_varsp1.push(`p1Tot${features[i]}`)
    	tot_varsp2.push(`p2Tot${features[i]}`)
    	if (features[i]=="form" || features[i]=="round_points"){
    		window["p1Tot" + features[i]] = filtered_p1[0][features[i]];
    		window["p2Tot" + features[i]] = filtered_p2[0][features[i]];	
    	} else {
    		window["p1Tot" + features[i]] = filtered_p1.reduce((total, obj) => obj[features[i]] + total,0);
    		window["p2Tot" + features[i]] = filtered_p2.reduce((total, obj) => obj[features[i]] + total,0);
    	}

    	if ($("#comparison_type").val()=="with/without"){
    		var input1 = `<strong>${filtered_p1[0].web_name} without ${data.filter(d => {return d.element == player2})[0].web_name} </strong> <br><strong>${features[i]}:</strong> ${(d3.format(".2f"))(eval(tot_varsp1[i]))}`
    		var input2 = `<strong>${filtered_p1[0].web_name} with ${data.filter(d => {return d.element == player2})[0].web_name}</strong> <br><strong>${features[i]}:</strong> ${(d3.format(".2f"))(eval(tot_varsp2[i]))}`
    	} else if($("#comparison_type").val()=="position"){
    		var input1 = `<strong>${filtered_p1[0].web_name} as ${pos_vs1} </strong> <br><strong>${features[i]}:</strong> ${(d3.format(".2f"))(eval(tot_varsp1[i]))}`
    		var input2 = `<strong>${filtered_p1[0].web_name} as ${pos_vs2} </strong> <br><strong>${features[i]}:</strong> ${(d3.format(".2f"))(eval(tot_varsp2[i]))}`
    	} else if($("#comparison_type").val()=="gw-range"){
    		var input1 = `<strong>${filtered_p1[0].web_name} between ${gw1_vs1} - ${gw2_vs1} </strong> <br><strong>${features[i]}:</strong> ${(d3.format(".2f"))(eval(tot_varsp1[i]))}`
    		var input2 = `<strong>${filtered_p1[0].web_name} between ${gw1_vs2} - ${gw2_vs2} </strong> <br><strong>${features[i]}:</strong> ${(d3.format(".2f"))(eval(tot_varsp2[i]))}`
    	}

    	total_p1.push({'axis':`${features[i]}`, 'value':Nan_rep(eval(tot_varsp1[i])/(eval(tot_varsp1[i])+eval(tot_varsp2[i]))), "actual": input1,"player":0,"real":eval(tot_varsp1[i])}) 
    	total_p2.push({'axis':`${features[i]}`, 'value':Nan_rep(eval(tot_varsp2[i])/(eval(tot_varsp1[i])+eval(tot_varsp2[i]))), "actual":input2,"player":1,"real":eval(tot_varsp2[i])})
    };
    
    p1_pgs = filtered_p1.filter(d => {
		return d.position != "Sub" && d.position != "Not selected"
	});
	p2_pgs = filtered_p2.filter(d => {
		return d.position != "Sub" && d.position != "Not selected"
	});

	var total_p1_pgs = []
    var total_p2_pgs = []
    // tot_varsp1_pgs = []
    // tot_varsp2_pgs = []
    for (var i=0; i<features.length; i++) {
    	// tot_varsp1_pgs.push(`p1TotPgs${features[i]}`)
    	// tot_varsp2_pgs.push(`p2TotPgs${features[i]}`)
    	// window["p1TotPgs" + features[i]] = p1_pgs.reduce((total, obj) => obj[features[i]] + total,0);
    	// window["p2TotPgs" + features[i]] = p2_pgs.reduce((total, obj) => obj[features[i]] + total,0);
    	if ($("#comparison_type").val()=="with/without"){
    		var input1 = `<strong>${filtered_p1[0].web_name} without ${data.filter(d => {return d.element == player2})[0].web_name} </strong> <br><strong>${features[i]} per game started:</strong> ${(d3.format(".2f"))(eval(tot_varsp1[i])/p1_pgs.length)}`
    		var input2 = `<strong>${filtered_p1[0].web_name} with ${data.filter(d => {return d.element == player2})[0].web_name}</strong> <br><strong>${features[i]} per game started:</strong> ${(d3.format(".2f"))(eval(tot_varsp2[i])/p2_pgs.length)}`
    	} else if($("#comparison_type").val()=="position"){
    		var input1 = `<strong>${filtered_p1[0].web_name} as ${pos_vs1} </strong> <br><strong>${features[i]} per game started:</strong> ${(d3.format(".2f"))(eval(tot_varsp1[i])/p1_pgs.length)}`
    		var input2 = `<strong>${filtered_p1[0].web_name} as ${pos_vs2} </strong> <br><strong>${features[i]} per game started:</strong> ${(d3.format(".2f"))(eval(tot_varsp2[i])/p2_pgs.length)}`
    	} else if($("#comparison_type").val()=="gw-range"){
    		var input1 = `<strong>${filtered_p1[0].web_name} between ${gw1_vs1} - ${gw2_vs1} </strong> <br><strong>${features[i]} per game started:</strong> ${(d3.format(".2f"))(eval(tot_varsp1[i])/p1_pgs.length)}`
    		var input2 = `<strong>${filtered_p1[0].web_name} between ${gw1_vs2} - ${gw2_vs2} </strong> <br><strong>${features[i]} per game started:</strong> ${(d3.format(".2f"))(eval(tot_varsp2[i])/p2_pgs.length)}`
    	}

    	total_p1_pgs.push({'axis':`${features[i]}`, 'value':Nan_rep((eval(tot_varsp1[i])/p1_pgs.length)/(eval(tot_varsp1[i])/p1_pgs.length+eval(tot_varsp2[i])/p2_pgs.length)), "actual":input1,"player":0, "real": eval(tot_varsp1[i])/p1_pgs.length})
    	total_p2_pgs.push({'axis':`${features[i]}`, 'value':Nan_rep((eval(tot_varsp2[i])/p2_pgs.length)/(eval(tot_varsp1[i])/p1_pgs.length+eval(tot_varsp2[i])/p2_pgs.length)), "actual":input2,"player":1, "real":eval(tot_varsp2[i])/p2_pgs.length})
    };
    // console.log(eval(tot_varsp1_pgs[2]))

    var total_p1_90 = []
    var total_p2_90 = []
    // tot_varsp1 = []
    // tot_varsp2 = []
    for (var i=0; i<features.length; i++) {
    	// tot_varsp1.push(`p1Tot${features[i]}`)
    	// tot_varsp2.push(`p2Tot${features[i]}`)
    	// window["p1Tot" + features[i]] = filtered_p1.reduce((total, obj) => obj[features[i]] + total,0);
    	// window["p2Tot" + features[i]] = filtered_p2.reduce((total, obj) => obj[features[i]] + total,0);
    	if ($("#comparison_type").val()=="with/without"){
    		var input1 = `<strong>${filtered_p1[0].web_name} without ${data.filter(d => {return d.element == player2})[0].web_name} </strong> <br><strong>${features[i]} per 90min:</strong> ${(d3.format(".2f"))(eval(tot_varsp1[i])/(eval(tot_varsp1[1])/90))}`
    		var input2 = `<strong>${filtered_p1[0].web_name} with ${data.filter(d => {return d.element == player2})[0].web_name}</strong> <br><strong>${features[i]} per 90min:</strong> ${(d3.format(".2f"))(eval(tot_varsp2[i])/(eval(tot_varsp2[1])/90))}`
    	} else if($("#comparison_type").val()=="position"){
    		var input1 = `<strong>${filtered_p1[0].web_name} as ${pos_vs1} </strong> <br><strong>${features[i]} per 90min:</strong> ${(d3.format(".2f"))(eval(tot_varsp1[i])/(eval(tot_varsp1[1])/90))}`
    		var input2 = `<strong>${filtered_p1[0].web_name} as ${pos_vs2} </strong> <br><strong>${features[i]} per 90min:</strong> ${(d3.format(".2f"))(eval(tot_varsp2[i])/(eval(tot_varsp2[1])/90))}`
    	} else if($("#comparison_type").val()=="gw-range"){
    		var input1 = `<strong>${filtered_p1[0].web_name} between ${gw1_vs1} - ${gw2_vs1} </strong> <br><strong>${features[i]} per 90min:</strong> ${(d3.format(".2f"))(eval(tot_varsp1[i])/(eval(tot_varsp1[1])/90))}`
    		var input2 = `<strong>${filtered_p1[0].web_name} between ${gw1_vs2} - ${gw2_vs2} </strong> <br><strong>${features[i]} per 90min:</strong> ${(d3.format(".2f"))(eval(tot_varsp2[i])/(eval(tot_varsp2[1])/90))}`
    	}

    	total_p1_90.push({'axis':`${features[i]}`, 'value':Nan_rep((eval(tot_varsp1[i])/(eval(tot_varsp1[1])/90))/(eval(tot_varsp1[i])/(eval(tot_varsp1[1])/90)+eval(tot_varsp2[i])/(eval(tot_varsp2[1])/90))), "actual":input1,"player":0,"real":eval(tot_varsp1[i])/(eval(tot_varsp1[1])/90)})
    	total_p2_90.push({'axis':`${features[i]}`, 'value':Nan_rep((eval(tot_varsp2[i])/(eval(tot_varsp2[1])/90))/(eval(tot_varsp1[i])/(eval(tot_varsp1[1])/90)+eval(tot_varsp2[i])/(eval(tot_varsp2[1])/90))), "actual":input2,"player":1,"real":eval(tot_varsp2[i])/(eval(tot_varsp2[1])/90)})
    };
    
    var pos = `${filtered_p1[0].position_short} ${filtered_p2[0].position_short}`

    
    f_m = {
    	"total_points":0,
    	'minutes':1,
    	'goals_scored':2,
    	'assists':3, 
    	'clean_sheets':4,
    	'goals_conceded':5,
    	'own_goals':6,
    	'penalties_saved':7,
    	'penalties_missed':8,
    	'yellow_cards':9,
    	'red_cards':10,
    	'saves':11,
    	'bonus':12,
    	'bps':13, 
    	'influence':14,
    	'creativity':15,
    	'threat':16,
    	'ict_index':17,
    	'shots':18,
    	'xG':19,
    	'time':20,
    	'xA':21,
    	'key_passes':22,
    	'npg':23,
    	'npxG':24,
    	'xGChain':25,
    	'xGBuildup':26,
    	'form':27,
    	"round_points":28
	}

    var stats_to_show = $("#stat-select-with").select2("val")

    if (pos_pos1.includes(pos)) {
		// var features1 = ["xG","goals_scored","minutes", "npg", "npxG", "xA", "assists", "shots", "key_passes", "total_points", "bonus"]
		arr = []
		for (var i=0;i<stats_to_show.length; i++){			
			arr.push(f_m[stats_to_show[i]])	
		}

		total_p1_load = arr.map((item) => total_p1[item])
		total_p2_load = arr.map((item) => total_p2[item])
		total_p1_pgs_load = arr.map((item) => total_p1_pgs[item])
		total_p2_pgs_load = arr.map((item) => total_p2_pgs[item])
		total_p1_90_load = arr.map((item) => total_p1_90[item])
		total_p2_90_load = arr.map((item) => total_p2_90[item])
	} if (pos_pos2.includes(pos)) {
 //    	var features2 = ["total_points", "bonus", "goals_conceded", "saves", "penalties_saved", "minutes", "own_goals","clean_sheets"]
 		// arr = [f_m.total_points,f_m.bonus,f_m.goals_conceded,f_m.saves,f_m.penalties_saved,f_m.minutes,f_m.own_goals,f_m.clean_sheets]
 		arr = []
		for (var i=0;i<stats_to_show.length; i++){			
			arr.push(f_m[stats_to_show[i]])	
		}
		total_p1_load = arr.map((item) => total_p1[item])
		total_p2_load = arr.map((item) => total_p2[item])
		total_p1_pgs_load = arr.map((item) => total_p1_pgs[item])
		total_p2_pgs_load = arr.map((item) => total_p2_pgs[item])
		total_p1_90_load = arr.map((item) => total_p1_90[item])
		total_p2_90_load = arr.map((item) => total_p2_90[item])
    } if (pos_pos3.includes(pos)){
    	// var features3 = ["goals_scored", "npg", "assists", "shots", "key_passes", "total_points", "bonus", "goals_conceded", "clean_sheets"]
    	// arr = [f_m.bonus,f_m.npg,f_m.assists,f_m.shots,f_m.key_passes,f_m.total_points,f_m.bonus,f_m.goals_conceded,f_m.clean_sheets]
    	arr = []
		for (var i=0;i<stats_to_show.length; i++){			
			arr.push(f_m[stats_to_show[i]])	
		}
		total_p1_load = arr.map((item) => total_p1[item])
		total_p2_load = arr.map((item) => total_p2[item])
		total_p1_pgs_load = arr.map((item) => total_p1_pgs[item])
		total_p2_pgs_load = arr.map((item) => total_p2_pgs[item])
		total_p1_90_load = arr.map((item) => total_p1_90[item])
		total_p2_90_load = arr.map((item) => total_p2_90[item])
    } if (pos_pos4.includes(pos)) {
    	// var features4 = ["goals_scored", "npg", "assists", "clean_sheets", "total_points", "bonus", "time"]
    	// arr = [f_m.bonus,f_m.npg,f_m.assists,f_m.clean_sheets,f_m.total_points,f_m.bonus,f_m.time]
    	arr = []
		for (var i=0;i<stats_to_show.length; i++){			
			arr.push(f_m[stats_to_show[i]])	
		}
		total_p1_load = arr.map((item) => total_p1[item])
		total_p2_load = arr.map((item) => total_p2[item])
		total_p1_pgs_load = arr.map((item) => total_p1_pgs[item])
		total_p2_pgs_load = arr.map((item) => total_p2_pgs[item])
		total_p1_90_load = arr.map((item) => total_p1_90[item])
		total_p2_90_load = arr.map((item) => total_p2_90[item])
    } if (pos_pos5.includes(pos)) {
    	arr = []
		for (var i=0;i<stats_to_show.length; i++){			
			arr.push(f_m[stats_to_show[i]])	
		}
    	// arr = [f_m.bonus,f_m.assists,f_m.clean_sheets,f_m.total_points,f_m.bonus,f_m.time,f_m.goals_scored]
		total_p1_load = arr.map((item) => total_p1[item])
		total_p2_load = arr.map((item) => total_p2[item])
		total_p1_pgs_load = arr.map((item) => total_p1_pgs[item])
		total_p2_pgs_load = arr.map((item) => total_p2_pgs[item])
		total_p1_90_load = arr.map((item) => total_p1_90[item])
		total_p2_90_load = arr.map((item) => total_p2_90[item])
    } if (pos_pos6.includes(pos)) {
    	arr = []
		for (var i=0;i<stats_to_show.length; i++){			
			arr.push(f_m[stats_to_show[i]])	
		}
    	// arr = [f_m.bonus,f_m.assists,f_m.clean_sheets,f_m.total_points,f_m.bonus,f_m.time,f_m.goals_scored]
		total_p1_load = arr.map((item) => total_p1[item])
		total_p2_load = arr.map((item) => total_p2[item])
		total_p1_pgs_load = arr.map((item) => total_p1_pgs[item])
		total_p2_pgs_load = arr.map((item) => total_p2_pgs[item])
		total_p1_90_load = arr.map((item) => total_p1_90[item])
		total_p2_90_load = arr.map((item) => total_p2_90[item])
    }

    sample_trial = [total_p1_load, total_p2_load]
    sample_pgs = [total_p1_pgs_load, total_p2_pgs_load]
    sample_90 = [total_p1_90_load, total_p2_90_load]

    var diverging_total = []
    for (let i=0; i<total_p1.length;i++){
    	diverging_total.push({"rank":i,"name":total_p1[i].axis,"difference":(total_p2[i].real - total_p1[i].real)/(total_p2[i].real + total_p1[i].real),"actual":`${total_p1[i].actual}<br>${total_p2[i].actual}`})
    }

    diverging_total.sort(function(a, b) {
	    return b.difference - a.difference;
	});

    var diverging_pgs = []
    for (let i=0; i<total_p1.length;i++){
    	diverging_pgs.push({"rank":i,"name":total_p1_pgs[i].axis,"difference":total_p2_pgs[i].value - total_p1_pgs[i].value,"actual":`${total_p1_pgs[i].actual}<br>${total_p2_pgs[i].actual}`})
    }

    diverging_pgs.sort(function(a, b) {
	    return b.difference - a.difference;
	});

    var diverging_90 = []
    for (let i=0; i<total_p1.length;i++){
    	diverging_90.push({"rank":i,"name":total_p1_90[i].axis,"difference":total_p2_90[i].value - total_p1_90[i].value,"actual":`${total_p1_90[i].actual}<br>${total_p2_90[i].actual}`})
    }

    diverging_90.sort(function(a, b) {
	    return b.difference - a.difference;
	});

	var stat_type = $('#stat-with option:selected').val()
	var insert = [sample_trial,sample_90,sample_pgs]

	// RadarChart("#radarChart_2", insert[0], radarChartOptions)

	
	stat_type == "total" ? RadarChart("#radarChart_2", insert[0], radarChartOptions) : stat_type == "per_game_started" ? RadarChart("#radarChart_2", insert[2], radarChartOptions) : RadarChart("#radarChart_2", insert[1], radarChartOptions);
	
	
	// console.log(sample_trial)
	
}

// Unique function
function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

// update function
function update (data,chart_type) {
	d3.select(".radarChart").selectAll("*").remove();
	// d3.selectAll(".bars").remove()
	// d3.selectAll(".labels").remove()

	var player1 = $('#player1 option:selected').val()
    var player2 = $('#player2 option:selected').val()

    // console.log($('#check option:checked').val())
    // console.log(data)

	var gw_low = $("#gw-slider").slider("values",0)
    var gw_high = $("#gw-slider").slider("values",1)

	var filtered_p1 = data.filter(d => {
    	return d.element == player1 && d.round <= gw_high && d.round >= gw_low
    });

	var filtered_p2 = data.filter(d => {
    	return d.element == player2 && d.round <= gw_high && d.round >= gw_low
    });

    var info_fitness_p1 = d3.select("#info1")
		.on('mouseover.tooltip', function(d) {
		    tooltip.transition()
		      .duration(300)
		      .style("opacity", 1);
		    tooltip.html(`<strong>News:</strong> ${filtered_p1[0].news.length == 0 ? "Available!":filtered_p1[0].news}<br><br>Click to see full data!`)
		      .style("left", (d3.event.pageX) + "px")
		      .style("top", (d3.event.pageY + 10) + "px");
		  })
		.on("mouseout.tooltip", function() {
		    tooltip.transition()
		      .duration(100)
		      .style("opacity", 0);
		  })

	var info_fitness_p2 = d3.select("#info2")
		.on('mouseover.tooltip', function(d) {
		    tooltip.transition()
		      .duration(300)
		      .style("opacity", 1);
		    tooltip.html(`<strong>News:</strong> ${filtered_p2[0].news.length == 0 ? "Available!":filtered_p2[0].news}<br><br>Click to see full data!`)
		      .style("left", (d3.event.pageX) + "px")
		      .style("top", (d3.event.pageY + 10) + "px");
		  })
		.on("mouseout.tooltip", function() {
		    tooltip.transition()
		      .duration(100)
		      .style("opacity", 0);
		  })

	//	BACKGROUND COLOR PLAYER IMAGE AVAILABILITY
	if (filtered_p1[0].chance_playing_nx == 100) {
		document.getElementById("info1").style.color = "#0FA121";
	} if (filtered_p1[0].chance_playing_nx == 75) {
		document.getElementById("info1").style.color = "#E5D125";
	} if (filtered_p1[0].chance_playing_nx == 50) {
		document.getElementById("info1").style.color = "#E29019";
	} if (filtered_p1[0].chance_playing_nx < 50) {
		document.getElementById("info1").style.color = "#E33939";
	}
	
	if (filtered_p2[0].chance_playing_nx == 100) {
		document.getElementById("info2").style.color = "#0FA121";
	} if (filtered_p2[0].chance_playing_nx == 75) {
		document.getElementById("info2").style.color = "#E5D125";
	} if (filtered_p2[0].chance_playing_nx == 50) {
		document.getElementById("info2").style.color = "#E29019";
	} if (filtered_p2[0].chance_playing_nx < 50) {
		document.getElementById("info2").style.color = "#E33939";
	}

	document.getElementById("pl1").src=`https://resources.premierleague.com/premierleague/photos/players/110x140/p${filtered_p1[0].code}.png`;
    document.getElementById("pl2").src=`https://resources.premierleague.com/premierleague/photos/players/110x140/p${filtered_p2[0].code}.png`;
    
    features = ['total_points', 'minutes','goals_scored', 'assists', 'clean_sheets', 'goals_conceded',
       'own_goals', 'penalties_saved', 'penalties_missed', 'yellow_cards','red_cards', 'saves',
       'bonus', 'bps', 'influence', 'creativity','threat', 'ict_index','shots', 'xG', 'time', 
       'xA', 'key_passes', 'npg', 'npxG','xGChain', 'xGBuildup',"form","round_points"]

    var total_p1 = []
    var total_p2 = []
    tot_varsp1 = []
    tot_varsp2 = []
    for (var i=0; i<features.length; i++) {
    	tot_varsp1.push(`p1Tot${features[i]}`)
    	tot_varsp2.push(`p2Tot${features[i]}`)
    	if (features[i]=="form" || features[i]=="round_points"){
    		window["p1Tot" + features[i]] = filtered_p1[0][features[i]];
    		window["p2Tot" + features[i]] = filtered_p2[0][features[i]];	
    	} else {
    		window["p1Tot" + features[i]] = filtered_p1.reduce((total, obj) => obj[features[i]] + total,0);
    		window["p2Tot" + features[i]] = filtered_p2.reduce((total, obj) => obj[features[i]] + total,0);
    	}
    	
    	total_p1.push({'axis':`${features[i]}`, 'value':Nan_rep(eval(tot_varsp1[i])/(eval(tot_varsp1[i])+eval(tot_varsp2[i]))), "actual": `<strong>${filtered_p1[0].web_name}</strong> <br><strong>${features[i]}:</strong> ${(d3.format(".2f"))(eval(tot_varsp1[i]))}`,"player":0,"real":eval(tot_varsp1[i])}) 
    	total_p2.push({'axis':`${features[i]}`, 'value':Nan_rep(eval(tot_varsp2[i])/(eval(tot_varsp1[i])+eval(tot_varsp2[i]))), "actual":`<strong>${filtered_p2[0].web_name}</strong> <br><strong>${features[i]}:</strong> ${(d3.format(".2f"))(eval(tot_varsp2[i]))}`,"player":1,"real":eval(tot_varsp2[i])})
    };
    
    p1_pgs = filtered_p1.filter(d => {
		return d.position != "Sub" && d.position != "Not selected"
	});
	p2_pgs = filtered_p2.filter(d => {
		return d.position != "Sub" && d.position != "Not selected"
	});

	var total_p1_pgs = []
    var total_p2_pgs = []
    // tot_varsp1_pgs = []
    // tot_varsp2_pgs = []
    for (var i=0; i<features.length; i++) {
    	// tot_varsp1_pgs.push(`p1TotPgs${features[i]}`)
    	// tot_varsp2_pgs.push(`p2TotPgs${features[i]}`)
    	// window["p1TotPgs" + features[i]] = p1_pgs.reduce((total, obj) => obj[features[i]] + total,0);
    	// window["p2TotPgs" + features[i]] = p2_pgs.reduce((total, obj) => obj[features[i]] + total,0);
    	total_p1_pgs.push({'axis':`${features[i]}`, 'value':Nan_rep((eval(tot_varsp1[i])/p1_pgs.length)/(eval(tot_varsp1[i])/p1_pgs.length+eval(tot_varsp2[i])/p2_pgs.length)), "actual":`<strong>${filtered_p1[0].web_name}</strong> <br><strong>${features[i]} per game started:</strong> ${(d3.format(".2f"))(eval(tot_varsp1[i])/p1_pgs.length)}`,"player":0, "real": eval(tot_varsp1[i])/p1_pgs.length})
    	total_p2_pgs.push({'axis':`${features[i]}`, 'value':Nan_rep((eval(tot_varsp2[i])/p2_pgs.length)/(eval(tot_varsp1[i])/p1_pgs.length+eval(tot_varsp2[i])/p2_pgs.length)), "actual":`<strong>${filtered_p2[0].web_name}</strong> <br><strong>${features[i]} per game started:</strong> ${(d3.format(".2f"))(eval(tot_varsp2[i])/p2_pgs.length)}`,"player":1, "real":eval(tot_varsp2[i])/p2_pgs.length})
    };
    // console.log(eval(tot_varsp1_pgs[2]))

    var total_p1_90 = []
    var total_p2_90 = []
    // tot_varsp1 = []
    // tot_varsp2 = []
    for (var i=0; i<features.length; i++) {
    	// tot_varsp1.push(`p1Tot${features[i]}`)
    	// tot_varsp2.push(`p2Tot${features[i]}`)
    	// window["p1Tot" + features[i]] = filtered_p1.reduce((total, obj) => obj[features[i]] + total,0);
    	// window["p2Tot" + features[i]] = filtered_p2.reduce((total, obj) => obj[features[i]] + total,0);
    	total_p1_90.push({'axis':`${features[i]}`, 'value':Nan_rep((eval(tot_varsp1[i])/(eval(tot_varsp1[1])/90))/(eval(tot_varsp1[i])/(eval(tot_varsp1[1])/90)+eval(tot_varsp2[i])/(eval(tot_varsp2[1])/90))), "actual":`<strong>${filtered_p1[0].web_name}</strong> <br><strong>${features[i]} per 90min:</strong> ${(d3.format(".2f"))(eval(tot_varsp1[i])/(eval(tot_varsp1[1])/90))}`,"player":0,"real":eval(tot_varsp1[i])/(eval(tot_varsp1[1])/90)})
    	total_p2_90.push({'axis':`${features[i]}`, 'value':Nan_rep((eval(tot_varsp2[i])/(eval(tot_varsp2[1])/90))/(eval(tot_varsp1[i])/(eval(tot_varsp1[1])/90)+eval(tot_varsp2[i])/(eval(tot_varsp2[1])/90))), "actual":`<strong>${filtered_p2[0].web_name}</strong> <br><strong>${features[i]} per 90min:</strong> ${(d3.format(".2f"))(eval(tot_varsp2[i])/(eval(tot_varsp2[1])/90))}`,"player":1,"real":eval(tot_varsp2[i])/(eval(tot_varsp2[1])/90)})
    };
    
    var pos = `${filtered_p1[0].position_short} ${filtered_p2[0].position_short}`

    
    f_m = {
    	"total_points":0,
    	'minutes':1,
    	'goals_scored':2,
    	'assists':3, 
    	'clean_sheets':4,
    	'goals_conceded':5,
    	'own_goals':6,
    	'penalties_saved':7,
    	'penalties_missed':8,
    	'yellow_cards':9,
    	'red_cards':10,
    	'saves':11,
    	'bonus':12,
    	'bps':13, 
    	'influence':14,
    	'creativity':15,
    	'threat':16,
    	'ict_index':17,
    	'shots':18,
    	'xG':19,
    	'time':20,
    	'xA':21,
    	'key_passes':22,
    	'npg':23,
    	'npxG':24,
    	'xGChain':25,
    	'xGBuildup':26,
    	'form':27,
    	"round_points":28
	}

    var stats_to_show = $("#stat-select").select2("val")

    if (pos_pos1.includes(pos)) {
		// var features1 = ["xG","goals_scored","minutes", "npg", "npxG", "xA", "assists", "shots", "key_passes", "total_points", "bonus"]
		arr = []
		for (var i=0;i<stats_to_show.length; i++){			
			arr.push(f_m[stats_to_show[i]])	
		}

		total_p1_load = arr.map((item) => total_p1[item])
		total_p2_load = arr.map((item) => total_p2[item])
		total_p1_pgs_load = arr.map((item) => total_p1_pgs[item])
		total_p2_pgs_load = arr.map((item) => total_p2_pgs[item])
		total_p1_90_load = arr.map((item) => total_p1_90[item])
		total_p2_90_load = arr.map((item) => total_p2_90[item])
	} if (pos_pos2.includes(pos)) {
 //    	var features2 = ["total_points", "bonus", "goals_conceded", "saves", "penalties_saved", "minutes", "own_goals","clean_sheets"]
 		// arr = [f_m.total_points,f_m.bonus,f_m.goals_conceded,f_m.saves,f_m.penalties_saved,f_m.minutes,f_m.own_goals,f_m.clean_sheets]
 		arr = []
		for (var i=0;i<stats_to_show.length; i++){			
			arr.push(f_m[stats_to_show[i]])	
		}
		total_p1_load = arr.map((item) => total_p1[item])
		total_p2_load = arr.map((item) => total_p2[item])
		total_p1_pgs_load = arr.map((item) => total_p1_pgs[item])
		total_p2_pgs_load = arr.map((item) => total_p2_pgs[item])
		total_p1_90_load = arr.map((item) => total_p1_90[item])
		total_p2_90_load = arr.map((item) => total_p2_90[item])
    } if (pos_pos3.includes(pos)){
    	// var features3 = ["goals_scored", "npg", "assists", "shots", "key_passes", "total_points", "bonus", "goals_conceded", "clean_sheets"]
    	// arr = [f_m.bonus,f_m.npg,f_m.assists,f_m.shots,f_m.key_passes,f_m.total_points,f_m.bonus,f_m.goals_conceded,f_m.clean_sheets]
    	arr = []
		for (var i=0;i<stats_to_show.length; i++){			
			arr.push(f_m[stats_to_show[i]])	
		}
		total_p1_load = arr.map((item) => total_p1[item])
		total_p2_load = arr.map((item) => total_p2[item])
		total_p1_pgs_load = arr.map((item) => total_p1_pgs[item])
		total_p2_pgs_load = arr.map((item) => total_p2_pgs[item])
		total_p1_90_load = arr.map((item) => total_p1_90[item])
		total_p2_90_load = arr.map((item) => total_p2_90[item])
    } if (pos_pos4.includes(pos)) {
    	// var features4 = ["goals_scored", "npg", "assists", "clean_sheets", "total_points", "bonus", "time"]
    	// arr = [f_m.bonus,f_m.npg,f_m.assists,f_m.clean_sheets,f_m.total_points,f_m.bonus,f_m.time]
    	arr = []
		for (var i=0;i<stats_to_show.length; i++){			
			arr.push(f_m[stats_to_show[i]])	
		}
		total_p1_load = arr.map((item) => total_p1[item])
		total_p2_load = arr.map((item) => total_p2[item])
		total_p1_pgs_load = arr.map((item) => total_p1_pgs[item])
		total_p2_pgs_load = arr.map((item) => total_p2_pgs[item])
		total_p1_90_load = arr.map((item) => total_p1_90[item])
		total_p2_90_load = arr.map((item) => total_p2_90[item])
    } if (pos_pos5.includes(pos)) {
    	arr = []
		for (var i=0;i<stats_to_show.length; i++){			
			arr.push(f_m[stats_to_show[i]])	
		}
    	// arr = [f_m.bonus,f_m.assists,f_m.clean_sheets,f_m.total_points,f_m.bonus,f_m.time,f_m.goals_scored]
		total_p1_load = arr.map((item) => total_p1[item])
		total_p2_load = arr.map((item) => total_p2[item])
		total_p1_pgs_load = arr.map((item) => total_p1_pgs[item])
		total_p2_pgs_load = arr.map((item) => total_p2_pgs[item])
		total_p1_90_load = arr.map((item) => total_p1_90[item])
		total_p2_90_load = arr.map((item) => total_p2_90[item])
    } if (pos_pos6.includes(pos)) {
    	arr = []
		for (var i=0;i<stats_to_show.length; i++){			
			arr.push(f_m[stats_to_show[i]])	
		}
    	// arr = [f_m.bonus,f_m.assists,f_m.clean_sheets,f_m.total_points,f_m.bonus,f_m.time,f_m.goals_scored]
		total_p1_load = arr.map((item) => total_p1[item])
		total_p2_load = arr.map((item) => total_p2[item])
		total_p1_pgs_load = arr.map((item) => total_p1_pgs[item])
		total_p2_pgs_load = arr.map((item) => total_p2_pgs[item])
		total_p1_90_load = arr.map((item) => total_p1_90[item])
		total_p2_90_load = arr.map((item) => total_p2_90[item])
    }

    sample_trial = [total_p1_load, total_p2_load]
    sample_pgs = [total_p1_pgs_load, total_p2_pgs_load]
    sample_90 = [total_p1_90_load, total_p2_90_load]

    var diverging_total = []
    for (let i=0; i<total_p1.length;i++){
    	diverging_total.push({"rank":i,"name":total_p1[i].axis,"difference":(total_p2[i].real - total_p1[i].real)/(total_p2[i].real + total_p1[i].real),"actual":`${total_p1[i].actual}<br>${total_p2[i].actual}`})
    }

    diverging_total.sort(function(a, b) {
	    return b.difference - a.difference;
	});

    var diverging_pgs = []
    for (let i=0; i<total_p1.length;i++){
    	diverging_pgs.push({"rank":i,"name":total_p1_pgs[i].axis,"difference":total_p2_pgs[i].value - total_p1_pgs[i].value,"actual":`${total_p1_pgs[i].actual}<br>${total_p2_pgs[i].actual}`})
    }

    diverging_pgs.sort(function(a, b) {
	    return b.difference - a.difference;
	});

    var diverging_90 = []
    for (let i=0; i<total_p1.length;i++){
    	diverging_90.push({"rank":i,"name":total_p1_90[i].axis,"difference":total_p2_90[i].value - total_p1_90[i].value,"actual":`${total_p1_90[i].actual}<br>${total_p2_90[i].actual}`})
    }

    diverging_90.sort(function(a, b) {
	    return b.difference - a.difference;
	});

	var stat_type = $('#stat option:selected').val()
	var insert = [sample_trial,sample_pgs,sample_90]

	if (document.getElementById('check').checked) {	
		stat_type == "total" ? diverging_chart(diverging_total,stats_to_show) : stat_type == "per_game_started" ? diverging_chart(diverging_pgs,stats_to_show) : diverging_chart(diverging_90,stats_to_show);
	} else {
		stat_type == "total" ? RadarChart(".radarChart", insert[0], radarChartOptions) : stat_type == "per_game_started" ? RadarChart(".radarChart", insert[1], radarChartOptions) : RadarChart(".radarChart", insert[2], radarChartOptions);
	}

	//Call function to draw the Radar chart
	

	var current_p1 = data.filter(d => {return d.element == player1})
	current_gw_p1 = current_p1.slice(Math.max(current_p1.length - 1, 0))
	var current_p2 = data.filter(d => {return d.element == player2})
	current_gw_p2 = current_p2.slice(Math.max(current_p2.length - 1, 0))
	
	
	let p1_info = `(${filtered_p1[0].position_short})`
	p1_info += `<br><strong>Current price:</strong> £${(d3.format(".1f"))(current_gw_p1[0].value)}`
	p1_info += `<br><strong>Selected by (%):</strong> ${(d3.format(".1f"))(current_gw_p1[0].selected_by_percent)}`
	p1_info += `<br><strong>Penalty order:</strong> ${filtered_p1[0].penalties_order == 0 ? "Not on penalties!" :(d3.format(".0f"))(filtered_p1[0].penalties_order)}`
	p1_info += `<br><strong>Direct freekicks order:</strong> ${filtered_p1[0].direct_freekicks_order == 0 ? "Not on freekicks!" :(d3.format(".0f"))(filtered_p1[0].direct_freekicks_order)}`
	p1_info += `<br><strong>Corners and indirect freekicks order:</strong> ${filtered_p1[0].corners_and_indirect_freekicks_order == 0 ? "Not on corners!" :(d3.format(".0f"))(filtered_p1[0].corners_and_indirect_freekicks_order)}`

	document.getElementById('p1-info').innerHTML = p1_info

	let p2_info = `(${filtered_p2[0].position_short})`
	p2_info += `<br><strong>Current price:</strong> £${(d3.format(".1f"))(current_gw_p2[0].value)}`
	p2_info += `<br><strong>Selected by (%):</strong> ${(d3.format(".1f"))(current_gw_p2[0].selected_by_percent)}`
	p2_info += `<br><strong>Penalty order:</strong> ${filtered_p2[0].penalties_order == 0 ? "Not on penalties!" :(d3.format(".0f"))(filtered_p2[0].penalties_order)}`
	p2_info += `<br><strong>Direct freekicks order:</strong> ${filtered_p2[0].direct_freekicks_order == 0 ? "Not on freekicks!" :(d3.format(".0f"))(filtered_p2[0].direct_freekicks_order)}`
	p2_info += `<br><strong>Corners and indirect freekicks order:</strong> ${filtered_p2[0].corners_and_indirect_freekicks_order == 0 ? "Not on corners!" :(d3.format(".0f"))(filtered_p2[0].corners_and_indirect_freekicks_order)}`

	document.getElementById('p2-info').innerHTML = p2_info
	

    d3.select("#comparison_div").selectAll("table").remove()
    // d3.select("#comparison_div").selectAll("table").remove()
    d3.select("#p2-full-table").selectAll("table").remove()
    d3.select("#p1-full-table").selectAll("table").remove()
    d3.select("#p1-full-fixtures").selectAll("table").remove()
    d3.select("#p2-full-fixtures").selectAll("table").remove()
    d3.select("#teams_div").selectAll("table").remove()
    
    d3.selectAll("#blank_text").remove()
   
	insert_table(filtered_p1,"#p1-past-games",data.filter(d => {return d.element == player1}))
	insert_table(filtered_p2,"#p2-past-games",data.filter(d => {return d.element == player2}))

	popup_full_table(data.filter(d => {return d.element == player1}),"#p1-full-table")
	popup_full_table(data.filter(d => {return d.element == player2}),"#p2-full-table")

	d3.csv("/data/fixtures.csv", function(error, fix) {
		if (error) throw error;

		

		fix.forEach(d => {
		    d.event = Number(d.event)
		    d.team_a_difficulty == "(blank)"? d.team_a_difficulty : Number(d.team_a_difficulty)
		    d.team_h_difficulty == "(blank)"? d.team_h_difficulty : Number(d.team_h_difficulty)
		});
		
		var fixtures_p1  = fix.filter(d =>{
			return d.team_a_short_name == current_p1[0].team_short || d.team_h_short_name == current_p1[0].team_short
		})
		fixtures_p1.sort(function(a, b) {
		    return a.event-b.event;
		});

		var fixtures_p2  = fix.filter(d =>{
			return d.team_a_short_name == current_p2[0].team_short || d.team_h_short_name == current_p2[0].team_short
		})

		fixtures_p2.sort(function(a, b) {
		    return a.event-b.event;
		});

		insert_fixture_table (fixtures_p1, current_p1,"#fixturesp1","sliced")
		insert_fixture_table (fixtures_p2, current_p2,"#fixturesp2","sliced")

		insert_fixture_table (fixtures_p1, current_p1,"#p1-full-fixtures","full")
		insert_fixture_table (fixtures_p2, current_p2,"#p2-full-fixtures","full")

		$(function() {
		    $('tr > td').each(function(index) {
		        var scale = [['easy', 2], ['mid', 3], ['diff', 4], ['vdiff', 5]];
		        var score = $(this).text();
		        for (var i = 0; i < scale.length; i++) {
		            if (score == scale[i][1]) {
		                $(this).addClass(scale[i][0]);
		            }
		        }
		    });
		});
		d3.csv("/data/teams_full.csv", function(error, teams) {
			if (error) throw error;

			teams.forEach(d => {
			    d.deep = Number(d.deep)
			    d.deep_allowed = Number(d.deep_allowed)
			    d.draws = Number(d.draws)
			    d.id = Number(d.id)
			    d.loses = Number(d.loses)
			    d.missed = Number(d.missed)
			    d.npxG = Number(d.npxG)
			    d.npxGA = Number(d.npxGA)
			    d.npxGD = Number(d.npxGD)
			    d.pts = Number(d.pts)
			    d.scored = Number(d.scored)
			    d.wins = Number(d.wins)
			    d.xG = Number(d.xG)
			    d.xGA = Number(d.xGA)
			});

			insert_next_games(teams,fixtures_p1,current_p1,"#nextgwp1")
			insert_next_games(teams,fixtures_p2,current_p2,"#nextgwp2")

			insert_next_games_full(teams,"#teams_1",0,4)
			insert_next_games_full(teams,"#teams_2",4,8)
			insert_next_games_full(teams,"#teams_3",8,12)
			insert_next_games_full(teams,"#teams_4",12,16)
			insert_next_games_full(teams,"#teams_5",16,20)

			// insert_next_games_full(teams,"#all_teams")
		})
	})


}

function popup_full_table (data,id) {
	  var table_pl = d3.select(id).append('table').attr("class","table_pl");;
	  // var titles_pl = d3.keys(data[0]);
	  
	  titles_pl = ["round", "value", "team", "opponent", "was_home","team_h_score", "team_a_score","minutes","total_points", 
	  "shots", "xG","goals_scored", "npxG", "npg", "xA", "assists", "xGChain", "xGBuildup", "key_passes", "clean_sheets",
	  "goals_conceded","own_goals", "penalties_saved", "penalties_missed", "yellow_cards", "red_cards", "saves", 
	  "bonus", "bps", "influence", "creativity", "threat", "ict_index", "transfers_balance", 
	  "selected", "transfers_in", "transfers_out", "corners_and_indirect_freekicks_order", 
	  "direct_freekicks_order", "penalties_order"]

	  var headers_pl = table_pl.append('thead').append('tr')
	  		.attr("class","sticky-header")
           .selectAll('th')
           .data(titles_pl).enter()
           .append('th')
           .text(function (d) {
                return d;})
          .on('mouseover.tooltip', function(d) {
			    tooltip.transition()
			      .duration(300)
			      .style("opacity", 1);
			    tooltip.html(`${var_explanation[d]}`)
			      .style("left", (d3.event.pageX) + "px")
			      .style("top", (d3.event.pageY - 30) + "px");
			  })
			.on("mouseout.tooltip", function() {
			    tooltip.transition()
			      .duration(100)
			      .style("opacity", 0);
			  })

	  var rows_pl = table_pl.append('tbody').selectAll('tr')
	               .data(data).enter()
	               .append('tr');
	  rows_pl.selectAll('td')
	    .data(function (d) {
	    	return titles_pl.map(function (k) {
	    		return { 'value': d[k], 'name': k};
	    	});
	    }).enter()
	    .append('td')
	    .attr('data-th', function (d) {
	    	return d.name;
	    })
	    .text(function (d) {
	    	return (d.name == "xG")||(d.name == "xA")||(d.name == "npxG")||(d.name == "xGChain")||(d.name == "xGBuildup")||(d.name == "xA") ? (d3.format(".2f"))(d.value) : (d.name == "transfers_balance")||(d.name == "selected")||(d.name == "transfers_in")||(d.name == "transfers_out") ?(d3.format(","))(d.value) : d.value;
	    });
}

function insert_next_games (data,fixtures,current,id) {

	for (i=0;i<2;i++){
		if (fixtures[i].team_a_short_name == current[0].team_short) {
			to_insert_fixtures = data.filter(d=> {return d.team_short == fixtures[i].team_h_short_name})
		} if (fixtures[i].team_h_short_name == current[0].team_short) {
			to_insert_fixtures = data.filter(d=> {return d.team_short == fixtures[i].team_a_short_name})
		}

		next_gws_team = []

		if (to_insert_fixtures.length == 0){
			blank_gw = d3.select(id).append('text')
				.attr("id","blank_text")
				.text(`${fixtures[i].team_h_short_name} blanks in GW ${fixtures[i].event}`)
		} else {
			for (j=0; j<to_insert_fixtures.length; j++){
				next_gws_team.push({'team':`${to_insert_fixtures[j].team_short}`, 'xGA':to_insert_fixtures[j].xGA,'GA':to_insert_fixtures[j].missed, 'xG':to_insert_fixtures[j].xG,'G':to_insert_fixtures[j].scored}) 
			}
			next_gws_team_L4 = next_gws_team.slice(Math.max(next_gws_team.length - 4, 0))
			next_gws_team_L6 = next_gws_team.slice(Math.max(next_gws_team.length - 6, 0))
			total_L4 = {}
			total_L4['stat'] = `Last 4`;
			
			next_gws_team_L4.forEach(function(d) {
			    ["team","xGA","GA","xG","G"].forEach(function(k) {
			        if (k !== "team") {
			            if (k in total_L4) {
			                total_L4[k] += d[k];
			            } else {
			                total_L4[k] = d[k];
			            }
			        }
			    });
			});
			
			total_L6 = {}
			total_L6['stat'] = `Last 6`;
			next_gws_team_L6.forEach(function(d) {
			    ["team","xGA","GA","xG","G"].forEach(function(k) {
			        if (k !== "team") {
			            if (k in total_L6) {
			                total_L6[k] += d[k];
			            } else {
			                total_L6[k] = d[k];
			            }
			        }
			    });
			});
			
			total_S = {}
			total_S['stat'] = `Season`;
			next_gws_team.forEach(function(d) {
			    ["team","xGA","GA","xG","G"].forEach(function(k) {
			        if (k !== "team") {
			            if (k in total_S) {
			                total_S[k] += d[k];
			            } else {
			                total_S[k] = d[k];
			            }
			        }
			    });
			});

			trial = [total_S,total_L4,total_L6]

			var table_nx = d3.select(id).append('table').attr("class","table_nx");

			var headers_nx = table_nx.append('thead').append('tr')
		       .selectAll('th')
		       .data([`${next_gws_team[0].team}`,"xGA","GA","xG","G"]).enter()
		       .append('th')
		       .text(function (d) {
		            return d;
		        })
			    .on('mouseover.tooltip', function(d) {
				    tooltip.transition()
				      .duration(300)
				      .style("opacity", 1);
				    tooltip.html(`${var_explanation[d]}`)
				      .style("left", (d3.event.pageX) + "px")
				      .style("top", (d3.event.pageY - 30) + "px");
				  })
				.on("mouseout.tooltip", function() {
				    tooltip.transition()
				      .duration(100)
				      .style("opacity", 0);
				  })

			var rows_nx = table_nx.append('tbody').selectAll('tr')
		       .data(trial).enter()
		       .append('tr');
			rows_nx.selectAll('td')
				.data(function (d) {
				return ["stat","xGA","GA","xG","G"].map(function (k) {
					return { 'value': d[k], 'name': k};
				});
			}).enter()
			.append('td')
			.attr('data-th', function (d) {
				return d.name;
			})
			.text(function (d) {
				return d.name != "stat" ? (d3.format(".0f"))(d.value) : d.value;
			});
		}
	}		
}

function insert_next_games_full (data,id,start, finish) {
	team_list = []
	data.forEach(d=> team_list.push(d.title))
	team_list = team_list.filter(onlyUnique)
	team_list.sort(function(a, b) {
	    var textA = a.toUpperCase();
	    var textB = b.toUpperCase();
	    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
	});
	
	// https://resources.premierleague.com/premierleague/photos/players/110x140/p${d.add}.png
	for (i=start;i<finish;i++){
		
		to_insert_fixtures = data.filter(d=> {return d.title == team_list[i]})
		next_gws_team = []

		for (j=0; j<to_insert_fixtures.length; j++){
			next_gws_team.push({'team':`${to_insert_fixtures[j].team_short}`, 'xGA':to_insert_fixtures[j].xGA,'GA':to_insert_fixtures[j].missed, 'xG':to_insert_fixtures[j].xG,'G':to_insert_fixtures[j].scored}) 
		}
		next_gws_team_L4 = next_gws_team.slice(Math.max(next_gws_team.length - 4, 0))
		next_gws_team_L6 = next_gws_team.slice(Math.max(next_gws_team.length - 6, 0))
		total_L4 = {}
		total_L4['stat'] = `Last 4`;
		
		next_gws_team_L4.forEach(function(d) {
		    ["team","xGA","GA","xG","G"].forEach(function(k) {
		        if (k !== "team") {
		            if (k in total_L4) {
		                total_L4[k] += d[k];
		            } else {
		                total_L4[k] = d[k];
		            }
		        }
		    });
		});
		
		total_L6 = {}
		total_L6['stat'] = `Last 6`;
		next_gws_team_L6.forEach(function(d) {
		    ["team","xGA","GA","xG","G"].forEach(function(k) {
		        if (k !== "team") {
		            if (k in total_L6) {
		                total_L6[k] += d[k];
		            } else {
		                total_L6[k] = d[k];
		            }
		        }
		    });
		});
		
		total_S = {}
		total_S['stat'] = `Season`;
		next_gws_team.forEach(function(d) {
		    ["team","xGA","GA","xG","G"].forEach(function(k) {
		        if (k !== "team") {
		            if (k in total_S) {
		                total_S[k] += d[k];
		            } else {
		                total_S[k] = d[k];
		            }
		        }
		    });
		});

		trial = [total_S,total_L4,total_L6]

		var table_nx = d3.select(id).append('table').attr("class","table_nx");

		var headers_nx = table_nx.append('thead').append('tr')
	       .selectAll('th')
	       .data([`${next_gws_team[0].team}`,"xGA","GA","xG","G"]).enter()
	       .append('th')
	       .text(function (d) {
	            return d;
	        })
		    .on('mouseover.tooltip', function(d) {
			    tooltip.transition()
			      .duration(300)
			      .style("opacity", 1);
			    tooltip.html(`${var_explanation[d]}`)
			      .style("left", (d3.event.pageX) + "px")
			      .style("top", (d3.event.pageY - 30) + "px");
			  })
			.on("mouseout.tooltip", function() {
			    tooltip.transition()
			      .duration(100)
			      .style("opacity", 0);
			  })

		var rows_nx = table_nx.append('tbody').selectAll('tr')
	       .data(trial).enter()
	       .append('tr');
		rows_nx.selectAll('td')
			.data(function (d) {
			return ["stat","xGA","GA","xG","G"].map(function (k) {
				return { 'value': d[k], 'name': k};
			});
		}).enter()
		.append('td')
		.attr('data-th', function (d) {
			return d.name;
		})
		.text(function (d) {
			return d.name != "stat" ? (d3.format(".0f"))(d.value) : d.value;
		});
		
	}		
}

function diverging_chart(data,stat) {
	var margin_bar = { top_bar: 40, right_bar: 50, bottom_bar: 60, left_bar: 50 };

    var width_bar = Math.min(600, window.innerWidth - 10) - margin_bar.left_bar - margin_bar.right_bar,
        height_bar = 500 - margin_bar.top_bar - margin_bar.bottom_bar;

	var svg_bar = d3.select(".radarChart")
      .append("svg")
      .attr("width", width_bar + margin_bar.left_bar + margin_bar.right_bar)
      .attr("height", height_bar + margin_bar.top_bar + margin_bar.bottom_bar)
      .append("g")
      .attr("transform", "translate(" + margin_bar.left_bar + "," + margin_bar.top_bar + ")");

    var cfg = {
      labelMargin: 5,
      xAxisMargin: 10,
      legendRightMargin: 0
    };
    data_new = []
  	for (i=0 ; i<stat.length; i++) {
  		result = data.filter(obj => {
	  		return obj.name == stat[i]
		})
		data_new.push(result[0])
  	}

  	data_new.sort(function(a, b) {
	    return b.difference - a.difference;
	});
    

    var x = d3.scaleLinear().range([0, width_bar]);

    var colour = d3.scaleQuantize().domain([-1,1])
          .range([d3.rgb("#CC333F"), d3.rgb('#00A0B0')]);
    var y = d3.scaleBand()
      .range([height_bar, 0])
      .padding(0.1);
	y.domain(data_new.map(function(d) {return d.name;}));
    x.domain([-1,1]);

    var max = d3.max(data_new, function(d) {return d.difference;});
    colour.domain([-max, max]);

    var xAxis = svg_bar
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (height_bar + cfg.xAxisMargin) + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0));

    var bars = svg_bar.append("g").attr("class", "bars");
    bars.selectAll("rect")
      .data(data_new)
      .enter()
      .append("rect")
      .attr("class", "annual-growth")
      .attr("x", function(d) {return x(Math.min(0, d.difference));})
      .attr("y", function(d) {return y(d.name);})
      .attr("height", y.bandwidth())
      .attr("width", function(d) {return Math.abs(x(d.difference) - x(0));})
      .style("fill", function(d) {return colour(d.difference);})
      .on('mouseover.tooltip', function(d) {
        tooltip.transition()
          .duration(300)
          .style("opacity", 1);
        tooltip.html(""+d.actual+"")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY + 10) + "px");
      })
      .on("mouseout.tooltip", function() {
	    tooltip.transition()
	      .duration(100)
	      .style("opacity", 0);
	  })
    
    var yAxis = svg_bar.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(" + x(0) + ",0)")
      .append("line")
      .attr("y1", 0)
      .attr("y2", height_bar);

    adjust_labels = document.getElementsByClassName("annual-growth")[0].attributes[3].nodeValue/2.4
    
    var labels = svg_bar.append("g").attr("class", "labels");
    labels.selectAll("text")
      .data(data_new)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", x(0))
      .attr("y", function(d) {return y(d.name);})
      .attr("dx", function(d) {return d.difference < 0 ? cfg.labelMargin : -cfg.labelMargin;})
      .attr("dy", y.bandwidth()-adjust_labels)
      .attr("text-anchor", function(d) {return d.difference < 0 ? "start" : "end";})
      .text(function(d) {return d.name;})
      .style("fill", function(d) { if (d.name == "European Union") { return "blue"; }});	
}

function Nan_rep (number) {
	if (isNaN(number)) {return 0 }
		return number
};

function insert_fixture_table (data, current,id,slice) {
	next_gws = []
	for (i=0; i<data.length; i++){
		if (data[i].team_a_short_name == current[0].team_short) {
			next_gws.push({'GW':data[i].event,'opponent':data[i].team_a_difficulty == "(blank)" ? "" : `${data[i].team_h_short_name} (A)`, 'difficulty':data[i].team_a_difficulty == "(blank)" ? data[i].team_a_difficulty : (d3.format(".0f"))(data[i].team_a_difficulty), 'team':data[i].team_h_short_name})
		} if (data[i].team_h_short_name == current[0].team_short) {
			next_gws.push({'GW':data[i].event,'opponent':data[i].team_h_difficulty == "(blank)" ? "" : `${data[i].team_a_short_name} (H)`, 'difficulty':data[i].team_h_difficulty == "(blank)" ? data[i].team_h_difficulty : (d3.format(".0f"))(data[i].team_h_difficulty), 'team':data[i].team_a_short_name})
		}
	}
	gw_list = []
	next_gws.forEach(d => {
		gw_list.push(d.gw)
	})

	// next_gws = next_gws.slice(Math.max(next_gws.length - 5, 0))
	if (slice == "sliced") {
		next_gws = next_gws.slice(0,5)
	} else {
		next_gws = next_gws
	}
	
	var table_fx = d3.select(id).append('table').attr("class","table_fx");
	
	
	var headers_fx = table_fx.append('thead').append('tr')
       .selectAll('th')
       .data(["GW","opponent","difficulty"]).enter()
       .append('th')
       .text(function (d) {
            return d;
        })
		.on('mouseover.tooltip', function(d) {
		    tooltip.transition()
		      .duration(300)
		      .style("opacity", 1);
		    tooltip.html(`${var_explanation[d]}`)
		      .style("left", (d3.event.pageX) + "px")
		      .style("top", (d3.event.pageY - 30) + "px");
		  })
		.on("mouseout.tooltip", function() {
		    tooltip.transition()
		      .duration(100)
		      .style("opacity", 0);
		  });

	var rows_fx = table_fx.append('tbody').selectAll('tr')
       .data(next_gws).enter()
       .append('tr');
	rows_fx.selectAll('td')
		.data(function (d) {
		return ["GW","opponent","difficulty"].map(function (k) {
			return { 'value': d[k], 'name': k};
		});
	}).enter()
	.append('td')
	.attr('data-th', function (d) {
		return d.name;
	})
	.text(function (d) {
		return d.name == "GW" ? (d3.format(".0f"))(d.value) : d.value;
	});
}

function insert_table (data, id, season) {
    p1_5 = data.slice(Math.max(data.length - 5, 0))

    if (data[0].position_short == "FWD" || "MID") {
    	last5 = []
    	for (var i=0; i<p1_5.length; i++){
	    	p1_5[i].was_home == "True" ? turf = "(H)" : turf = "(A)"
	    	last5.push({"GW":Number(p1_5[i].round),"against":`${p1_5[i].opponent_short} ${turf}`,"pts": Number(p1_5[i].total_points), "xG":Number(p1_5[i].xG),"G":Number(p1_5[i].goals_scored),"xA":Number(p1_5[i].xA),"A":Number(p1_5[i].assists)})
	    }
    	var titles = ["GW","against","pts","xG","G","xA","A"];
    	var titles_season = ["against","total_points","xG","goals_scored","xA","assists"];
    } if (data[0].position_short == "GKP") {
    	last5 = []
    	for (var i=0; i<p1_5.length; i++){
	    	p1_5[i].was_home == "True" ? turf = "(H)" : turf = "(A)"
	    	last5.push({"GW":Number(p1_5[i].round),"against":`${p1_5[i].opponent_short} ${turf}`,"pts": Number(p1_5[i].total_points), "CS":Number(p1_5[i].clean_sheets),"GA":Number(p1_5[i].goals_conceded),"S":Number(p1_5[i].saves),"B":Number(p1_5[i].bonus)})
	    }
    	var titles = ["GW","against","pts","CS","GA","S","B"];
    	var titles_season = ["against","total_points","clean_sheets","goals_conceded","saves","bonus"];
    } if (data[0].position_short == "DEF") {
    	last5 = []
    	for (var i=0; i<p1_5.length; i++){
	    	p1_5[i].was_home == "True" ? turf = "(H)" : turf = "(A)"
	    	last5.push({"GW":Number(p1_5[i].round),"against":`${p1_5[i].opponent_short} ${turf}`,"pts": Number(p1_5[i].total_points), "CS":Number(p1_5[i].clean_sheets),"GA":Number(p1_5[i].goals_conceded),"YC":Number(p1_5[i].yellow_cards),"A":Number(p1_5[i].assists)})
	    }
    	var titles = ["GW","against","pts","CS","GA","YC","A"];
    	var titles_season = ["against","total_points","clean_sheets","goals_conceded","yellow_cards","assists"];
    }
    // var titles = ["GW","Against","pts","xG","G","xA","A"];
    totals = {}
    last5.forEach(function(d) {
	    titles.forEach(function(k) {
	        if (k !== "against") {
	            if (k in totals) {
	                totals[k] += d[k];
	            } else {
	                totals[k] = d[k];
	            }
	        }
	    });
	});
	totals['against'] = `Totals`;
    totals['GW'] = '';
	last5.push(totals);

	totals_season = {}
	// var titles_season = ["Against","total_points","xG","goals_scored","xA","assists"];
    season.forEach(function(d) {
	    titles_season.forEach(function(k) {
	        if (k !== "against") {
	            if (k in totals_season) {
	                totals_season[k] += d[k];
	            } else {
	                totals_season[k] = d[k];
	            }
	        }
	    });
	});

	if (data[0].position_short == "FWD" || "MID") {
    	totals_season['against'] = 'Season';
	    totals_season['GW'] = data.legnth;
	    totals_season.pts = totals_season.total_points;
		delete totals_season.total_points;
		totals_season.G = totals_season.goals_scored;
		delete totals_season.goals_scored;
		totals_season.A = totals_season.assists;
		delete totals_season.assists;
    } if (data[0].position_short == "GKP") {
    	totals_season['against'] = 'Season';
	    totals_season['GW'] = data.legnth;
	 //    totals_season.pts = totals_season.total_points;
		// delete totals_season.total_points;
		totals_season.CS = totals_season.clean_sheets;
		delete totals_season.clean_sheets;
		totals_season.GA = totals_season.goals_conceded;
		delete totals_season.goals_conceded;
		totals_season.S = totals_season.saves;
		delete totals_season.saves;
		totals_season.B = totals_season.bonus;
		delete totals_season.bonus;
    } if (data[0].position_short == "DEF") {
    	totals_season['against'] = 'Season';
	    totals_season['GW'] = data.legnth;
	 //    totals_season.pts = totals_season.total_points;
		// delete totals_season.total_points;
		totals_season.CS = totals_season.clean_sheets;
		delete totals_season.clean_sheets;
		totals_season.GA = totals_season.goals_conceded;
		delete totals_season.goals_conceded;
		totals_season.YC = totals_season.yellow_cards;
		delete totals_season.yellow_cards;
    }
    

	last5.push(totals_season);

	var table = d3.select(id).append('table').attr("class","past_games");
	
	var headers = table.append('thead').append('tr')
       .selectAll('th')
       .data(titles).enter()
       .append('th')
       .text(function (d) {
            return d;
        })
       .on('mouseover.tooltip', function(d) {
		    tooltip.transition()
		      .duration(300)
		      .style("opacity", 1);
		    tooltip.html(`${var_explanation[d]}`)
		      .style("left", (d3.event.pageX) + "px")
		      .style("top", (d3.event.pageY - 30) + "px");
		  })
		.on("mouseout.tooltip", function() {
		    tooltip.transition()
		      .duration(100)
		      .style("opacity", 0);
		  })

	var rows = table.append('tbody').selectAll('tr')
       .data(last5).enter()
       .append('tr');
	rows.selectAll('td')
		.data(function (d) {
		return titles.map(function (k) {
			return { 'value': d[k], 'name': k};
		});
	}).enter()
	.append('td')
	.attr('data-th', function (d) {
		return d.name;
	})
	.text(function (d) {
		return d.name == "xA" ? (d3.format(".2f"))(d.value) : d.name == "xG" ? (d3.format(".2f"))(d.value) : d.value;
	});
}

// FOOTBALL PITCH TEAM SELECTION
// Call update functions bsaed on callbacks 
function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

if (window.location.href.includes("user_id")) {
	// If redirected with selection
	all_uniq_trans = []
	bank_number = 0
	tot_pts = 0
	let redirect_options = getUrlVars()["user_id"]
	update_players(redirect_options)
} else {
	//default
	all_uniq_trans = []
	bank_number = 0
	tot_pts = 0
	update_players(3370907)
}

// $("#team_id_button").on("click",function(){
// 	all_uniq_trans = []
// 	bank_number = 0
// 	tot_pts = 0
// 	// let redirect_options = getUrlVars()["user_id"].split("=")
// 	// console.log(getUrlVars()["user_id"])
// 	// console.log(getUrlVars()["user_id"])
// 	update_players($("#team_id").val())
// })

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
	$("#pitch").empty()

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

	var svg = d3.select("#pitch").append("svg")
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

	var target = document.getElementById("pitch");
	var spinner = new Spinner(opts).spin(target);

	d3.json("https://peaceful-harbor-25221.herokuapp.com/https://fantasy.premierleague.com/api/bootstrap-static/", function(error, player_data) {
    	if (error) throw error;

    	gw = player_data.events.filter(d=>{return d.is_current == true})[0].id
    	gw_next = player_data.events.filter(d=>{return d.is_next == true})[0].id
    	
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
				        $("#transfer_cost")[0].innerHTML = String(0)
				        element_color("transfer_cost",$("#transfer_cost")[0].innerHTML,"transfers")

				        
						if (transfer_data.filter(d=>{return d.event == gw}).length == 0 && data.active_chip != "freehit" && data.active_chip != "wildcard") {
							// freet.text(2)
							$("#free_transfers")[0].innerHTML = String(2)
							free_trans = 2
						} if (transfer_data.filter(d=>{return d.event == gw}).length >= 1) {
							// freet.text(1)
							$("#free_transfers")[0].innerHTML = String(1)
							free_trans = 1
						} if (data.active_chip == "freehit") {
							// freet.text(1)
							$("#free_transfers")[0].innerHTML = String(1)
							free_trans = 1
						} if (data.active_chip == "wildcard") {
							// freet.text(1)
						$("#free_transfers")[0].innerHTML = String(1)
							free_trans = 1
						}

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

						for (let i=0; i < data.picks.length; i++){
							elements.push(data.picks[i].element)
							var img_code = user_data.filter(d=> {return d.id == data.picks[i].element})[0].code
							var position_name = user_data.filter(d=> {return d.id == data.picks[i].element})[0].position
							var name = user_data.filter(d=> {return d.id == data.picks[i].element})[0].name
							var ch_play = user_data.filter(d=> {return d.id == data.picks[i].element})[0].chance_of_playing_next_round
							var price_now = user_data.filter(d=> {return d.id == data.picks[i].element})[0].value
							
							if(transfer_data.filter(d=> {return d.element_in == data.picks[i].element}).length == 0) {
								price_purchase = gw1_prices.filter(d=> {return d.element == data.picks[i].element})[0].value/10
								// price_purchase = 1.0
							} else {
								price_purchase = transfer_data.filter(d=> {return d.element_in == data.picks[i].element})[0].element_in_cost/10
							}
							
							var team = user_data.filter(d=> {return d.id == data.picks[i].element})[0].team
							team_name = player_data.teams.filter(d => {return d.id == team})[0].short_name

							var url = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${img_code}.png`
							
							var next_gw_fixtures = fixtures.filter(d=>{return d.event == gw_next})
							
							var next_fix_full = fixtures.filter(d=>{return d.team_h == team || d.team_a == team})
							
							var live_points = player_data.elements.filter(d=> {return d.id == data.picks[i].element})[0].event_points

							tot_pts += live_points * data.picks[i].multiplier

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

							images_load.push({"player_id":data.picks[i].element,"position":data.picks[i].position,"position_name":position_name,"url":url,"name":name,"ch_play":ch_play == null ? 100 : ch_play,"value":price_now, "value_purchase":price_purchase,"team":team_name,"opponent_all":opp_all,"total_points":live_points})
						}
						
						$("#gw_points")[0].innerHTML = String(tot_pts)
						
				        gkp = images_load.filter(d => {return d.position_name =="GKP"})
				        def = images_load.filter(d => {return d.position_name =="DEF"})
				        mid = images_load.filter(d => {return d.position_name =="MID"})
				        fwd = images_load.filter(d => {return d.position_name =="FWD"})
				        
				        player_order = [gkp,def,mid,fwd]
				        formation_images_load = []
				        
						m = 1
						for (let j=0; j<player_order.length;j++){
						  	for (let i=0; i < player_order[j].length; i++) {
						    	formation_images_load.push({"player_id":player_order[j][i].player_id,"position":m,"position_name":player_order[j][i].position_name,"url":player_order[j][i].url,"name":player_order[j][i].name,"ch_play":player_order[j][i].ch_play,"value":player_order[j][i].value,"value_purchase":player_order[j][i].value_purchase,"team":player_order[j][i].team,"opponent_all":player_order[j][i].opponent_all,"total_points":player_order[j][i].total_points})

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

				        var player_info = pitchElement.append("g")
				          	.attr("class","player_info")

				        var player_name = pitchElement.append("g")
				          	.attr("class","player_name")

				        var fixtures = pitchElement.append("g")
				          	.attr("class","fixtures_pitch")

				        
				        
				        // console.log(missing_players)

						remove_player.selectAll("image")
							.data(playerPositions)
							.enter()
							.append("image")
								.attr("id",function(d){return `position_${d.pos}_remove`})
								.attr("xlink:href", "/data/img/times-solid.svg")
								.attr("x", function(d){
									return scale(d.x + 4);
								})
								.attr("y", function(d){
									return scale(d.y - 10);
								})
								.style("margin-right","20px")
								.attr("width", 15)
								.attr("height", 15)
								.attr("text-anchor","middle")
								.on("mouseover", function(d) {
									d3.select(this).style("cursor", "pointer")
								})                  
								.on("mouseout", function(d) {
									d3.select(this).style("cursor", "default")
								})
								.on("click",function(d){
									bank_number += Number(d3.select(`#value_${d.pos}`).text())
									$("#bank")[0].innerHTML = String((d3.format(".1f"))(bank_number))
									element_color("bank",bank_number,"bank")


									d3.select(`#position_${d.pos}_pick`).remove()
									d3.select(`#rect_${d.pos}`).remove()
									d3.select(`#value_${d.pos}`).remove()
									d3.select(`#name_${d.pos}`).remove()
									d3.select(`#fix_${d.pos}`).remove()

									my_picks_team = my_picks_team.filter(i =>{return i.position != d.pos})

									// console.log(my_picks_team)

									missing_players.push(d)
									// console.log(d)

									missing_players.forEach(m => { unique_positions_missing.push(m.pos)})
									unique_positions_missing = unique_positions_missing.filter(onlyUnique)
									// console.log(unique_positions_missing)

									for (let i=0; i < unique_positions_missing.length; i++){
										if (all_uniq_trans.includes(unique_positions_missing[i])) {
											// all_uniq_trans = all_uniq_trans.filter(d=>{return d != unique_positions_missing[i]})
											// console.log(unique_positions_missing[i])
										} else {
											all_uniq_trans.push(unique_positions_missing[i])
											// console.log(all_uniq_trans)
										}
									}

									// console.log(all_uniq_trans)

									tot_trans = free_trans - all_uniq_trans.length
									tot_trans > 0 ? $("#free_transfers")[0].innerHTML = String(tot_trans) : $("#free_transfers")[0].innerHTML = String(0)
									tot_trans < 0 ? $("#transfer_cost")[0].innerHTML = String(tot_trans * 4) : $("#transfer_cost")[0].innerHTML = String(0)

									element_color("transfer_cost",$("#transfer_cost")[0].innerHTML,"transfers")

									formation_images_load = formation_images_load.filter(i=>{return i.position != d.pos})
								});

				        // full_table(player_data,player_picks,playersContainer,formation_images_load,player_info,player_name)
				        
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

						player_info.selectAll("text")
							.data(playerPositions)
							.enter().append("text")
								.attr("id",function(d){return `value_${d.pos}`})
								.attr("x", function(d){
									return scale(d.x);
								})
								.attr("y", function(d){
									return scale(d.y+5);
								})
								.style("text-anchor", "middle")
								.style("font-size", 10)
								.text(function(d){ 
									purch_val = formation_images_load.filter(i =>{return i.position == d.pos})[0].value_purchase
									curr_val = formation_images_load.filter(i =>{return i.position == d.pos})[0].value
									diff = (curr_val - purch_val)*0.5
									return diff == 0 ? (d3.format(".1f"))(curr_val) : (d3.format(".1f"))(floor10((curr_val - diff),-1))
								});

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
									fix_load = formation_images_load.filter(i =>{return i.position == d.pos})[0].opponent_all
									fix_load = fix_load.filter(j=>{return j.gw==gw_next})
									fix_load.length == 2 ? output = `${fix_load[0].opponent} ${fix_load[1].opponent}` : fix_load.length == 0 ? output = "(blank)": output = `${fix_load[0].opponent}`
									return output
								})
								.call(wrap, 50);
						$("#gw_planner")[0].innerHTML = String(gw_next)

						$("#previous_gw")
							.on("click",() => {
								(gw_next - 1) < gw ? gw_next : gw_next-=1
						      	
						      	fixtures.selectAll("text").remove()

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
											fix_load = formation_images_load.filter(i =>{return i.position == d.pos})[0].opponent_all
											fix_load = fix_load.filter(j=>{return j.gw==gw_next})
											fix_load.length == 2 ? output = `${fix_load[0].opponent} ${fix_load[1].opponent}` : fix_load.length == 0 ? output = "(blank)": output = `${fix_load[0].opponent}`
											return output
										})
										.call(wrap, 50);

									$("#gw_planner")[0].innerHTML = String(gw_next)
						    })
						$("#next_gw")
							.on("click",() => {
								(gw_next + 1) > 38 ? gw_next : gw_next+=1
						      	// gw_next+=1
						      	fixtures.selectAll("text").remove()

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
										fix_load = formation_images_load.filter(i =>{return i.position == d.pos})[0].opponent_all
										fix_load = fix_load.filter(j=>{return j.gw==gw_next})
										fix_load.length == 2 ? output = `${fix_load[0].opponent} ${fix_load[1].opponent}` : fix_load.length == 0 ? output = "(blank)": output = `${fix_load[0].opponent}`
										return output
									})
									.call(wrap, 50);
									$("#gw_planner")[0].innerHTML = String(gw_next)
						    })
			            
			            var filterable_keys_raw = ["cost_change_start", "dreamteam_count", "event_points", "form", "now_cost", "points_per_game",
						"selected_by_percent", "total_points", "transfers_in", "transfers_in_event", "transfers_out", "transfers_out_event", 
						"value_form", "value_season","minutes", "goals_scored", "assists", "clean_sheets", "goals_conceded", "own_goals", 
						"penalties_saved", "penalties_missed", "yellow_cards", "red_cards", "saves", "bonus", "bps", "influence", "creativity",
						"threat", "ict_index", "influence_rank", "creativity_rank", "threat_rank",  "ict_index_rank"]

						var var_explanation = {"cost_change_start":"Cost change from season start", "dreamteam_count":"Number of times in dreamteam",
						"event_points":"Round points", "form":"Form", "now_cost":"Value", "points_per_game":"Points per game",
						"selected_by_percent":"Selected by %", "total_points":"Total points", "transfers_in":"Transfers in", "transfers_in_event":"Transfers in round",
						"transfers_out":"Transfers out", "transfers_out_event":"Transfers out round", "value_form":"Value form", "value_season":"Value season",
						"minutes":"Minutes", "goals_scored":"Goals", "assists":"Assists", "clean_sheets":"Clean sheets", "goals_conceded":"Goals conceded",
						"own_goals":"Own goals", "penalties_saved":"Penalties saved", "penalties_missed":"Penalties missed", "yellow_cards":"Yellow cards",
						"red_cards":"Red cards", "saves":"Saves", "bonus":"Bonus", "bps":"BPS", "influence":"Influence", "creativity":"Creativity",
						"threat":"Threat", "ict_index":"ICT Index", "influence_rank":"Influence rank", "creativity_rank":"Creativity rank", "threat_rank":"Threat rank",
						"ict_index_rank":"ICT Index rank"}

						filterable_keys_raw.sort(function(a, b) {
						    var textA = a.toUpperCase();
						    var textB = b.toUpperCase();
						    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
						});

						filterable_keys = filterable_keys_raw.map(d=>{return var_explanation[d]})
						
						// console.log(var_explanation["dreamte"])

						var elements_search = ""
						for(i= 0; i < filterable_keys.length; i++){
						    filterable_keys[i] == "Value" ? elements_search += "<option selected value='"+ filterable_keys_raw[i] + "'>" + filterable_keys[i] + "</option>" : elements_search += "<option value='"+ filterable_keys_raw[i] + "'>" + filterable_keys[i] + "</option>";
						}

						document.getElementById("select-stat-player-table").innerHTML = elements_search;
						// var gw = player_data.events.filter(d=>{return d.is_current == true})[0].id
						// var gw_next = player_data.events.filter(d=>{return d.is_next == true})[0].id

					    full_table_2(player_data,player_picks,player_info,player_name,playersContainer, fixtures,scale,images_load)
			            
			            $("#select-stat-player-table").on("change",function(){
							full_table_2(player_data,player_picks,player_info,player_name,playersContainer, fixtures,scale,images_load)
							// update_players($("#team_id").val())
						})

			            $("#bank")[0].innerHTML = String((d3.format(".1f"))(bank_number))
			            element_color("bank",bank_number,"bank")

			        spinner.stop();
		            })
		      	})
		    })
	  	})
	})
};

function replaceSpecialChars(str){
    str = str.replace(/[ÀÁÂÃÄÅÆĀ]/,"A");
    str = str.replace(/[àáâãäåæā]/,"a");
    str = str.replace(/[ÈÉÊËèéêëēėę]/,"E");
    str = str.replace(/[ÇĆČ]/,"C");
    str = str.replace(/[çčč]/,"c");
    str = str.replace(/[ûüùúūÛÜÙÚŪ]/,"u");
    str = str.replace(/[ôöòóœøōõÔÖÒÓŒØŌÕ]/,"o");
    str = str.replace(/[ÿŸ]/,"y");
    str = str.replace(/[îïíīįìÎÏÍĪĮÌ]/,"i");
    str = str.replace(/[ßśšŚŠ]/,"s");
    str = str.replace(/[žźżŽŹŻ]/,"z");
    str = str.replace(/[ñńÑŃ]/,"n");

    // o resto

    return str.replace(/[^a-z0-9]/gi,''); 
}

function myFunction() {
	// Declare variables
	var input, filter, table, tr, td, i, txtValue;
	input = document.getElementById("search_player");
	filter = input.value.toUpperCase();
	table = document.getElementById("select-player-table");
	tr = table.getElementsByTagName("tr");
	search = $("#search-select").val()
	search == "name" ? val = 0 : search == "position" ? val = 1 : val = 2;

	// Loop through all table rows, and hide those who don't match the search query
	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[val];
		if (td) {
  			txtValue = td.textContent || td.innerText;
		  	if (replaceSpecialChars(txtValue).toUpperCase().indexOf(filter) > -1) {
		    	tr[i].style.display = "";
		  	} else {
		    	tr[i].style.display = "none";
		  	}
		}
	}
}

function full_table_2 (data,player_picks,player_info,player_name,playersContainer, fixtures,scale,images_load) {

	d3.select("#select-player-table").select("table").remove();

	insert_stat = $("#select-stat-player-table").val()
	d3.json("https://peaceful-harbor-25221.herokuapp.com/https://fantasy.premierleague.com/api/fixtures/", function(error, fixtures_data) {
		if (error) throw error;
	    
	    to_load_table = []
	    for (let i=0; i<data.elements.length; i++){
			data.elements[i].element_type == 1 ? position = "GKP" : data.elements[i].element_type == 2 ? position = "DEF" : data.elements[i].element_type == 3 ? position = "MID":position = "FWD"
			insert_stat.includes("cost") ? ins = data.elements[i][insert_stat]/10 : ins = data.elements[i][insert_stat];

			var next_gw_fixtures = fixtures_data.filter(d=>{return d.event == gw_next})
			var team = data.elements.filter(d=> {return d.id == data.elements[i].id})[0].team
			team_name = data.teams.filter(d => {return d.id == team})[0].short_name
			var pfixts = next_gw_fixtures.filter(d=>{return d.team_h == team || d.team_a == team})
			// console.log(pfixts)
			var next_fix_full = fixtures_data.filter(d=>{return d.team_h == team || d.team_a == team})
							
			var opp_all = []
			if(next_fix_full.length == 0){
				opp_all.push("(blank)")
			} else {
				for (j=0;j<next_fix_full.length;j++){
					if (next_fix_full[j].team_h == team){
						opp_name = data.teams.filter(d => {return d.id == next_fix_full[j].team_a})[0].short_name
						opp_all.push({"opponent":`${opp_name} (H)`,"gw":next_fix_full[j].event})
					} else {
						opp_name = data.teams.filter(d => {return d.id == next_fix_full[j].team_h})[0].short_name
						opp_all.push({"opponent":`${opp_name} (A)`,"gw":next_fix_full[j].event})
					}
				}
			}

			to_load_table.push({"id":data.elements[i].id, "name": data.elements[i].web_name, "value":ins, "add":data.elements[i].code,"ch_play": data.elements[i].chance_of_playing_next_round == null ? 100 : data.elements[i].chance_of_playing_next_round, "price":data.elements[i].now_cost,"position":position,"team":data.teams.filter(d=>{ return d.id == data.elements[i].team})[0].short_name,"news":data.elements[i].news,"opponent":opp_all})
	    }

		var sortAscending = false;
		// var table = d3.select("#select-player-table").append('table');
		// var titles_pl = d3.keys(data[0]);
		var table = d3.select("#select-player-table").append('table');
		titles = ["name","position", "team","value","news"]

		var headers = table.append('thead').append('tr')
			.attr("class","sticky-header")
				.selectAll('th')
			.data(titles).enter()
			.append('th')
			.text(function (d) {
				return d;})
			.on('click', function (d) {
				headers.attr('class', 'header');

				if (sortAscending) {
		   			rows.sort(function(a, b) { 
			   		return d3.ascending(b[d],a[d])});
			   		
			   		sortAscending = false;
			   		this.className = 'aes';
				} else {
					rows.sort(function(a, b) { return d3.descending(b[d],a[d]) });
					sortAscending = true;
					this.className = 'des';
				}
			});

		headers.attr("id","select_table_header")

		var rows = table.append('tbody').selectAll('tr')
			.data(to_load_table).enter()
			.append('tr')
			.attr("class","select_table_rows");

		rows.selectAll('td')
			.data(function (d) {
				return titles.map(function (k) {
					return { 'value': d[k], 'name': k};
				});
			}).enter()
				.append('td')
				.attr('data-th', function (d) {
					return d.name;
				})
				.text(function (d) {
					if (d.name == "value") {
						if (insert_stat=="selected_by_percent"){
							return_value = (d3.format(",.1%"))(d.value/100)
						} else if (insert_stat=="now_cost"){
							return_value = `£${(d3.format(",.1f"))(d.value)}`
						} else if (insert_stat=="cost_change_start"){
							return_value = (d3.format(",.1f"))(d.value)
						} else {
							return_value = (d3.format(",d"))(d.value)
						}
					} else {
						return_value = d.value
					}
					
					return return_value;
				})
		if(insert_stat.includes("rank")){
			rows.sort(function(a, b) { return d3.ascending(Number(a["value"]),Number(b["value"])) });
		} else {
			rows.sort(function(a, b) { return d3.ascending(Number(b["value"]),Number(a["value"])) });
		}
		

		var clickable_table = d3.select("#select-player-table").select("tbody").selectAll("tr");
			            
        clickable_table
        	.on('click.tooltip_actions', function(d) {
			    tooltip_actions.transition()
					.duration(300)
					.style("opacity", 1)
					.style("position","absolute")
					.style("pointer-events", "auto");
			    tooltip_actions.html(
			    	`<button type="button" id="closeplayer" style="float:right;">X</button>
			    	<br>
			    	<button type="button" id="add_to_team">Add to my team.</button><br>
				    <button type="button" id="add_p1">Add for comparison (p1).</button><br>
				    <button type="button" id="add_p2">Add for comparison (p2).</button><br>`)
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 120) + "px");

			    d3.select("#add_to_team").on("click",function() {
				    tooltip_actions.transition()
				    	.duration(100)
				      	.style("opacity", 0)
				      	.style("pointer-events", "none")
				    
				    var attrs = missing_players[0]

				    if (attrs.posn == d.position){
						// console.log(my_picks_team.filter(t=>{return t.team == d.team}))
						max_team = my_picks_team.filter(t=>{return t.team == d.team})
						in_team_now = formation_images_load.filter(i =>{return i.player_id == d.id})
						
						if (in_team_now.length == 1) {
							$("#error-message").empty()
							$("#error-message")[0].innerHTML = `You already have ${in_team_now[0].name} in your team`
							$( "#error-message" ).dialog({
					          height: 100,
					          width: window.innerWidth/1.5,
					          modal: true
					        });
					       $("#error-message").show()
						} else {
							if (max_team.length >= 3){
								$("#error-message").empty()
								$("#error-message")[0].innerHTML = `You already have 3 players from ${d.team}`
								$( "#error-message" ).dialog({
						          height: 100,
						          width: window.innerWidth/1.5,
						          modal: true
						        });
						       $("#error-message").show()
							} else {
								player_picks.append("image")
					                .attr("id",`position_${attrs.pos}_pick`)
					                // .attr("xlink:href", https://resources.premierleague.com/premierleague/photos/players/110x140/p192895.png")
					                .attr("xlink:href", `https://resources.premierleague.com/premierleague/photos/players/110x140/p${d.add}.png`)
					                .attr("x",scale(attrs.x - 6))
					                .attr("y",scale(attrs.y - 10))
					                .attr("width", 60)
					                .attr("height", 60)
					                .attr("text-anchor","middle");

								player_info.append("text")
									.attr("id",`value_${attrs.pos}`)
									.attr("x", scale(attrs.x))
									.attr("y", scale(attrs.y + 5))
									.style("text-anchor", "middle")
									.style("font-size", 10)
									.text(function(){ 
										in_team = images_load.filter(i =>{return i.player_id == d.id})
										if(in_team.length > 0){
											purch_val = in_team[0].value_purchase
											curr_val = d.price/10
											diff = (curr_val - purch_val)*0.5
											bank_number -= floor10((curr_val - diff),-1)
											$("#bank")[0].innerHTML = String((d3.format(".1f"))(bank_number))
											element_color("bank",bank_number,"bank")

											// tot_trans += 1
											if (all_uniq_trans.includes(attrs.pos)) {
							              		all_uniq_trans = all_uniq_trans.filter(d=>{return d != attrs.pos})

							              	} else {
							              		// all_uniq_trans.push(unique_positions_missing[i])
							              		// console.log(all_uniq_trans)
							              	}
											// free_trans += unique_positions_missing.length
											tot_trans = free_trans - all_uniq_trans.length
											tot_trans > 0 ? $("#free_transfers")[0].innerHTML = String(tot_trans) : $("#free_transfers")[0].innerHTML = String(0)
											tot_trans < 0 ? $("#transfer_cost")[0].innerHTML = String(tot_trans * 4) : $("#transfer_cost")[0].innerHTML = String(0)
											element_color("transfer_cost",$("#transfer_cost")[0].innerHTML,"transfers")
											

											return diff == 0 ? (d3.format(".1f"))(curr_val) : (d3.format(".1f"))(floor10((curr_val - diff),-1))
										} else {
											bank_number -= d.price/10
											$("#bank")[0].innerHTML = String(bank_number.toFixed(1))
											element_color("bank",bank_number,"bank")

											// if (all_uniq_trans.includes(attrs.pos)) {
							              		
							    //           	} else {
							    //           		// all_uniq_trans.push(unique_positions_missing[i])
							    //           		// console.log(all_uniq_trans)
							    //           	}
							              	tot_trans = free_trans - all_uniq_trans.length
											tot_trans > 0 ? $("#free_transfers")[0].innerHTML = String(tot_trans) : $("#free_transfers")[0].innerHTML = String(0)
											tot_trans < 0 ? $("#transfer_cost")[0].innerHTML = String(tot_trans * 4) : $("#transfer_cost")[0].innerHTML = String(0)
											element_color("transfer_cost",$("#transfer_cost")[0].innerHTML,"transfers")
											
											return d.price/10
										}
									})

					            player_name.append("text")
									.attr("id",`name_${attrs.pos}`)
									.attr("x", scale(attrs.x))
									.attr("y", scale(attrs.y + 8))
									.style("text-anchor", "middle")
									.style("font-size", 10)
									.text(d.name)

					            playersContainer.append("rect")
									.attr("id",`rect_${attrs.pos}`)
									.attr("x", scale(attrs.x - 6))
									.attr("y", scale(attrs.y + 3))
									.attr("width", 60)
									.attr("height", 60)
									.attr("rx", 6)
									.attr("ry", 6)
									.attr("fill", d.ch_play > 75 ? "#0FA121" : d.ch_play > 50 ? "#E29019" : "#E33939")

								
								fixtures.append("text")
									.attr("id",function(d){return `fix_${attrs.pos}`})
									.attr("x", scale(attrs.x))
									.attr("y", scale(attrs.y+11))
									.style("text-anchor", "middle")
									.style("font-size", 10)
									.text(function (){
										output = d.opponent.filter(i=>{return i.gw == gw_next})
										return output.length == 2 ? `${output[0].opponent} ${output[1].opponent}` : output.length == 0 ? "(blank)"  :  output[0].opponent})
									.call(wrap, 50);
									
				              	unique_positions_missing = unique_positions_missing.filter(r=>{return r != missing_players[0].pos}).filter(onlyUnique)	              	

				              	my_picks_team.push({"player_id":d.id,"team":d.team,"position":attrs.pos})

				              	missing_players = missing_players.filter(f=>{return f.pos != attrs.pos})		
				              	
				              	image_url = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${d.add}.png`
				              	formation_images_load.push({"player_id":d.id,"position":attrs.pos,"position_name":d.position,"url":image_url,"name":d.name,"ch_play":d.ch_play,"value":d.value,"value_purchase":d.value,"team":d.team,"opponent_all":d.opponent})

				              	formation_images_load.sort((a, b) => (a.position > b.position) ? 1 : -1)
							}
						}
						
						
		              	
					} else {
						$("#error-message").empty()
						$("#error-message")[0].innerHTML = `You are trying to select a player at position ${d.position}! Please select a player at position ${missing_players[0].posn}!`
						$( "#error-message" ).dialog({
				          height: 100,
				          width: window.innerWidth/1.5,
				          modal: true
				        });
				       $("#error-message").show()
					}
			   	})
				d3.select("#add_p1").on("click",function() {
					// window.location="#player1"
				    // d3.select("#comparison_div").selectAll("table").remove()
				    // $("#comparison_div").empty()
				    tooltip_actions.transition()
				    	.duration(100)
				      	.style("opacity", 0)
				      	.style("pointer-events", "none")
				    $("#player1").val(d.id);
					$('#player1').trigger('change');
					
				})

				d3.select("#add_p2").on("click",function() {
				    // window.location="#player2"
				    tooltip_actions.transition()
				    	.duration(100)
				      	.style("opacity", 0)
				      	.style("pointer-events", "none")
				    $("#player2").val(d.id);
					$('#player2').trigger('change');

				})

				d3.select("button#closeplayer").on("click",function() {
					// d3.select("#comparison_div").selectAll("table").remove()

				    tooltip_actions.transition()
				      .duration(100)
				      .style("opacity", 0)
				      .style("pointer-events", "none");
				  })	
			})
	})
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

d3.json("https://peaceful-harbor-25221.herokuapp.com/https://fantasy.premierleague.com/api/bootstrap-static/", function(error, full_data) {
	if (error) throw error;
	d3.json("https://peaceful-harbor-25221.herokuapp.com/https://fantasy.premierleague.com/api/fixtures/", function(error, data) {
	    if (error) throw error;

	    var gw = full_data.events.filter(d=>{return d.is_next == true})[0].id
	    
	    update_fixtures(gw,full_data,data)

	    $("#previous")
	    	.on("click",() => {
	          gw-=1
	          update_fixtures(gw,full_data,data)
	        })
	    $("#next")
	    	.on("click",() => {
	          	gw+=1
	          	update_fixtures(gw,full_data,data)
	        })


	})
})

function update_fixtures(gw,full_data,data) {
	d3.select("#next_gw_fixtures").select("svg").remove();

	var team_data = full_data.teams
	var current_gw_deadline = full_data.events.filter(d=> {return d.id == gw})[0].deadline_time
    var current_gw_data = data.filter(d=>{return d.event == gw})

    current_fixtures = []

    for (i=0;i<current_gw_data.length;i++){
    	team_h_name = team_data.filter(d=>{return d.id == current_gw_data[i].team_h})[0].name
    	// console.log(team_h_name)
    	team_h_code = team_data.filter(d=>{return d.id == current_gw_data[i].team_h})[0].code
    	team_h_url = `https://fantasy.premierleague.com/dist/img/badges/badge_${team_h_code}_80.png`
    	team_a_name = team_data.filter(d=>{return d.id == current_gw_data[i].team_a})[0].name
    	team_a_code = team_data.filter(d=>{return d.id == current_gw_data[i].team_a})[0].code
    	team_a_url = `https://fantasy.premierleague.com/dist/img/badges/badge_${team_a_code}_80.png`

    	score = []
    	if (current_gw_data[i].team_h_score == null || current_gw_data[i].team_a_score == null){
    		score.push({"status":"to_play","score":current_gw_data[i].kickoff_time})
    	} else {
    		score.push({"status":"finished", "score":`${current_gw_data[i].team_h_score} - ${current_gw_data[i].team_a_score}`})
    	}

    	current_fixtures.push({"team_h_name":team_h_name,"team_h_img":team_h_url,"team_a_name":team_a_name,"team_a_img":team_a_url,"score":score})	
    }

	var margin_gw = { top_gw: 10, right_gw: 10, bottom_gw: 10, left_gw: 10 };

    current_fixtures.length <= 10 ? h = 400 : current_fixtures.length <= 15 ? h = 500 : h = 600;

    var width_gw = 250 - margin_gw.left_gw - margin_gw.right_gw,
        height_gw = h - margin_gw.top_gw - margin_gw.bottom_gw;

	var svg_gw = d3.select("#next_gw_fixtures")
		.append("svg")
			.attr("width", width_gw + margin_gw.left_gw + margin_gw.right_gw)
			.attr("height", height_gw + margin_gw.top_gw + margin_gw.bottom_gw)
		.append("g")
			// .attr("id","results_fixtures")
			.attr("transform", "translate(" + margin_gw.left_gw + "," + margin_gw.top_gw + ")");


    var title = svg_gw.append("text").attr("class", "fixtures_title")
    	.attr("x", (width_gw-10)/2)
		.attr("y", 10)
		.attr("text-anchor", "middle")
		.style("font-size","15px")
		.style("font-weight","bold")
		.text(function(d) {
	      	if (current_fixtures[0].score[0].status=="finished"){
	      		return "Results"
	      	} else {
				return "Fixtures"
	      	}
		});

	var gameweek = svg_gw.append("text").attr("class", "gameweek")
    	.attr("x", (width_gw-10)/2)
		.attr("y", 35)
		.attr("text-anchor", "middle")
		.style("font-size","10px")
		.text(`Gameweek ${gw}`);

	var gameweek_deadline = svg_gw.append("text").attr("class", "gameweek_deadline")
    	.attr("x", (width_gw-10)/2)
		.attr("y", 50)
		.attr("text-anchor", "middle")
		.style("font-size","10px")
		.text(function(){
			var date = new Date(current_gw_deadline);
      		date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes()==0 ? "00" : date.getMinutes());
			return `Deadline: ${date}`
		});

    var h_team_img = svg_gw.append("g").attr("class", "team_h_img");

    let step = 30

	let y_h_img = 50
	let y_a_img = 50
	let y_h_name = 61
	let y_a_name = 61
	let score_y_r = 60
	let score_y_f = 46

    h_team_img.selectAll("image")
		.data(current_fixtures)
		.enter()
			.append("image")
			.attr("class", "home_team_img")
			.attr("xlink:href", function(d){return d.team_h_img})
			.attr("x", (width_gw-10)/2 - 50)
			.attr("y", function(d){ 
				y_h_img+=step 
				return y_h_img})
			.attr("width", 15)
			.attr("height", 15)
			// .attr("text-anchor", "start")
			.style("font-size","10px");

	var a_team_img = svg_gw.append("g").attr("class", "team_a_img");
	
	a_team_img.selectAll("image")
		.data(current_fixtures)
		.enter()
			.append("image")
			.attr("class", "away_team_img")
			.attr("xlink:href", function(d){return d.team_a_img})
			.attr("x", (width_gw-10)/2 + 40)
			.attr("y", function(d){ 
				y_a_img+=step 
				return y_a_img})
			.attr("width", 15)
			.attr("height", 15)
			// .attr("text-anchor", "end")
			.style("font-size","10px");

	var h_team = svg_gw.append("g").attr("class", "team_h_name");

	
    h_team.selectAll("text")
		.data(current_fixtures)
		.enter()
			.append("text")
			.attr("class", "home_team")
			.attr("x", (width_gw-10)/2 - 60)
			.attr("y", function(d){ 
				y_h_name+=step 
				return y_h_name})
			.attr("text-anchor", "end")
			.style("font-size","10px")
			.text(function(d) {return d.team_h_name});

	// var h_team = svg_gw.append("g").attr("class", "team_h_name");
	var a_team = svg_gw.append("g").attr("class", "team_a_name");
	
    a_team.selectAll("text")
		.data(current_fixtures)
		.enter()
			.append("text")
			.attr("class", "home_team")
			.attr("x", (width_gw-10)/2 + 60)
			.attr("y", function(d){ 
				y_a_name+=step 
				return y_a_name})
			.attr("text-anchor", "start")
			.style("font-size","10px")
			.text(function(d) {return d.team_a_name});

	
	var game_score = svg_gw.append("g").attr("class", "score");
	
    game_score.selectAll("text")
		.data(current_fixtures)
		.enter()
			.append("text")
			.attr("class", "score_teams")
			.attr("x", (width_gw-10)/2)
			.attr("y", function(d){
				if (d.score[0].status=="finished"){
					score_y_r+=step
					score_y_f+=step
				return score_y_r
				} else {
					score_y_r+=step
					score_y_f+=step 
				return score_y_f
				}
			})
			.attr("text-anchor", "middle")
			.style("font-size","10px")
			.text(function(d) {
				
				if (d.score[0].status=="finished"){
					output = d.score[0].score
				} else {
					var date = new Date(d.score[0].score);
					output = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes()==0 ? "00" : date.getMinutes());
				}
				return output
			})
			.call(wrap, 30);
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