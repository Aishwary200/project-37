//Create variables here
var dog,dogImg,happyDogImg;
var database;
var foodS,foodStock,foodImg;
var feedButton,addButton
var feedTime,lastFeed
var foodObj
var gameState="hungry",readState
var bedImg,gardenImg,washImg
var currentTime
var lazy,dead;

function preload()
{
  //load images here
  dogImg=loadImage("Dog.png")
  happyDogImg=loadImage("happy dog.png")
  bedImg=loadImage("Bed Room.png")
  gardenImg=loadImage("Garden.png")
  washImg=loadImage("Wash Room.png")
 lazy=loadImage("Lazy.png")
 dead=loadImage("deadDog.png") 
}

function setup() {
  database = firebase.database();
  createCanvas(1300, 500);
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })
  dog=createSprite(600,250,20,20)
  dog.addImage(dogImg)
  dog.scale=0.2;
  foodStock=database.ref('Food')
  foodStock.on("value",(data)=>{
    foodS=data.val()
  })
  
  foodObj=new Food()
  
  feedButton=createButton("Feed the dog")
  feedButton.position(700,95)
  feedButton.mousePressed(feedDog)
  addButton=createButton("Add food")
  addButton.position(800,95)
  addButton.mousePressed(addFoods)
  getTime();
}


function draw() {  
  background(46,139,87)
  drawSprites();
  //add styles here
//  if(keyWentDown(UP_ARROW)){
//    writeStock(foodS);
//    dog.addImage(happyDogImg)
//  }
//  if(keyWentUp(UP_ARROW)){
  
//   dog.addImage(dogImg)
// }
feedTime=database.ref('feedTime')
feedTime.on("value",(data)=>{
  lastFeed=data.val();
})
if(gameState!=="hungry"){
  feedButton.hide();
  addButton.hide();
  dog.remove()
}
else{
  feedButton.show()
  addButton.show()
  dog.addImage(dogImg)
}
 textSize(20)
 fill("red")
 text("food: "+foodS,250,50)
 
 fill(255,255,254)
 textSize(15)
 if(lastFeed>=12){
   text("Last feed: "+lastFeed%12+ "PM",350,30)
 } else if(lastFeed===0){
  text("Last feed: 12 AM",350,30)
 } else{
  text("Last feed: "+lastFeed + "AM",350,30)
 }
if(currentTime===(lastFeed+1)){
  update("playing")
  foodObj.garden()
  
}
else if(currentTime===(lastFeed+2)){
  update("sleeping")
  foodObj.bedroom()
  
}else if(currentTime>(lastFeed+2) && currentTime<=(lastFeed+4)){
  update("bathing");
  foodObj.washroom();
}
else if(currentTime>(lastFeed+4) && currentTime<=(lastFeed+6)){
  update("lazy")
  dog.addImage(lazy)
}
else{
  update("hungry")
  foodObj.display();
}  
}

function readStock(data){
  foodS=data.val();
 
}

function feedDog(){
  dog.addImage(happyDogImg)
  foodS=foodS-1
  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  database.ref('/').update({
    //foodObj:getFoodStock(),
   feedTime:hour()
  })
}
function addFoods(){
  foodS++
  database.ref('/').update({
  Food:foodS
  })
}
async function getTime(){
  var response=await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata")
  var responseJSON=await response.json();
  var datetime=responseJSON.datetime
  
  lastFeed=datetime.slice(11,13)
  currentTime=datetime.slice(11,13)
}  
function update(state){
  database.ref('/').update({
    gameState:state
  })
}

