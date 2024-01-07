export const revalidate = 60;

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Gender } from '@prisma/client';
import { Pagination, ProductGrid, Title } from '@/components';
import { getPaginatedProductsWhitImages } from '@/actions';


interface Props {
  params: {
    gender: string;
  };
  searchParams: {
    page?: string
  };
}

const labels: Record<string, string> = {
  'men': 'Hombres',
  'women': 'Mujeres',
  'kid': 'Niños',
  'unisex': 'Todos'
}


export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {

  const gender = params.gender

  return {
    title: `${labels[gender]}`,
    description: `Artículos de ${labels[gender]}`,
  }
}



export default async function ({ params, searchParams }: Props) {

  const { gender } = params;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsWhitImages({ page, gender: gender as Gender});

  if ( products.length === 0 ) {
    redirect(`/gender/${ gender }?page=1`)
  }
  // const products = seedProducts.filter( product => product.gender === gender );



  // if ( id === 'kids' ) {
  //   notFound();
  // }


  return (
    <>
      <Title
        title={`Artículos de ${labels[gender]}`}
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid
        products={products}
      />

      <Pagination totalPages={totalPages} />

    </>
  );
}