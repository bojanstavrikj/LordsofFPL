d3.json("https://peaceful-harbor-25221.herokuapp.com/https://fantasy.premierleague.com/api/bootstrap-static/", function(error, data) {
	if (error) throw error;

	console.log(data["events"])

	var current_gw_data = data["events"].filter(d=>{return d.is_current == true})

	var player_data =  data.elements

	//GAMEWEEK
	document.getElementById("gameweek").innerHTML= `${current_gw_data[0].name}`;

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

	document.getElementById("most_captained_value").innerHTML= `${player_data.filter(d=>{ return d.id == current_gw_data[0].most_captained})[0].event_points} pts`;
	document.getElementById("most_selected_value").innerHTML= `${player_data.filter(d=>{ return d.id == current_gw_data[0].most_selected})[0].event_points} pts`;
	document.getElementById("most_transferred_in_value").innerHTML= `${player_data.filter(d=>{ return d.id == current_gw_data[0].most_transferred_in})[0].event_points} pts`;
	document.getElementById("most_vicecaptained_value").innerHTML= `${player_data.filter(d=>{ return d.id == current_gw_data[0].most_vice_captained})[0].event_points} pts`;
	document.getElementById("top_scorrer_value").innerHTML= `${player_data.filter(d=>{ return d.id == current_gw_data[0].top_element})[0].event_points} pts`;


	document.getElementById("average_score").innerHTML= `${current_gw_data[0].average_entry_score}`;
	document.getElementById("highest_score").innerHTML= `${current_gw_data[0].highest_score}`;
	document.getElementById("transfers_made").innerHTML= `${(d3.format(",d"))(current_gw_data[0].transfers_made)}`;

	

	document.getElementById("highest_score").onclick = function () {
	    window.location.href = "index.html?user_id="+current_gw_data[0].highest_scoring_entry+"";
	};

	console.log(current_gw_data[0])
	console.log(player_data.filter(d=>{ return d.id == current_gw_data[0].most_captained})[0])

})