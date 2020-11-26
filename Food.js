class Food{
constructor(){
    this.foodStock=20
    this.image=loadImage("milk.png")
    this.foodCount=0
}
display(){
 var x=80,y=100;
 imageMode(CENTER)
 image(this.image,720,220,70,70)
 if(this.foodStock!==0){
    for(var i=0;i<this.foodStock;i++){
        if(i%10===0){
            x=80
            y=y+50
        }
        image(this.image,x,y,50,50)
        x=x+30
    }
 }
}
getFoodStock(){
var foodCountRef=database.ref('foodCount')

foodCountRef.on("value",(data)=>{
    this.foodCount=data.val()
})
console.log(foodCountRef)
return foodCountRef
}
updateFoodStock(count){
 database.ref('/').update({
     count:this.foodCount
 })
}
bedroom(){
background(bedImg,550,500)
}
garden(){
background(gardenImg,550,500)
}
washroom(){
background(washImg,550,500)
}
}