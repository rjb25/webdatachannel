//discover the word, make invisible bullet bariers
//*******CURSOR NOT MATCHIGN VIEWPORT
//TODO 
//decide how you want to do different shots (entire new class, or just options?)
//if they differ in methods, they must be different class.maybe?I could just pass the method different things depending on what we want it to do, or nothign at all.
//same data, health speed, x,y different methods, fireOnspace or fireNearPlayer
//diff data though because health and speed are different things
//for a new gun all I need to do is make a different fire method that calls shot constructor with different parameters
//pass it the shooting function to assign?
// make canvas have a range option to move to player, will need an update method
//simply call trackStop on view instance
//testing123
								var iterationTime = 30;
                //canvas
var localUser = null;
var userx = 100;
var usery = 100;
var remoteuser = null;
var remoteuserX = 100;
var remoteuserX = 100;
                var players = [];
		var views = [];
		var cursors = [];
		var cursor = null;
function setLocalPlayer(){
		localUsername = document.getElementById("username").value;
		userX = parseInt(document.getElementById("startX").value);
		userY = parseInt(document.getElementById("startY").value);
                localUser = window[localUsername] = new Player(localUsername, userX, userY, 20, 20, 15, 1500);
		players.push(localUser);
		view = new View(100);
		views = [view];
		cursor = new Cursor();
		cursors = [cursor];
}
function setRemotePlayer(remoteUsername, x, y){
                remoteUser = window[remoteUsername] = new Player(remoteUsername, x, y, 20, 20, 15, 1500);
		players.push(remoteUser);
}

                var canvas = document.getElementById("myCanvas");
                var ctx = canvas.getContext("2d");
                //mouse
								var mouseDown = false;
                //keyboard
                var upPressed = false;
                var downPressed = false;
                var leftPressed = false;
                var rightPressed = false;
                //viewport
//I really need to stop this madness...
                //rectangles
                var rectangle = new Rectangle(50, 50, 30, 30, "red");
                var rectangle2 = new Rectangle(100, 50, 30, 30, "green");
                var rectangle3 = new Rectangle(300, 50, 30, 30, "orange");
                var rectangle4 = new Rectangle(50, 200, 30, 30, "yellow");
                var rectangles = [rectangle, rectangle2, rectangle3, rectangle4];
//order is important!!!!!! some are defined based on others
								//cursor
//make these the same class, like person, fighter? making classes in javascript is werid. You could have one class and just pass it different things to make entirely different objects with different methods

//basically difference between player and spitter is xy update and team also wouldnt have to look through whole array to find the one to update. or you could make a function that contains the one you found so you no longer search? I am getting so confused with classes
                //player
//on local side set user movement to username as tag for wasd

                //spitters
/*
                var spitter = new Spitter(40, 40, 40, 40);
*/
                var spitters = [];
								//maybe make it so that it check if it is an array? avoid this silly stuff
                //playershots
                var circleShots = [];
                //anything that has methods constantly invoked
//movement order matters for viewport versus player
                var instances = [views, rectangles, spitters, players, circleShots, cursors];
								//*******METHODS*********
//death methods
                function healthDie(containingArray) { return function(){
													if(this.health < 1){
															containingArray.splice(containingArray.indexOf(this), 1);
												}
										};
                }
								//CircleShot.prototype.isAlive = function(){distanceDie(this, circleShots);};
                function distanceDie(that){ 
									if(getDistance(that.startX, that.startY, that.x,that.y) > that.range){	
											that.storage.splice(that.storage.indexOf(that), 1);
										}
								}

                function timeDie(that){
									if(that.durationSeconds <0 ){	
											that.storage.splice(that.storage.indexOf(that), 1);
										}else{
											that.durationSeconds -= iterationTime/1000;
										}
                
									}
//fix this shitstorm******
//COLLISION methods
//work on making this better
function willBeOn(that, hitting){
//dangerous
//maybe make variables like futureX futureY
//possible problem with "still" things having a dx and dy so they hit things that move by where they would be if they could move
//in that case though just set something?
if("radius" in that && "radius" in hitting){
			if(getDistance(that.x+(that.dx||0), that.y+(that.dy ||0) , hitting.x+(hitting.dx || 0), hitting.y +(hitting.dy||0)) < (that.radius+ hitting.radius)){
return true;
}else{
return false;}
}else 
if("radius" in that && "width" in hitting){
																if (that.x + that.dx < hitting.x + (hitting.dx || 0) + (hitting.width/2) + that.radius  && that.x + that.dx > hitting.x + (hitting.dx || 0) - (hitting.width/2) - that.radius  && that.whose !== hitting && that.y + that.dy < hitting.y + (hitting.dy || 0) + (hitting.height/2) + that.radius  && that.y + that.dy > hitting.y -(hitting.height/2)- that.radius) {

return true;
}else{
return false;}
}else
//TODO make these work if I ever use square ammo
if("width" in that && "radius" in hitting){
				if(getDistance((that.x+that.dx), (that.y+that.dy), hitting.x, hitting.y) < 100){
return true;
}else{
return false;}
}else

//could use this collision for viewport
if("width" in that && "width" in hitting){
				if(Math.abs((that.x+(that.dx || 0)) - (hitting.x+(hitting.dx || 0))) < (hitting.width + that.width)/2 && Math.abs((that.y+(that.dy || 0)) - (hitting.y+(hitting.dy || 0)))  < (that.height + hitting.height)/2){
return true;
}else{
return false;}
}
}

function stopOnSolid(damage) {return function(){
	var hitCount =0;
	for (var j = 0; j < instances.length; j++) {
						if(instances[j].length >0){
//WARNING if you have changing solid state of objects it might not be recognized
														if (instances[j][0].solid == true) {
															for (var i = 0; i < instances[j].length; i++) {
																//checking will hit
																if(willBeOn(this, instances[j][i]) && this.whose !== instances[j][i]){
																	hitCount++;}}}}}
if(hitCount>0){
		this.still = true;
}
}}
function notifyOnSolid() {return function(){
	for (var j = 0; j < instances.length; j++) {
						if(instances[j].length >0){
//WARNING if you have changing solid state of objects it might not be recognized
														if (instances[j][0].solid == true) {
															for (var i = 0; i < instances[j].length; i++) {
																//checking will hit
																if(this !== instances[j][i]){
																if(willBeOn(this, instances[j][i]) && this.whose !== instances[j][i]){
																	console.log("touching");}}}}}}};
}
//draw methods
                var drawRectangle = function() {

                    if (this.x < view.maxX && this.x > view.minX - this.width && this.y < view.maxY && this.y > view.minY - this.height) {
//                    if (this.x < view.maxX && this.x > view.minX - this.width && this.y < view.maxY && this.y > view.minY - this.height) {
                        ctx.beginPath();
//look into why thses are not drawn at a minus width and heigt, be consistent
//123
                        ctx.rect(getCanvasX(this.x)-(this.width/2), getCanvasY(this.y)-(this.height/2), this.width, /*canvas....*/ this.height);
                        ctx.fillStyle = this.color || "purple";
                        ctx.fill();
                        ctx.closePath();
                    }
                }
/*
								var drawObject = function(){
															if(this.radius){}else{
                        ctx.beginPath();
//look into why thses are not drawn at a minus width and heigt, be consistent
//123
                        ctx.rect(getCanvas("x", this), getCanvas("y", this), 20, 20);
                        ctx.fillStyle = this.color || "purple";
                        ctx.fill();
                        ctx.closePath();
maube more confusion than good
						}
}
*/

                var drawSprite = function() {
                    if (this.x < view.maxX && this.x > view.minX - this.width && this.y < view.maxY && this.y > view.minY - this.height) {
                        ctx.beginPath();
                    		drawing = new Image();
                    		drawing.src = this.src;
                    		ctx.drawImage(drawing, getCanvasX(this.x) - (this.width/2), getCanvasY(this.y)-(this.height/2), this.width, this.height);
                        //ctx.drawImage(drawing, getCanvasX(this.x), getCanvasY(this.y), this.width, /*canvas....*/ -this.height);
                        ctx.closePath();
                    }
                }
                var drawCircle = function() {
                    if (this.x < view.maxX + this.radius && this.x > view.minX - this.radius && this.y < view.maxY + this.radius && this.y > view.minY - this.radius) {
                        ctx.beginPath();
                        ctx.arc(getCanvasX(this.x), getCanvasY(this.y), this.radius, 0, Math.PI * 2);
                        ctx.fillStyle = this.color || "red";
                        ctx.fill();
                        ctx.closePath();
                    }
                };
//firing methods
								function fireMouseDown(shotType, shotArray) { return function(){
									if(window[this.tag +"mouseDown"]){
                    shotArray.push(new shotType(this));
mouseDown = false;
									}
                };}
								function fireAlways(shotType, shotArray) { return function(){
									if(true){
                    shotArray.push(new shotType(this));
									}
                };}
//warp methods
								function degreeWarp(amount){
										return function(){
											this.angle+=correctForInterval(amount);
										}
								}
//update methods
//avoid the bounceing back and forth when they want to go somewhere?? myabe its somewhat realistic
								function angleToDxDy(){	
										return function(){
                    this.radians = this.angle * (Math.PI / 180);
                    this.dx = (this.speed * Math.cos(this.radians));
                    this.dy = (this.speed * Math.sin(this.radians));
										}
								}
							var maxMin= function(){
								this.maxX = this.x + canvas.width/2;
								this.maxY = this.y + canvas.height/2;
								this.minX = this.x - canvas.width/2;
								this.minY = this.y - canvas.height/2;
							}	

//tracking methods
							
function trackNearObject(that, to, bounceRange){
			if( getDistance(that.x, that.y, to.x, to.y) >(bounceRange||100)){
								setDxDyToObject(that, to);
}}	
function trackStopNearObject(that, to, range){
			if( getDistance(that.x, that.y, to.x, to.y) >(range||100)){
								setDxDyToObject(that, to);
}else{
that.still = true;}
}	
//maybe update have contant cursor tracking
function setDxDyToObject(that, to){
//fix cursor draw loaction so it uses 
//took out getGameBla here
                    that.differenceY = to.y - that.y;
                    that.differenceX = to.x - that.x;
                    that.angle = (Math.atan2(that.differenceY, that.differenceX)) * (180 / Math.PI);
                    that.radians = that.angle * (Math.PI / 180);
                    that.dx = (that.speed * Math.cos(that.radians));
                    that.dy = (that.speed * Math.sin(that.radians));
}

//move methods
//EVENT direction methods
//possible error if not passed a tag
//TODO
function handleWASD(that)
{ return    function(){
		if(this.tag == undefined || this.tag == localUsername){ 
			tag = "";
		} else{ 
			tag = this.tag;
		}
									countX = 0;
									countY = 0;
//the or Does not work
                    if (window[tag+"rightPressed"]==true) {
                        this.dx = (that.speed || this.speed);
												countX++;
                    }
                    if (window[tag+"upPressed"]==true) {
                        this.dy = (that.speed || this.speed);
												countY++;
                    }

                    if (window[tag+"leftPressed"]==true) {
                        this.dx = -(that.speed || this.speed);
												countX++;
                    }
                    if (window[tag+"downPressed"]==true) {
                        this.dy = -(that.speed || this.speed);
												countY++;
                    }
										if(countY ==0 ||countY ==2){
											this.dy = 0;
										}
										if(countX ==0 ||countX ==2){
											this.dx = 0;
										}
										if(countX ==1 && countY ==1){
												this.dy = (((that.dy||this.dy)/(Math.abs(that.dy||this.dy)))||0) * (Math.sqrt(Math.pow((that.speed || this.speed), 2)/2));
												this.dx = (((that.dx||this.dx)/(Math.abs(that.dx||this.dx)))||0) * (Math.sqrt(Math.pow((that.speed || this.speed), 2)/2));
}
};}
/*
                function move() {
                            if ("dx" in this) {
                                this.x += instances[j][i].dx;
                                this.y += instances[j][i].dy;
                            }
                        }
I might regret having to put that method in every class as it is likely to be the same
*/
                //END METHODS HERE
								//***********VIEWPORT CLASS************
						function View(playerFollowRange){
                this.x = localUser.x;
                this.y = localUser.y;
		this.tag = localUser.tag;
								this.maxX = this.x + canvas.width/2;
								this.maxY = this.y + canvas.height/2;
								this.minX = this.x - canvas.width/2;
								this.minY = this.y - canvas.height/2;
								this.dx = 0;
			this.dy = 0;
			this.eventDirection = handleWASD(this);
							}	

								View.prototype.update = maxMin;
					
								
								//END VIEWPORT HERE
                //**************PLAYER CLASS************
                function Player(tag, x, y, width, height, speed, health, color) {
                    this.width = width;
										this.solid = true;
                    this.height = height;
			this.tag = tag;
										this.trackTarget = cursor;
                    this.x = x;
                    this.y = y;
                    this.speed = correctForInterval(speed);
                    this.health = health;
                    this.color = color;
										this.dx = 0;
	this.dy = 0;
	this.eventDirection = handleWASD(this);
                }

								Player.prototype.fire = fireMouseDown(CircleShot, circleShots);
								Player.prototype.bounce = notifyOnSolid();
                Player.prototype.draw = drawRectangle;
                Player.prototype.isAlive = healthDie(players);

                //PLAYER CODE ENDS HERE
                //**************Spitter CLASS************
                function Spitter(x, y, width, height, health, speed, color) {
                    this.x = x;
                    this.y = y;
										this.trackTarget = player;
                    this.width = width;
                    this.height = height;
                    this.solid = true;
                    this.health = health || 15000;
                    this.speed = correctForInterval(speed) || 0;
                    this.color = color || "green";
                    this.reload = 0;
                };

//								Spitter.prototype.fire = fireMouseDown(CircleShot, circleShots);
								Spitter.prototype.fire = fireAlways(CircleShot, circleShots);
                Spitter.prototype.isAlive = healthDie(spitters); 
                Spitter.prototype.draw = drawRectangle;
								//Spitter.prototype.fire = fireAtPlayer(SpitterBullet, spitterBullets);


                //SPITTER CODE ENDS HERE

                //********CIRCLE SHOT CLASS***********
                function CircleShot(whose) {
										this.whose = whose;//like player1 object, or spitter one object, then calls the xy wy of that for the bullet x y
                    this.x = whose.x;
                    this.y = whose.y;
										this.storage = circleShots;
										this.trackTarget = whose.trackTarget;
										this.still = false;
										//	console.log(whose);
										
										this.startX = this.x;
										this.startY = this.y;
										this.range = 1000;
										this.durationSeconds = 5;
										this.color = whose.color;
										
                    this.radius = 2.5;
                    this.speed = correctForInterval(25);
                    //and here
//problem here
										setDxDyToObject(this, whose.trackTarget);
//make this section just dx = getDxToCursor(this);
/*
                    this.differenceY = getGameY(cursor.y) - this.y;
                    this.differenceX = getGameX(cursor.x) - this.x;
                    this.angle = (Math.atan2(this.differenceY, this.differenceX)) * (180 / Math.PI);
                    this.radians = this.angle * (Math.PI / 180);
                    this.dx = (this.speed * Math.cos(this.radians));
                    this.dy = (this.speed * Math.sin(this.radians));
*/
                }
										//Test.prototype.testmethod = function(){testfunc(this);};
								CircleShot.prototype.isAlive = function(){distanceDie(this);timeDie(this);};
                CircleShot.prototype.bounce = stopOnSolid();
                CircleShot.prototype.draw = drawCircle;
								//CircleShot.prototype.warp = degreeWarp(80);
								//CircleShot.prototype.update = angleToDxDy();
								CircleShot.prototype.track = function(){trackStopNearObject(this, this.trackTarget, 5);};
                //PROJECTILE ENDS HERE
								function testfunc(that){
												//console.log(that.num);
												console.log("hey");
								}
								var test2 = new Test2();
								var test1 = new Test();
								function Test2(){
											this.other = test1;
								}
								function Test(){
										this.num = 3;
										Test.prototype.testmethod = function(){testfunc(this);};
								}
								//console.log(test2.other.num);
                //*****RectangleClass*********
                function Rectangle(x, y, width, height, color, health) {
                    this.x = x;
                    this.y = y;
                    this.solid = true;
                    this.width = width;
                    this.height = height;
                    this.color = color || "blue";
                    this.health = health || 100;
                }
                Rectangle.prototype.draw = drawRectangle;
                Rectangle.prototype.isAlive = healthDie(rectangles); 


                //RECTANGLE ENDS HERE
                //********CURSOR CLASS*********
                function Cursor() {
										this.x = 100;
										this.y = 100;
										this.height = 20;
										this.width = 20;
                    this.src = "images/crossheirs.png"
                }
								Cursor.prototype.eventDirection = handleWASD(localUser);
										Cursor.prototype.draw = drawSprite;
								//END CURSOR HERE

                function mouseMoveHandler(e) {
			if(cursor != null){
                    cursor.x = getGameX(e.clientX - canvas.getBoundingClientRect().left);
                    cursor.y = getGameY(e.clientY - canvas.getBoundingClientRect().top);
				}
                }
                document.addEventListener("mousemove", mouseMoveHandler, false);
                ///MOUSE ENDS HERE
//no need to put in the classes themselves, just buff it up here
//*******UPDATE STARTS HERE********
                function move() {
                    for (var j = 0; j < instances.length; j++) {
                        for (var i = 0; i < instances[j].length; i++) {
													
                            //if it has movement
                          if ("dx" in instances[j][i]) {
                            if ("still" in instances[j][i]) {
																	if(instances[j][i].still != true){
																							
                                instances[j][i].x += instances[j][i].dx;
                                instances[j][i].y += instances[j][i].dy;
																				
																		}
                            }else{
														
                                instances[j][i].x += instances[j][i].dx;
                                instances[j][i].y += instances[j][i].dy;
														}
												}
											//should fix track bounce complication	
                                instances[j][i].still = false;
                       }
                    }
										
						}
//forward could be direction of mouse
                function update() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
//oh so debating making move a method for all
//problem with wanting the order to be track then bounce or bounce then track
									//	viewUpdate();
										["update", "isAlive", "fire", "draw", "track", "bounce", "eventDirection"/*set angle to dxdy*/ /*"update"*/  /*"warp"*/].map(invokeOnInstances);
//player drawn in relation to view
                    move();
                }

                function invokeOnInstances(method) {
                    for (var i = 0; i < instances.length; i++) {
                        for (var j = 0; j < instances[i].length; j++) {
                            if (instances[i][j][method] && typeof instances[i][j][method] === "function") {
                                instances[i][j][method]();
                            };
                        }
                    }
                }
/*
                function viewUpdate() {
									countX = 0;
									countY = 0;
                    if (rightPressed) {
                        view.dx = player.speed;
   //                     player.dx = player.speed;
												cursor.x += player.speed;
												countX++;
                    }
                    if (upPressed) {
                        view.dy = player.speed;
  //                      player.dy = player.speed;
												cursor.y += player.speed;
												countY++;
                    }

                    if (leftPressed) {
                        view.dx = -player.speed;
 //                       player.dx = -player.speed;
												cursor.x -= player.speed;
												countX++;
												
                    }
										
                    if (downPressed) {
                        view.dy = -player.speed;
//                        player.dy = -player.speed;
												cursor.y -= player.speed;
												countY++;
                    }
										if(countY ==0 ||countY ==2){
		//									player.dy = 0;
											view.dy = 0;
										}
										if(countX ==0 ||countX ==2){
		//									player.dx = 0;
											view.dx = 0;
										}
										if(countX ==1 && countY ==1){
		//										player.dy = ((player.dy/(Math.abs(player.dy)))||0) * (Math.sqrt(Math.pow(player.speed, 2)/2));
		//										player.dx = ((player.dx/(Math.abs(player.dx)))||0) * (Math.sqrt(Math.pow(player.speed, 2)/2));
											view.dy = ((view.dy/(Math.abs(view.dy)))||0) * (Math.sqrt(Math.pow(player.speed, 2)/2));
											view.dx = ((view.dx/(Math.abs(view.dx)))||0) * (Math.sqrt(Math.pow(player.speed, 2)/2));
//add cursor in on this if you want to use it that way
												/*player.dy /=2;
												player.dx /=2;
											view.dy /= 2;
											view.dx /= 2;*/
//										}
//}

//*******UTILITY FUNCTIONS*******
function getDistance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow((y2-y1),2)+(Math.pow((x2-x1),2) ));
}
								function correctForInterval(x){
											return (iterationTime/100)* x;
								}
                function getGameX(x) {
                    return x + view.minX;
                }

                function getGameY(y) {
                    return ((canvas.height - y) + view.minY);
                }

								function getCanvas(){}
                function getCanvasX(gameX) {
                    return gameX - view.minX;
                }

                function getCanvasY(gameY, reindex) {
                    onlyReindex = reindex || false;
                    if (onlyReindex) {
                        return (canvas.height - gameY);
                    } else {
                        return (canvas.height - (gameY - view.minY));
                    }
                }
//END UTILITY FUNCTIONS HERE
                function mouseDownHandler() {
			mouseDown = true;
                }
								function mouseUpHandler(){
								}
                document.addEventListener("mousedown", mouseDownHandler, false);
                document.addEventListener("keydown", keydown, false);
                document.addEventListener("keyup", keyup, false);

                function keydown(e) {
                    if (e.keyCode == 68) {
			if(rightPressed == false){
				sendObj({"set": ["rightPressed", true]});
			}	
                        rightPressed = true;
                    }
                    if (e.keyCode == 65) {
			if(leftPressed == false){
			sendObj({"set": ["leftPressed", true]});
			}
                        leftPressed = true;
                    }
                    if (e.keyCode == 87) {
			if(upPressed == false){
			sendObj({"set": ["upPressed", true]});
			}
                        upPressed = true;
                    }
                    if (e.keyCode == 83) {
			if(downPressed == false){
			sendObj({"set": ["downPressed", true]});
			}
                        downPressed = true;
                    }
                    if (e.keyCode == 82) {
                        window.alert("restarting");
                        document.location.reload();

                    }
                }

                function keyup(e) {
                    if (e.keyCode == 68) {
			if(rightPressed == true){
				sendObj({"set": ["rightPressed", false]});
			}
                        rightPressed = false;
                    }
                    if (e.keyCode == 65) {
			if(leftPressed == true){
			sendObj({"set": ["leftPressed", false]});
			}
                        leftPressed = false;
                    }
                    if (e.keyCode == 87) {
			if(upPressed == true){
			sendObj({"set": ["upPressed", false]});
			}
                        upPressed = false;
                    }
                    if (e.keyCode == 83) {
			if(downPressed == true){
			sendObj({"set": ["downPressed", false]});
			}
                        downPressed = false;
                    }
}
																//make a function that takes this/that and checks for width, or radius of both then checks if they are hitting and returns true/false. maybe include who it belongs to aswell
																/*if (this.x + this.dx < instances[j][i].x + /*like this*//*(instances[j][i].width/2) + this.radius && this.x + this.dx > instances[j][i].x - (instances[j][i].width/2) - this.radius && this.whose !== instances[j][i] ) {
//maybe a simple if statement passed two objects, checks if circle, or rectangle (width vs radius) then applys tests, and returns true or false
																		if (this.y + this.dy < instances[j][i].y + (instances[j][i].height/2) + this.radius && this.y + this.dy > instances[j][i].y -(instances[j][i].height/2)- this.radius) {
*/

/*
																				instances[j][i].health--;

																					
																				//is above or below currently
																				if (this.x < instances[j][i].x + instances[j][i].width + this.radius && this.x > instances[j][i].x - this.radius) {
																					if(degree == true){
																							this.angle*= -1;
																							}else{
																						this.dy *= -1;
																							}
																				}else///remove for allwoing corner shots
																				//is to the side currently
																				if (this.y < instances[j][i].y + instances[j][i].height + this.radius && this.y > instances[j][i].y - this.radius) {
																					if(degree == true){
																								this.angle = 180 -this.angle;
																							}else{
																						this.dx *= -1;
																							}
																				}
																					else

																					if(degree == true){
																								this.angle = 180 -this.angle;
																							this.angle*= -1;
																							}else{
																						this.dx *= -1;
																						this.dy *= -1;
																							}
}
																		}
*/
