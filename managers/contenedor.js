const fs = require("fs");
const path = require("path");

class Contenedor{
    constructor(nameFile){
        this.nameFile =path.join(__dirname,"..",`files/${nameFile}`);
    }

    save = async(product)=>{
        try {
            if(fs.existsSync(this.nameFile)){
                const productos = await this.getAll();
                const lastIdAdded = productos.reduce((acc,item)=>item.id > acc ? acc = item.id : acc, 0);
                const newProduct={
                    id: lastIdAdded+1,
                    timestamp: Date.now(),
                    ...product
                }
                productos.push(newProduct);
                await fs.promises.writeFile(this.nameFile, JSON.stringify(productos, null, 2))
                return productos;
            } else {
                const newProduct={
                    id:1,
                    timestamp: Date.now(),
                    ...product
                }
                await fs.promises.writeFile(this.nameFile, JSON.stringify([newProduct], null, 2));
            }
        } catch (error) {
            console.log("error saving",error);
        }
    }

    getById = async(id)=>{
        try {
            if(fs.existsSync(this.nameFile)){
                const productos = await this.getAll();
                const producto = productos.find(item=>item.id===id);
                return producto
            }
        } catch (error) {
            console.log(error)
        }
    }

    getAll = async()=>{
        try {
            const contenido = await fs.promises.readFile(this.nameFile,"utf8");
            const productos = JSON.parse(contenido);
            return productos
        } catch (error) {
            console.log(error)
        }
    }

    deleteById = async(id)=>{
        try {
            const productos = await this.getAll();
            const newProducts = productos.filter(item=>item.id!==id);
            await fs.promises.writeFile(this.nameFile, JSON.stringify(newProducts, null, 2));
        } catch (error) {
            console.log(error)
        }
    }

    deleteAll = async()=>{
        try {
            await fs.promises.writeFile(this.nameFile, JSON.stringify([]));
        } catch (error) {
            console.log(error)
        }
    }

    updateById = async(id, body)=>{
        try {
            const productos = await this.getAll();
            const productPos = productos.findIndex(elm=>elm.id === id);
            productos[productPos] = {
                id:id,
                ...body
            };
            await fs.promises.writeFile(this.nameFile, JSON.stringify(productos, null, 2))
            return productos;
        } catch (error) {
            console.log(error)
        }
    }


    getAllProductsCart = async(id)=>{
        try {
            const carts = await this.getAll();
           
            const cartId = carts.find(elm=>elm.id === id)
            console.log(cartId)
            const products = cartId.productos 
            return products
        } catch (error) {
            console.log(error)
        }
    }

    saveProduct = async(id, product)=>{
        try {
            const cart = await this.getAll()
            const cartId = cart.find(elm=>elm.id === id)
            cartId.productos.push(product)
            await fs.promises.writeFile(this.nameFile, JSON.stringify(cart, null, 2))
            
        } catch(error) {
            console.log(error)
        }
    }

    deleteFromCart = async(cartId, prodId)=>{
        try {
            const cart = await this.getAll()
            const foundCart = cart.find(elm=>elm.id===cartId)
            const listaActualizada = foundCart.productos.filter(item=>item.id!==prodId)
            await fs.promises.writeFile(this.nameFile, JSON.stringify(listaActualizada, null, 2));
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = Contenedor;