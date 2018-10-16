function Sequence(obj) {
    Object.keys(obj).map(item => {
        setTimeout(obj[item], item)
    })
}
class Vector {
    constructor(x, y){
        this.x =x 
        this.y = y
    }
    add(vec){
        this.x += vec.x
        this.y += vec.y
    }
    substract(vec) {
        this.x -= vec.x
        this.y -= vec.y
    }
}
class Boune {
    constructor(canvas , x, y , R ){
            this.context = canvas.getContext('2d')
            // this.R = 30
            this.pos  = new Vector(x, y)
            this.R = R
            this.canvas = canvas
            
    }   
    // setPositon(vec){
    //     this.pos.add(vec)
    // }
    render(){
        this.context.beginPath()
        this.context.clearRect( 0 , 0  , this.canvas.width ,this.canvas.height)
        this.context.fillStyle="blue"  

        if(this.pos.y > (700 - this.R )  && this.count <0){
            this.pos.add(new Vector(0 , this.count))
            this.count  = this.count +10
        }
        this.context.arc(this.pos.x , this.pos.y , this.R , 0 ,360)
        this.context.fill()
        this.context.closePath()
    }
    verifyPoistion(){
        if(this.pos.y  > 700){
            this.pos.y = 0 
        }
    }
    accelerationEarth() {
        let acc = 0
        // console.log('Y' , this.pos.y)
        if(this.pos.y > 0  ) {
            acc = 2
        }
        if(this.pos.y > 50){
            acc  = 3
        }
        if(this.pos.y > 100){
            acc =  4
        }
        if(this.pos.y > 200){
            acc =  5
        }
        
        if(this.pos.y  > (700 - this.R)){
           
           this.pos.y = (700 - this.R)
        }
           return acc 
    }

}
class Column {
    constructor(canvas ,x, y , d , r) {
        this.d = d; // chieu dai
        this.r = r  // chieu rong
        this.pos = new Vector(x , y) // vi tri
        this.canvas = canvas
        this.context = canvas.getContext('2d')
        this.life = 1
    }
    
    render() {
        this.context.beginPath()
        // this.context.clearRect( 0 , 0  , 1000 , 1000)
        this.context.rect(this.pos.x , this.pos.y, this.r, this.d);
        this.context.stroke();
        this.context.fill()
        this.context.closePath()
    }
}
// settings background game 
class BackgroundGame {
    constructor( canvas  , width, height  , colorBackground ){
        this.canvas  = canvas;
        this.context = canvas.getContext('2d')
        this.width  = width
        this.height = height
        this.colorBackground =  'red'

    }
    render(){
        this.context.beginPath() //  if widthout function beginPath then error draw canvas
        this.context.fillStyle = 'red' 
        this.context.rect( 0 , 0  , 500 , 500)
        this.context.fill()
        this.context.closePath()
    }
    
    
}
class ControlGame {
        constructor(canvas ){
            this.canvas = canvas
            this.canvas.width = window.innerWidth
            this.canvas.height = window.innerHeight
            // this.canvas.colorBackground = 'blue'
            this.backgroundGame = new BackgroundGame(this.canvas , 0  , 0 , 'red')
            this.boune = new Boune(this.canvas , 100 , 100,50  )
            this.column  = new Column(this.canvas , 0  , 700 , 1 , window.innerWidth  )
            this.columns = []
            this.context = this.canvas.getContext('2d')
        }
         getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }
        createColumn(X){
            const d1 = this.getRandomArbitrary(100 , 250)
            const newColumn1 = new Column(this.canvas ,  X  ,  0 , d1 , 20  )
            const d2 = this.getRandomArbitrary(100 , 250)
            const newColumn2 = new Column(this.canvas ,  X  ,  700 - d2 , d2 , 20 )
                this.columns.push(newColumn1)
                this.columns.push(newColumn2)
        }
        loopCreate() {
            for(let i = 2 ; i< 100 ; i++){
                this.createColumn(i * 300)
            }

        }
        detectImpactBounceAndColumn(){
            // const {x , y } = this.boune.pos // 
            const xBounce = this.boune.pos.x + this.boune.R
            const yBounce = this.boune.pos.y + this.boune.R
            this.columns.map(item => {
                const { d, r , pos : {x , y}}  = item
                // console.log( yBounce  , d , x)
                if(y === 0) {
                    if(yBounce  < d && x < xBounce && xBounce <(x +r)) {
                        console.log('game over 0')
                    }
                }
                // console.log(y)
                if(y !==0){
                    if(yBounce > y && x < xBounce && xBounce <(x +r)){
                       console.log('game over 1')
                    }
                }
            })
        }
        animateAllColumn() {
            this.columns.map(item => {
                item.pos.add(new Vector(-4 , 0 ))
                item.render()
            })
        }
        loop(){
            this.columns.map(item => {
                item.render()
            })
        }
        controlBounce(x, y ){
                // this.context.clearRect( 0 , 0  , 1000 , 1000)
                const newVector = new Vector( x, y) 
                // console.log(this.boune.pos)
                this.boune.pos.add(newVector)
                this.run()   
        }
        run(){
            this.boune.render()
            this.column.render()
            this.loop()
        }       
}
const canvas = document.getElementById('canvas')


window.addEventListener('keydown' , e => {
    if(e.keyCode === 37) {
        instanceControlGame.context.clearRect( 0 , 0  , 1000 , 1000)
        instanceControlGame.controlBounce(-5 , 0)
    }
    if(e.keyCode === 38){
        instanceControlGame.controlBounce(0 , -40)
    }
    if(e.keyCode === 39){
        instanceControlGame.controlBounce(5 , 0)
    }
    if(e.keyCode === 40){
        instanceControlGame.controlBounce(0 , 5)
    }
})
const instanceControlGame = new ControlGame(canvas)
Sequence({
    0 : () => {
      
        instanceControlGame.run()
       

    },
    1000 : () => {
        instanceControlGame.loopCreate()
        // instanceControlGame.loop()
    },
    2000 : function fallInGratity() {
        // instanceControlGame.boune.verifyPoistion()
        instanceControlGame.controlBounce(0 , instanceControlGame.boune.accelerationEarth())
        // console.log(instanceControlGame.boune.accelerationEarth())
        instanceControlGame.animateAllColumn()
        instanceControlGame.detectImpactBounceAndColumn()
        requestAnimationFrame(fallInGratity)
    }

})