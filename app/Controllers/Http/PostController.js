'use strict'
const Post = use('App/Models/Post')
const { validate } = use('Validator')

class PostController {
    async index({ view }){
        // const posts = [
        //     {title:'Post One',body:'This is post one'},
        //     {title:'Post Two',body:'This is post two'},
        //     {title:'Post Three',body:'This is post three'},
        //     {title:'Post Four',body:'This is post four'},
            
        // ]

        const posts = await Post.all()

        return view.render('posts.index',{
            title: 'Latest Post',
            posts: posts.toJSON()
        })
    }

    async details({params,view}){
        const post = await Post.find(params.id)

        return view.render('posts.details',{
            post: post
        })
    }

    async edit({ params, view }){

        const post = await Post.find(params.id)
        return view.render('posts.edit',{
            post:post
        })
    }

    async add({ view }){
        return view.render('posts.add')
    }

    async store({ request,response,session }){

        const validation = await validate(request.all(), {
            title: 'required|min:3|max:255',
            body: 'required|min:3'
        })

        if(validation.fails()){
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back')
        }
        const post = new Post()

        post.title = request.input('title')
        post.body = request.input('body')

        await post.save()

        session.flash({ notification: 'Post Added' })

        return response.redirect('/posts')
    }
    
    async update({params, request, response, session}){
        const validation = await validate(request.all(), {
            title: 'required|min:3|max:255',
            body: 'required|min:3'
        })

        if(validation.fails()){
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back')
        }

        const post = await Post.find(params.id)

        post.title = request.input('title')
        post.body = request.input('body')

        await post.save()

        session.flash({ notification: 'Post Updated!' })

        return response.redirect('/posts')
    }

    async destroy({params,session, response}){
        const post = await Post.find(params.id)

        await post.delete()

        session.flash({ notification: 'Post Deleted!' })

        return response.redirect('/posts')

    }
}



module.exports = PostController
