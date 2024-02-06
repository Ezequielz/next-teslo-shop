/* eslint-disable jsx-a11y/alt-text */
// https://tailwindcomponents.com/component/hoverable-table
export const revalidate = 0

import Link from 'next/link';
import { IoCardOutline } from 'react-icons/io5';

import { Pagination, Title } from '@/components';
import { getPaginatedProductsWhitImages } from '@/actions';
import Image from 'next/image';
import { currencyFormat } from '@/utils';

interface Props {
  searchParams: {
    page?: string
  }
}

export default async function ({ searchParams }: Props) {


  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsWhitImages({ page });

  return (
    <>
      <Title title="Mantenimiento de Productos" />

      <div className='flex justify-end mb-5'>
        <Link
          href={'/admin/product/new'}
          className='btn-primary'
        >
          Nuevo producto
        </Link>
      </div>

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Imagen
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Titulo
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Precio
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Género
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Inventario
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Tallas
              </th>
            </tr>
          </thead>
          <tbody>


            {
              products.map(product => (
                <tr
                  key={product.id}
                  className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                >

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link href={`/product/${product.slug}`} >
                      <Image
                        src={`/products/${product.ProductImage[0].url}`}
                        width={80}
                        height={80}
                        alt={product.title}
                        className='w-20 h-20 object-cover rounded'
                      />
                    </Link>
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/product/${product.slug}`}
                      className='hover:underline'
                    >
                      {product.title}
                    </Link>
                  </td>
                  <td className=" text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                    { currencyFormat( product.price ) }
                  </td>
                  <td className=" text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    { product.gender }
                  </td>
                  <td className=" text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                    { product.inStock }
                  </td>
                  <td className=" text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    { product.sizes.join(', ') }
                  </td>
         

                </tr>

              ))
            }

          </tbody>
        </table>
        <Pagination totalPages={totalPages} />

      </div>
    </>
  );
}