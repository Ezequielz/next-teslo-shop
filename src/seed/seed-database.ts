import prisma from '../lib/prisma';
import { initialData } from "./seed";
import { countries } from "./seed-countries";



async function main() {
    // Borrar todos los registros previos
    // await Promise.all([
        
    await prisma.orderAddress.deleteMany();    
    await prisma.orderItem.deleteMany();    
    await prisma.order.deleteMany();    

    await prisma.userAddress.deleteMany();    
    await prisma.user.deleteMany();
    await prisma.country.deleteMany()
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    // ])

    const { categories, products, users } = initialData

    await prisma.user.createMany({
        data: users
    });

    await prisma.country.createMany({
        data: countries
    })

    // Categorias

    // {
    //     name: 'Shirt'
    // }
    const categoriesData = categories.map(category => ({
        name: category
    }));

    await prisma.category.createMany({
        data: categoriesData
    });

    const categoriesDB = await prisma.category.findMany();
    const categoriesMap = categoriesDB.reduce((map, category) => {

        map[category.name.toLowerCase()] = category.id;

        return map;
    }, {} as Record<string, string>); // < string=shirt, string=categoryID >


    // Productos


    products.forEach(async (product) => {
        const { images, type, ...rest } = product;

        const dbProduct = await prisma.product.create({
            data: {
                ...rest,
                categoryId: categoriesMap[type]
            }
        });

        // Images
        const imagesData = images.map(image => ({
            url: image,
            productId: dbProduct.id
        }));

        await prisma.productImage.createMany({
            data: imagesData,
        });
    });

    console.log('Seed Ejecutado correctamente')
}

(() => {
    if (process.env.NODE_ENV === 'production') return;
    main();
})();