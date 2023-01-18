import { useRouter } from 'next/router';
import styles from '@/styles/NavBar.module.css';

const NavBar = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  //
  return (
    <>
      {router.pathname !== '/login' && (
        <div className={`${styles.navGrid} w-full`}>
          <div className="col-start-1 col-end-3">1</div>
          <div className="col-start-6 col-end-8">2</div>
          <div className="col-start-11 col-end-13">3</div>
        </div>
      )}

      {children}
    </>
  );
};

export default NavBar;
