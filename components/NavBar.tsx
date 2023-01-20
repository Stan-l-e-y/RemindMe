import { useRouter } from 'next/router';
import styles from '@/styles/NavBar.module.css';

const NavBar = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <>
      <div className={`${styles.navRows} `}>
        {router.pathname !== '/login' && (
          <div
            className={`${styles.navGrid} w-full p-5 fixed row-start-1 row-end-2`}
          >
            <div className="col-start-1 col-end-3 bg-blueGrey-600 flex p-2 rounded-2xl ">
              1
            </div>
            <div className="col-start-6 col-end-8 bg-blueGrey-600 flex p-2 justify-center rounded-2xl  ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-6 h-6 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </div>
            <div className="col-start-11 col-end-13 bg-blueGrey-600 p-2 rounded-2xl">
              3
            </div>
          </div>
        )}
        <div className="row-start-2 row-end-3">{children}</div>
      </div>
    </>
  );
};

export default NavBar;
