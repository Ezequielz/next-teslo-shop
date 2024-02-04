
export const revalidate = 0
// https://tailwindcomponents.com/component/hoverable-table

import { redirect } from 'next/navigation';

import { Pagination, Title } from '@/components';
import { getPaginatedOrders, getPaginatedUsers } from '@/actions';
import { UsersTable } from './ui/UsersTable';

export default async function () {


  const { ok, users = [] } = await getPaginatedUsers();

  if (!ok) {
    redirect('/auth/login')
  }

  return (
    <>
      <Title title="Mantenimiento de Usuarios" />

      <div className="mb-10">
        <UsersTable users={users} />

        <Pagination totalPages={1} />
      </div>
    </>
  );
}