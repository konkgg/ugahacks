import { getInitialState } from '@/utils/serverUtils';
import { useUserStore } from '@/store/userStore';

export async function StoreInitializer() {
  const initialState = await getInitialState();

  // Initialize the store with server generated data
  useUserStore.setState(initialState);

  return null;
}

export default async function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StoreInitializer />
      {children}
    </>
  );
} 