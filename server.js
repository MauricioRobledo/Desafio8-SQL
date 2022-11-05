const express = require('express');
const options = require("./config/dbConfig");
const {productsRouter, products} = require('./router/ruta');
const handlebars = require('express-handlebars');
const {Server} = require("socket.io");
const ContenedorSql = require("./managers/contenedorSql");

const productosApi = new ContenedorSql(options.mariaDB, "products");
const chatApi = new ContenedorSql(options.sqliteDB,"chat");


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))


app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');


app.get('/', async(req,res)=>{
    res.render('home')
})

app.get('/productos',async(req,res)=>{
    res.render('products',{products: await productosApi.getAll()})
})

app.use('/api/products',productsRouter)



const server = app.listen(8080,()=>{
    console.log('listening on port 8080')
})


const io = new Server(server);

io.on("connection",async(socket)=>{

    io.sockets.emit("products", await productosApi.getAll())

    socket.on("newProduct",async(data)=>{
        await productosApi.save(data);
        io.sockets.emit("products", await productosApi.getAll())
    })

    io.sockets.emit("messages", await chatApi.getAll());

    socket.on("newMessage",async(newMsg)=>{
        await chatApi.save(newMsg);
        io.sockets.emit("messages", await chatApi.getAll());
    })
})