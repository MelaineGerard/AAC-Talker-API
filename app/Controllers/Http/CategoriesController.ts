import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'

export default class CategoriesController {
  public async index({ }: HttpContextContract) {
    const categories = await Category.all()
    return {
      data: categories,
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const category = new Category()
    if(request.raw() === null){
      return response.status(400).json({
        "message": "Request body is empty",
      })
    }
    const data = JSON.parse(request.raw())
    try {
      await category.fill(data).save()
    } catch (error) {
      return response.status(400).json({
        "message": "Could not create category",
      })
    }
    
    return {
      data: category,
    }
  }

  public async show({ params, response }: HttpContextContract) {
    const id = params.id
    const category = await Category.findOrFail(id).catch(() => {
      return response.status(404).json({
        "message": "Category not found",
      })
    }
    );

    return {
      data: category,
    }
  }

  public async update({ params, response, request }: HttpContextContract) {
    const id = params.id
    const category = await Category.findOrFail(id).catch(() => {
      return response.status(404).json({
        "message": "Category not found",
      })
    });
    try {
      await category.merge(request.body()).save()
    } catch (error) {
      return response.status(400).json({
        "message": "Could not update category",
      })
    }

    return {
      data: category,
    }
    

  }

  public async destroy({ params, response }: HttpContextContract) {
    const id = params.id
    const category = await Category.findOrFail(id).catch(() => {
      return response.status(404).json({
        "message": "Category not found",
      })
    })
    await category.delete()
    return response.status(204)
  }
}
