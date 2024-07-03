'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: {
    page_name?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const pageName = searchParams.page_name;

  if (pageName) {
    await revalidatePath(`/dashboard/${pageName}`);
    redirect(`/dashboard/${pageName}`);
  }

  return <div>Loading...</div>;
};

export default Page;
