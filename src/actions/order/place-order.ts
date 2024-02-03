'use server'

import { auth } from "@/auth.config";
import prisma from '@/lib/prisma';
import type { Address, Size } from "@/interfaces";

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {

    const session = await auth();
    const userId = session?.user.id;
    // Verificar session usuario
    if (!userId) {
        return {
            ok: false,
            message: 'No hay sessión de usuario'
        }
    }
    // console.log({productIds, address, userId})

    // Obtener la informacion de los productos
    // Nota: Recuerden que podemos llevar 2+ productos con el mismo ID

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map(p => p.productId)
            }
        }
    })

    // Calcular los montos // Encabezado
    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

    // Los totales de tax, subtotal y total
    const { subTotal, tax, total } = productIds.reduce((totals, item) => {

        const productQuantity = item.quantity;
        const product = products.find(product => product.id === item.productId);

        if (!product) throw new Error(`${item.productId} no existe - 500`);

        const subTotal = product.price * productQuantity;

        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15

        return totals
    }, { subTotal: 0, tax: 0, total: 0 })

    try {
        // Crear la transacción de base de datos
        const prismaTx = await prisma.$transaction(async (tx) => {

            // 1. Actualizar el stock de los productos

            const updatedProductPromises = products.map((product) => {
                // Acumular los valores
                const productQuantity = productIds.filter(
                    p => p.productId === product.id
                ).reduce((acc, item) => item.quantity + acc, 0);

                if (productQuantity === 0) {
                    throw new Error(`${product.id}, no tiene cantidad definida`)
                }

                return tx.product.update({
                    where: { id: product.id },
                    data: {
                        // inStock: product.inStock - productQuantity
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                })
            })

            const updatedProducts = await Promise.all(updatedProductPromises);

            // Verificar valores negativos en stock
            updatedProducts.forEach(product => {
                if (product.inStock < 0) {
                    throw new Error(`${product.title}, no tiene inventario suficiente`);
                }
            });


            // const { country, ...restAddress } = address;
            // 2. Crear la orden - Encabezado - Detalles
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,

                    // OrderAddress: {
                    //     create: {
                    //         ...restAddress,
                    //         countryId: country,
                    //     }
                    // },

                    OrderItem: {
                        createMany: {
                            data: productIds.map(p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find(product => product.id === p.productId)?.price ?? 0
                                // price : 0
                            }))
                        }
                    }
                }
            })

            // Validar si price es cero, lanzar un error
            productIds.map(p => {

                const price = products.find(product => product.id === p.productId)?.price ?? 0

                if (price === 0) throw new Error('Error en los calculos de precio')
            })

            // 3. Crear la dirección de la orden

            const { country, ...restAddress } = address;

            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    countryId: country,
                    orderId: order.id
                }
            });

            return {
                updatedProducts: updatedProducts,
                order: order,
                orderAddress: orderAddress
            }

        });

        return {
            ok: true,
            order: prismaTx.order,
            prismaTx: prismaTx
        }
    } catch (error: any) {
        return {
            ok: false,
            message: error?.message
        }
    }


}