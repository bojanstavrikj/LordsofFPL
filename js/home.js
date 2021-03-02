	var margin = {top: 100, right: 100, bottom: 100, left: 100},
		width = Math.min(500, window.innerWidth - 10) - margin.left - margin.right,
		height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

	d3.csv("/data/timestamp.txt", function(error, data) {
		if (error) throw error;
		console.log(data)

		$("#timestamp")[0].innerHTML = data.columns[0] + ", " + data.columns[1]
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
	});
	
    // Initialize the tooltip for the network
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
	// var expand_p1 = d3.select("#p1-expand")
	// 	.on('mouseover.tooltip', function(d) {
	// 		tooltip.transition()
	// 		  .duration(300)
	// 		  .style("opacity", 1);
	// 		tooltip.html("Click to see full data!")
	// 		  .style("left", (d3.event.pageX) + "px")
	// 		  .style("top", (d3.event.pageY + 10) + "px");
	// 	})
	// 	.on("mouseout.tooltip", function() {
	// 		tooltip.transition()
	// 		  .duration(100)
	// 		  .style("opacity", 0);
	// 	})
	// var expand_2 = d3.select("#p2-expand")
	// 	.on('mouseover.tooltip', function(d) {
	// 		tooltip.transition()
	// 		  .duration(300)
	// 		  .style("opacity", 1);
	// 		tooltip.html("Click to see full data!")
	// 		  .style("left", (d3.event.pageX) + "px")
	// 		  .style("top", (d3.event.pageY + 10) + "px");
	// 	})
	// 	.on("mouseout.tooltip", function() {
	// 		tooltip.transition()
	// 		  .duration(100)
	// 		  .style("opacity", 0);
	// 	})

	$(document).ready(function(){
	  // Initialize select2
	  $("#player1").select2();
	  $("#player2").select2();
	  $("#stat").select2();
	});
	$(function() {
	   $("#info1").on("click", function(){ 
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
	       $( "#p2-full-table" ).dialog({
	          height: window.innerHeight-100,
	          width: window.innerWidth/2,
	          modal: true
	        });
	       $("#p2-full-table").show();
	    });
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
	   'xA', 'key_passes', 'npg', 'npxG','xGChain', 'xGBuildup']

	// load_stats(features,features1)
	
	

    function load_stats (features,pos) {
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

		document.getElementById("stat-select").innerHTML = elements_stat;
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

		document.getElementById("player1").innerHTML = elementsp1;
		document.getElementById("player2").innerHTML = elementsp2;

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
		});

		console.log(data)

		to_fill = `${data.filter(d => {return d.element == $("#player1").val()})[0].position_short} ${data.filter(d => {return d.element == $("#player2").val()})[0].position_short}`
		console.log(to_fill)
		load_stats(features,to_fill)
		
		update(data)

	    $("#player1")
	        .on("change", function(){
	        	to_fill = `${data.filter(d => {return d.element == $("#player1").val()})[0].position_short} ${data.filter(d => {return d.element == $("#player2").val()})[0].position_short}`
	        	load_stats(features,to_fill)
	          	update(data)
	        })

		$("#player2")
	        .on("change", () => {
	          to_fill = `${data.filter(d => {return d.element == $("#player1").val()})[0].position_short} ${data.filter(d => {return d.element == $("#player2").val()})[0].position_short}`
        	  load_stats(features,to_fill)
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
	

		// $('input[name=check]').change(function() {
		//   if ($(this).is(':checked')) {
		//   	update(data,"not-checked")
		//     console.log("Checkbox is checked..")
		//   } else {
		//   	update(data,"checked")
		//     console.log("Checkbox is not checked..")
		//   }
		// });
	});

// var p1_pastgames = d3.select("#p1-past-games")	
// 	.append("svg")
// 	.attr("width", 200)
// 	.attr("height", 20)
// 	.append("g")

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
		document.getElementById("info1").style.color = "green";
	} if (filtered_p1[0].chance_playing_nx == 75) {
		document.getElementById("info1").style.color = "yellow";
	} if (filtered_p1[0].chance_playing_nx == 50) {
		document.getElementById("info1").style.color = "orange";
	} if (filtered_p1[0].chance_playing_nx < 50) {
		document.getElementById("info1").style.color = "red";
	}
	
	if (filtered_p2[0].chance_playing_nx == 100) {
		document.getElementById("info2").style.color = "green";
	} if (filtered_p2[0].chance_playing_nx == 75) {
		document.getElementById("info2").style.color = "yellow";
	} if (filtered_p2[0].chance_playing_nx == 50) {
		document.getElementById("info2").style.color = "orange";
	} if (filtered_p2[0].chance_playing_nx < 50) {
		document.getElementById("info2").style.color = "red";
	}

	document.getElementById("pl1").src=`https://resources.premierleague.com/premierleague/photos/players/110x140/p${filtered_p1[0].code}.png`;
    document.getElementById("pl2").src=`https://resources.premierleague.com/premierleague/photos/players/110x140/p${filtered_p2[0].code}.png`;
    
    features = ['total_points', 'minutes','goals_scored', 'assists', 'clean_sheets', 'goals_conceded',
       'own_goals', 'penalties_saved', 'penalties_missed', 'yellow_cards','red_cards', 'saves',
       'bonus', 'bps', 'influence', 'creativity','threat', 'ict_index','shots', 'xG', 'time', 
       'xA', 'key_passes', 'npg', 'npxG','xGChain', 'xGBuildup']

    var total_p1 = []
    var total_p2 = []
    tot_varsp1 = []
    tot_varsp2 = []
    for (var i=0; i<features.length; i++) {
    	tot_varsp1.push(`p1Tot${features[i]}`)
    	tot_varsp2.push(`p2Tot${features[i]}`)
    	window["p1Tot" + features[i]] = filtered_p1.reduce((total, obj) => obj[features[i]] + total,0);
    	window["p2Tot" + features[i]] = filtered_p2.reduce((total, obj) => obj[features[i]] + total,0);
    	total_p1.push({'axis':`${features[i]}`, 'value':Nan_rep(eval(tot_varsp1[i])/(eval(tot_varsp1[i])+eval(tot_varsp2[i]))), "actual": `<strong>${$('#player1 option:selected').text().split(" ")[0]}</strong> <br><strong>${features[i]}:</strong> ${(d3.format(".2f"))(eval(tot_varsp1[i]))}`,"player":0,"real":eval(tot_varsp1[i])}) 
    	total_p2.push({'axis':`${features[i]}`, 'value':Nan_rep(eval(tot_varsp2[i])/(eval(tot_varsp1[i])+eval(tot_varsp2[i]))), "actual":`<strong>${$('#player2 option:selected').text().split(" ")[0]}</strong> <br><strong>${features[i]}:</strong> ${(d3.format(".2f"))(eval(tot_varsp2[i]))}`,"player":1,"real":eval(tot_varsp2[i])})
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
    	total_p1_pgs.push({'axis':`${features[i]}`, 'value':Nan_rep((eval(tot_varsp1[i])/p1_pgs.length)/(eval(tot_varsp1[i])/p1_pgs.length+eval(tot_varsp2[i])/p2_pgs.length)), "actual":`<strong>${$('#player1 option:selected').text().split(" ")[0]}</strong> <br><strong>${features[i]} per game started:</strong> ${(d3.format(".2f"))(eval(tot_varsp1[i])/p1_pgs.length)}`,"player":0, "real": eval(tot_varsp1[i])/p1_pgs.length})
    	total_p2_pgs.push({'axis':`${features[i]}`, 'value':Nan_rep((eval(tot_varsp2[i])/p2_pgs.length)/(eval(tot_varsp1[i])/p1_pgs.length+eval(tot_varsp2[i])/p2_pgs.length)), "actual":`<strong>${$('#player2 option:selected').text().split(" ")[0]}</strong> <br><strong>${features[i]} per game started:</strong> ${(d3.format(".2f"))(eval(tot_varsp2[i])/p2_pgs.length)}`,"player":1, "real":eval(tot_varsp2[i])/p2_pgs.length})
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
    	total_p1_90.push({'axis':`${features[i]}`, 'value':Nan_rep((eval(tot_varsp1[i])/90)/(eval(tot_varsp1[i])/90+eval(tot_varsp2[i])/90)), "actual":`<strong>${$('#player1 option:selected').text().split(" ")[0]}</strong> <br><strong>${features[i]} per 90min:</strong> ${(d3.format(".2f"))(eval(tot_varsp1[i])/90)}`,"player":0,"real":eval(tot_varsp1[i])/90})
    	total_p2_90.push({'axis':`${features[i]}`, 'value':Nan_rep((eval(tot_varsp2[i])/90)/(eval(tot_varsp1[i])/90+eval(tot_varsp2[i])/90)), "actual":`<strong>${$('#player2 option:selected').text().split(" ")[0]}</strong> <br><strong>${features[i]} per 90min:</strong> ${(d3.format(".2f"))(eval(tot_varsp2[i])/90)}`,"player":1,"real":eval(tot_varsp2[i])/90})
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
    	'xGBuildup':26
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
	

    d3.selectAll("table").remove()
   
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

		insert_fixture_table (fixtures_p1, current_p1,"#fixturesp1")
		insert_fixture_table (fixtures_p2, current_p2,"#fixturesp2")

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

		})
	})
}

function popup_full_table (data,id) {
	  var table_pl = d3.select(id).append('table').attr("class","table_pl");;
	  // var titles_pl = d3.keys(data[0]);
	  
	  titles_pl = ["round", "team", "opponent", "was_home","team_h_score", "team_a_score","minutes","total_points", 
	  "shots", "xG", "xA", "key_passes", "npg", "npxG", "xGChain", "xGBuildup",
	  "goals_scored", "assists", "clean_sheets","goals_conceded", "own_goals", "penalties_saved",
	  "penalties_missed", "yellow_cards", "red_cards", "saves", "bonus", "bps", "influence", 
	  "creativity", "threat", "ict_index", "value", "transfers_balance", 
	  "selected", "transfers_in", "transfers_out", "selected_by_percent", "corners_and_indirect_freekicks_order", 
	  "direct_freekicks_order", "penalties_order", "chance_playing_tr", "chance_playing_nx"
	  ]

	  var headers_pl = table_pl.append('thead').append('tr')
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

function insert_fixture_table (data, current,id) {
	console.log(data)
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
	next_gws = next_gws.slice(0,5)
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


