import { useRouter } from 'next/router';

const NavBar = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  //
  return (
    <>
      {router.pathname !== '/login' && <div>weed</div>}

      {children}
    </>
  );
};

export default NavBar;
