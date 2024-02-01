'use server'

import prisma from '@/lib/prisma';
import { Address } from "@/interfaces"


export const setUserAddress = async (address: Address, userId: string) => {

    try {

        const newAddress = await createOrReplaceAddress( address, userId );


        return {
            ok: true,
            address: newAddress
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo grabar la dirección'
        }
    }

}

const createOrReplaceAddress = async (address: Address, userId: string) => {

    console.log({userId})
    const { country, ...rest } = address;
    const addressToSave = {
        ...rest,
        userId: userId,
        countryId: address.country
    };

    try {
        // Buscamos en la base de datos 
        const storeAddress = await prisma.userAddress.findUnique({
            where: { userId }
        });

        // si no existe la creamos
        if (!storeAddress) {

            const newAddress = await prisma.userAddress.create({
                data: addressToSave
            });

            return newAddress;
        }

        // si existe la actualizamos
        const updatedAddress = await prisma.userAddress.update({
            where: {userId},
            data: addressToSave
        })

        return updatedAddress;

    } catch (error) {
        console.log(error);
        throw new Error('No se pudo grabar la dirección');
    }

}