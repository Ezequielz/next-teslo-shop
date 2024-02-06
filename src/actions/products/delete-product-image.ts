'use server'

import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';
cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export const deleteProductImage = async( imageId: number, imageUrl: string ) => {

    if ( !imageUrl.startsWith('http') ) {
        return {
            ok: false,
            message: 'No se pueden borrar imagen de fileSystem'
        }
    }


    const imageName = imageUrl
        .split('/')
        .pop()
        ?.split('.')[0] ?? ''


    try {
    //    await cloudinary.uploader.destroy( `tesloShop/${imageName}` );
        
        // borrar imagen de base de datos
        const deleteImage = await prisma.productImage.delete({
            where: {
                id: imageId
            },
            // obtener el slug de la relacion con productos para ravalidar paths
            select:{
                product: {
                    select: {
                        slug: true
                    }
                }
            }
        });
       
        // eliminar imagen de cloudinary si se elimino de base de datos
        if ( deleteImage.product) {
            console.log('first')
           const a = await cloudinary.uploader.destroy( `tesloShop/${imageName}` );

           console.log({a})
        }
        // Revalidar paths

        revalidatePath('/admin/products')
        revalidatePath(`/admin/product/${ deleteImage.product.slug }`)
        revalidatePath(`/product/${ deleteImage.product.slug }`)
        
    } catch (error) {
        console.log(error)
        return {
            ok:false,
            message: 'No se pudo eliminar la imagen'
        };
    }

}