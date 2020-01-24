// *********
// VARIABLES
// *********
var room = [
	{ id:1, top:5, left:8, next_room_left:17, next_room_middle:8, next_room_right:18 },
	{ id:2, top:1, left:15, next_room_left:3, next_room_middle:10, next_room_right:5 },
	{ id:3, top:12, left:15, next_room_left:4, next_room_middle:11, next_room_right:2 },
	{ id:4, top:12, left:1, next_room_left:5, next_room_middle:15, next_room_right:3 },
	{ id:5, top:1, left:1, next_room_left:2, next_room_middle:6, next_room_right:4 },
	{ id:6, top:4, left:3, next_room_left:15, next_room_middle:5, next_room_right:7 },
	{ id:7, top:2, left:5, next_room_left:8, next_room_middle:17, next_room_right:6 },
	{ id:8, top:2, left:8, next_room_left:9, next_room_middle:1, next_room_right:7 },
	{ id:9, top:2, left:11, next_room_left:10, next_room_middle:18, next_room_right:8 },
	{ id:10, top:4, left:13, next_room_left:9, next_room_middle:2, next_room_right:11 },
	{ id:11, top:9, left:13, next_room_left:3, next_room_middle:12, next_room_right:10 },
	{ id:12, top:11, left:11, next_room_left:13, next_room_middle:19, next_room_right:11 },
	{ id:13, top:11, left:8, next_room_left:14, next_room_middle:20, next_room_right:12 },
	{ id:14, top:11, left:5, next_room_left:15, next_room_middle:16, next_room_right:13 },
	{ id:15, top:9, left:3, next_room_left:14, next_room_middle:4, next_room_right:6 },
	{ id:16, top:8, left:5, next_room_left:17, next_room_middle:20, next_room_right:14 },
	{ id:17, top:5, left:5, next_room_left:7, next_room_middle:1, next_room_right:16 },
	{ id:18, top:5, left:11, next_room_left:19, next_room_middle:1, next_room_right:9 },
	{ id:19, top:8, left:11, next_room_left:12, next_room_middle:20, next_room_right:18 },
	{ id:20, top:8, left:8, next_room_left:19, next_room_middle:13, next_room_right:16 }
];
var player = {name:'', location:0, rooms:0, arrows:3};
var bat = [{location:0}, {location:0}];
var pit = [{location:0}, {location:0}];
var zombie = {location:0, rooms: getNextRooms(0)};
var krampus = {location:0, rooms: getNextRooms(0)};
var screen_width = getScreenWidth($(window).width());
var grid_unit = screen_width / 17;
var initial_rooms = tempRooms(20);
var player_action = '';
var action_room = '';
var current_message = '';
var new_message = '';
var soundWalk = '';
// *********
// FUNCTIONS
// *********
//
// GLOBAL FUNCTIONS
function shuffle(array) {
  var m = array.length, t, i;
  // WHILE THERE REMAIN ELEMENTS TO SHUFFLE
  while (m) {
    // PICK A REMAINING ELEMENT
    i = Math.floor(Math.random() * m--);
    // AND SWAP IT WITH THE CURRENT ELEMENT
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}
function getScreenWidth(window_width) {
	if (window_width >= 768) {
		return 375;
	} else {
		return window_width;
	}
}
function randomRoom() {
	return Math.floor((Math.random() * 20) + 1);
}
function whereIsEveryone() {
	console.log('Krampus — ' + krampus.location);
	console.log('Zombie — ' + zombie.location);
	console.log('Bat 01 — ' + bat[0].location);
	console.log('Bat 02 — ' + bat[1].location);
	console.log('Pit 01 — ' + pit[0].location);
	console.log('Pit 02 — ' + pit[1].location);
	console.log('Player — ' + player.location);	
}
function showMessage(message) {
	if (current_message !== '') {
		$('#' + current_message).remove();
	}
	d = new Date();
	tmp_msg_id = d.getFullYear() + '' + d.getMonth() + '' + d.getDay() + '' + d.getHours() + '' + d.getMinutes() + '' + d.getSeconds() + '' + d.getMilliseconds();
	tmp_message = '<div class="message animated" id="' + tmp_msg_id + '">' + message + '</div>';
	$('.messages').append(tmp_message);
	$('#' + tmp_msg_id).addClass('fadeInDown');
	current_message = tmp_msg_id;
	new_message = '';
}
//
// INIT FUNCTIONS
function createSounds() {
	soundCave = new Howl({
	  src: ['assets/sound/Ambience_Cave_00.mp3'],
	  loop: true,
	  onload: function() {
		soundCave.play();
	  }
	});
	soundWalk = new Howl({
	  src: ['assets/sound/Walk_Gravel.mp3']
	});
	soundShoot = new Howl({
	  src: ['assets/sound/Arrow_Swoosh.mp3']
	});
}
function tempRooms(total) {
	var tmp_rooms = [];
	for (i = 1; i <= total; i++) {
		tmp_rooms.push(i);
	}
	tmp_rooms = shuffle(tmp_rooms);
	return tmp_rooms;
}
function createRooms() {
	for (x in room) {
		tmp_id = room[x].id;
		tmp_top = grid_unit * room[x].top;
		tmp_left = grid_unit * room[x].left;
		$('.map').append('<div class="room" data-id="' + x + '" data-num="' + tmp_id + '" data-top="' + tmp_top + '" data-left="' + tmp_left + '" style="top:' + tmp_top + 'px;left:' + tmp_left + 'px;"></div>');
	} 
}
function createMonsters() {
	krampus.location = initial_rooms.pop();
	krampus.rooms = getNextRooms(krampus.location);
	zombie.location = initial_rooms.pop();
	zombie.rooms = getNextRooms(zombie.location);
	bat[0].location = shuffle(initial_rooms).pop();
	bat[1].location = shuffle(initial_rooms).pop();
	pit[0].location = shuffle(initial_rooms).pop();
	pit[1].location = shuffle(initial_rooms).pop();
}
function createPlayer() {
	player.location = shuffle(initial_rooms).pop();
	player.rooms = getNextRooms(player.location);
	$('#action-left').html(player.rooms[0]);
	$('#action-middle').html(player.rooms[1]);
	$('#action-right').html(player.rooms[2]);
	$('#arrows').html(player.arrows);
	tmp_position = $('[data-num="' + player.location + '"]').position();
	$('.map').prepend('<div class="player animated" style="top:' + tmp_position.top + 'px;left:' + tmp_position.left + 'px;">P</div>');
}
//
// GAME FUNCTIONS
function getNextRooms(room_number) {
	var new_rooms = [];
	if (room_number !== 0) {
		room_id = room_number - 1;
		new_rooms = [room[room_id].next_room_left, room[room_id].next_room_middle, room[room_id].next_room_right];
	} else {
		new_rooms = [0,0,0];
	}
	return new_rooms;
}
function moveWumpus() {
	tmp_rooms = krampus.rooms;
	new_room = tmp_rooms[Math.floor((Math.random() * 3))];
	krampus.location = new_room;
	krampus.rooms = getNextRooms(krampus.location);
	if (player.location == krampus.location) {
		new_message = new_message + '<p>...and the Krampus eats you!!!</p>';
		changePlayerStatus('lose');
	}
}
function moveZombie() {
	if (Math.floor((Math.random() * 3) + 1) == 1) {
		new_message = new_message + '<p>...and the Zombie moves.</p>';
		tmp_rooms = zombie.rooms;
		new_room = tmp_rooms[Math.floor((Math.random() * 3))];
		zombie.location = new_room;
		zombie.rooms = getNextRooms(zombie.location);
		if (player.location == zombie.location) {
			new_message = new_message + '<p>...and forces you to run!!!</p>';
			player.rooms = getNextRooms(player.location);
			setTimeout(function(){ movePlayer(player.rooms[Math.floor((Math.random() * 3))]); }, 4000);
		}
	}
}
function checkCurrentRoom() {	
	bats_are_awake = 0;
	woke_bat = 0;
	if (player.location == bat[0].location) {
		bats_are_awake = 1;
		woke_bat = 0;
	} else if (player.location == bat[1].location) {
		bats_are_awake = 1;	
		woke_bat = 1;	
	}
	if (player.location == krampus.location) {
		new_message = '<p>You ran into the Krampus and you Die!</p>';
		$('.player').addClass('heartBeat');
		showMessage(new_message);
		changePlayerStatus('lose');
		return 0;
	}
	if (player.location == pit[0].location || player.location == pit[1].location) {
		new_message = '<p>You fell into a Bottomless Pit and you die!</p>';
		$('.player').addClass('heartBeat');
		showMessage(new_message);
		changePlayerStatus('lose');
		return 0;
	}
	if (bats_are_awake == 1) {
		new_message = '<p>You woke some Bats and are carried to another room!</p>';
		$('.player').addClass('heartBeat');
		showMessage(new_message);
		movePlayer(0, 'fly');
		//  LEAVING THIS HERE TO CONSIDER MOVEMENT OF BATS
		// setTimeout(function(){ bat[woke_bat].location = randomRoom(); }, 4000);
		return 0;
	}
	if (player.location == zombie.location) {
		new_message = '<p>You run into the Zombie and are forced to run!!!</p>';
		$('.player').addClass('heartBeat');
		showMessage(new_message);
		player.rooms = getNextRooms(player.location);
		tmp_next_room = player.rooms[Math.floor((Math.random() * 3))];
		movePlayer(tmp_next_room, 'walk');
		return 0;
	}
	return 1;
}
function checkNextRooms() {
	nothing_there = 1;
	for (i = 0; i < player.rooms.length; i++) {
		if (player.rooms[i] == bat[0].location || player.rooms[i] == bat[1].location) {
			new_message = new_message + '<p>You hear wings rustling.</p>';
			nothing_there = 0;
		}
		if (player.rooms[i] == pit[0].location || player.rooms[i] == pit[1].location) {
			new_message = new_message + '<p>You feel a draft.</p>';
			nothing_there = 0;
		}
		if (player.rooms[i] == zombie.location) {
			new_message = new_message + '<p>You hear feet shuffling.</p>';
			nothing_there = 0;
		}
		if (player.rooms[i] == krampus.location) {
			new_message = new_message + '<p>You smell something terrible.</p>';
			nothing_there = 0;
		}
	}
	if (nothing_there == 1) {
		new_message = '<p>All is quiet...</p>';
	}
}
//
// PLAYER FUNCTIONS
function changePlayerStatus(status) {
	$('[data-num="' + player.rooms[0] + '"]').removeClass('potential');
	$('[data-num="' + player.rooms[1] + '"]').removeClass('potential');
	$('[data-num="' + player.rooms[2] + '"]').removeClass('potential');
	$('[data-num="' + player.location + '"]').removeClass('active');
	$('[data-num]').removeClass('selected');
	if (status == 'win') {
		$('[data-num="' + player.location + '"]').addClass('win');
	} else if (status == 'lose') {
		$('[data-num="' + player.location + '"]').addClass('dead');
	}
}
function setRoomClicks() {
	$('body').off('click', '[data-num="' + player.rooms[0] + '"]').on('click', '[data-num="' + player.rooms[0] + '"]', function() {
		doPlayerAction(player.rooms[0]);
	});
	$('body').off('click', '[data-num="' + player.rooms[1] + '"]').on('click', '[data-num="' + player.rooms[1] + '"]', function() {
		doPlayerAction(player.rooms[1]);
	});
	$('body').off('click', '[data-num="' + player.rooms[2] + '"]').on('click', '[data-num="' + player.rooms[2] + '"]', function() {
		doPlayerAction(player.rooms[2]);
	});
}
function setPlayerAction(action) {
	player_action = action;
	$('[data-num="' + player.rooms[0] + '"]').addClass('potential');
	$('[data-num="' + player.rooms[1] + '"]').addClass('potential');
	$('[data-num="' + player.rooms[2] + '"]').addClass('potential');
	$('.controls').addClass('fadeOut');
	$('.controls').css('z-index', -1);
}
function doPlayerAction(room) {
	if (player_action == 'move') {
		movePlayer(room, 'walk');
	} else {
		shootArrow(room);
	}	
}
function resetActions() {
	$('.player').removeClass('heartBeat');
	$('.controls').removeClass('fadeOut');
	$('.controls').addClass('fadeIn');
	$('.controls').css('z-index', 101);
}
function movePlayer(location, sound) {
	changePlayerStatus('move');
	if (location == 0) {
		player.location = randomRoom();
	} else {
		player.location = location;
	}
	if (sound == 'walk') {
		soundWalk.play();
	}
	$('.player').css('top', $('[data-num="' + player.location + '"]').data('top'));
	$('.player').css('left', $('[data-num="' + player.location + '"]').data('left'));
	setTimeout(function() {
		$('[data-num="' + player.location + '"]').addClass('active');
		if (checkCurrentRoom() !== 0) {
			player.rooms = getNextRooms(player.location);
			checkNextRooms();
			moveZombie();
			showMessage(new_message);
			resetActions();
		}
	}, 1000);
}
function shootArrow(location) {
	soundShoot.play();
	if (location == krampus.location) {
		new_message = '<p>You killed the Krampus!</p>';
		changePlayerStatus('win');
	} else {
		new_message = '<p>You woke the Krampus and he moves!</p>';
		moveWumpus();
	}
	player.arrows--;	
	$('#arrows').html(player.arrows);
	if (player.arrows <= 0) {
		new_message = '<p>Your out of arrows and you die!</p>';
		changePlayerStatus('lose');
	}
	showMessage(new_message);
	if (location !== krampus.location && player.arrows > 0) {
		resetActions();
	}
}
//
// CLICK ACTIONS
$('#action-move').click(function() {
	setPlayerAction('move');
	setRoomClicks();
});
$('#action-shoot').click(function() {
	setPlayerAction('shoot');
	setRoomClicks();
});
// INIT GAME
function initGame() {
	createSounds();
	createRooms();
	createMonsters();
	createPlayer();
	$('.room').addClass('enlarge');
	$('[data-num="' + player.location + '"]').addClass('active');
	checkNextRooms();
	resetActions();
	showMessage(new_message);
}
$(function() {
	initGame();
});