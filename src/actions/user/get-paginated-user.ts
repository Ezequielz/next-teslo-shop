'use server'

import prisma from '@/lib/prisma';
import { auth } from "@/auth.config";


export const getPaginatedUsers = async() => {
    const session = await auth();

    if ( session?.user.role !== 'admin' ) {
        return {
            ok:false,
            message: 'No tiene los permisos necesarios'
        }
    }

    const users = await prisma.user.findMany({
        orderBy: {
            name: 'asc'
        }
    })

    return {
        ok: true,
        users: users
    }


}