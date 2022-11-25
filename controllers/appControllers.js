import { Sequelize } from 'sequelize'
import {Precio, Categoria, Propiedad} from '../models/index.js'

const inicio = async (req, res) => {

    const [categorias,precios,casas] = await Promise.all([
        Categoria.findAll({raw: true}),
        Precio.findAll({raw: true}),
        Propiedad.findAll({
            where:{
                FK_Categoria:1
            },
            include:[
                {
                    model:Precio
                }
                
            ], order: [
                ['id','DESC']
            ]
        })
    ])
    res.render('auth/inicio',{
        pagina: 'inicio',
        barra: true,
        categorias,
        precios,
        casas,
        csrfToken: req.csrfToken(),
    })
}


const categoria = async (req, res) => {
    
    const {id} = req.params
    

    //categoria existe?
    const categoria = await Categoria.findByPk(id)
    if(!categoria){
        return res.redirect('/404')
    }

    //obtener las propiedades de la categoria
    const propiedades = await Propiedad.findAll({
        where:{
            FK_Categoria: id
        },
        include:[
            {
                model:Precio
            }
            
        ]
    })

    res.render('auth/categoria',{
        pagina: `${categoria.nombre}`,
        barra: true,
        propiedades,
        csrfToken: req.csrfToken()
    })

}

const noEncontrado  = (req, res) => {
    res.render('auth/404',{
        pagina: '404 No Encontrado',
        barra: true,
        csrToken: req.csrToken()
    })
}

const buscador = async (req, res) => {
    const {termino} = req.body
    //validar que el termino no este basio 
    if(!termino.trim){
        return res.redirect('back')
    }
    //colsultar
    const propiedades = await Propiedad.findAll({
        where:{
            titulo:{
                [Sequelize.Op.like] : '%' + termino + '%'
            }
        },
        include:[
            {
                model:Precio
            }
            
        ]
    })

    res.render('auth/busqueda',{
        pagina: 'Resultado de la busqueda',
        barra: true,
        propiedades,
        csrfToken: req.csrfToken()
    })

}


export {
    inicio,
    categoria,
    noEncontrado,
    buscador
}