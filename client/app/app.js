var App = (function() {
	var SOCKET_ADDRESS = 'http://localhost:8080';
	//var SOCKET_ADDRESS = 'http://45.32.236.82:8080';
	var channel;
	var socket;
	var onMessage = function(message) {
        if(event.data[0] == "{"){
        var sentObject = JSON.parse(event.data);
 	if(sentObject["set"] != undefined){	
  window[sentObject.tag + sentObject["set"][0]] = sentObject["set"][1];
                }
  	if(sentObject["setMore"] != undefined){
	var multiSet = sentObject["setMore"];
           multiSet.forEach(function(entry, index){
  window[sentObject.tag + multiSet[index][0]] = multiSet[index][1];
					}); 	
                }
  	if(sentObject["setStats"] != undefined){
	var statsSet = sentObject["setStats"];
	if(Array.isArray(statsSet[0])){
           statsSet.forEach(function(entry, index){
  window[sentObject.tag][statsSet[index][0]] = statsSet[index][1];
					}); 	
          }else{
  window[sentObject.tag][statsSet[0]] = statsSet[1];
	}
	}
 		if(sentObject["remotePlayer"] != undefined){
			 var remoteUserInfo = sentObject["remotePlayer"];
				setRemotePlayer(remoteUserInfo[0], remoteUserInfo[1], remoteUserInfo[2]);
                }
		}
/*
		if(event.data[0] == "{"){
			var sentObject = JSON.parse(event.data);
				window.alert(sentObject["set"]);
				window[sentObject["set"][0]] = sentObject["set"][1];
				
		}
*/
		if(event.data == "down"){
		mouseDown = true;
		}else if(event.data == "up"){
		mouseDown = false;
		}else{
                $('#channelIn')[0].value += event.data;
		}
        }
	var showUserMessage = function(message) {
		$('#message').html(message);
	}
	var onChannelOpen = function() {
		$('#channelWrapper').show();
		$('#handshake').hide();
		showUserMessage('Connection successful!');
	}
	var initializeRTC = function() {
		channel = new Peeer({
			onMessage: onMessage,
			onChannelOpen: onChannelOpen,
			onCandidate: function(candidate) {
				socket.emit('rtcMessage', {
					type:'candidate',
					data: candidate
				});
			}
		});
		console.log(channel);
		console.log("RTC initialized");
	}
	var startRTC = function() {
		channel.initialize(function(offer) {
			console.log(offer);
			socket.emit('rtcMessage', {
				type:'offer',
				data: offer
			});
		});
	}
	var handleOffer = function(offer) {
		console.log('offer', offer);
		var description = new RTCSessionDescription(offer);
		initializeRTC();
		channel.offer(description, function(answer) {
			console.log(answer);
			socket.emit('rtcMessage', {
				type:'answer',
				data: answer
			});
		});
	}
	var handleAnswer = function(answer) {
		console.log('answer', answer);
		var answer = new RTCSessionDescription(answer);
		channel.answer(answer);
	}
	var handleCandidate = function(candidate) {
		console.log('candidate', candidate);
		var candidate = new RTCIceCandidate(candidate);
		channel.addCandidate(candidate);
	}
	var App = {
		initialize: function() {
			socket = io.connect(SOCKET_ADDRESS);
			socket.on('error', function() {
				showUserMessage("Error connecting to the handshake server");
			});
			socket.on('connect', function() {
				showUserMessage("Socket server connected");
				socket.emit('getKey');
			});
			socket.on('disconnect', function() {
				showUserMessage("Socket server disconnected");
			});
			socket.on('key', function(data) {
				$('#thiskey').html(data.key);
			});
			socket.on('msg', function(data) {
				showUserMessage(data.message);
			});
			socket.on('gotPeer', function(data) {
				showUserMessage("got peer:" + data.key);
				initializeRTC();
				startRTC();
			});
			
			socket.on('rtcMessage', function(message) {
				console.log(message.type);
				switch(message.type) {
					case "offer":
						handleOffer(message.data);
						break;
					case "answer":
						handleAnswer(message.data);
						break;
					case "candidate":
						handleCandidate(message.data);
						break;
				}
			});

			$('#buttonGetKey').click(function() {
				socket.emit('getKey');
			});
			$('#buttonSendKey').click(function() {
				var key = $('#key').val();
				socket.emit('setKey', {key: key});
			});
			$('#channelSend').click(function() {
				var message = $('#channelOut').val();
				$('#channelOut').val('');
				channel.send(message);
			});
 document.getElementById("setPlayer").addEventListener("click", function(){
    channel.send('{"remotePlayer": ["'+ document.getElementById("username").value + '", ' + document.getElementById("startX").value + ', ' + document.getElementById("startY").value + ']}');
});
		sendObj = function tagSend(obj){
                                obj.tag = localUser.tag;
                                var message = JSON.stringify(obj); 
                                channel.send(message); 
                } 
				

                function mouseDownHandlersend() { 
                     mouseDown = true; 
			if(channel){
			channel.send("down");
			}
                } 
                function mouseUpHandlersend(){ 
                      mouseDown = false; 
			if(channel){
			channel.send("up");
			}
                } 
                document.addEventListener("mousedown", mouseDownHandlersend, false); 
                document.addEventListener("mouseup", mouseUpHandlersend, false); 
			$('#channelWrapper').hide();
			
		}
	}
	return App;
})();

$(function() {
	App.initialize();
});
