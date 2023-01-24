import { useRouter } from 'next/router';
import styles from '@/styles/NavBar.module.css';

const NavBar = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <>
      <div className={`${styles.navContentRows} `}>
        {router.pathname !== '/login' && (
          <div
            className={`${styles.navGrid}  w-full p-5 fixed row-start-1 row-end-2 z-10`}
          >
            <div
              className={`${styles.button} active:shadow-inner   hover:bg-blueGrey-500 col-start-2 col-end-3 bg-blueGrey-600 flex p-2 justify-center rounded-2xl hover:cursor-pointer`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
                />
              </svg>
            </div>
            <div
              className={`${styles.button} active:shadow-inner col-start-6 col-end-8 hover:bg-blueGrey-500 bg-blueGrey-600  flex p-2 justify-center rounded-2xl hover:cursor-pointer `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-6 h-6  "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </div>
            <div
              className={`${styles.button} active:shadow-inner col-start-11 hover:bg-blueGrey-500 col-end-12 bg-blueGrey-600 flex p-2 justify-center rounded-2xl hover:cursor-pointer`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
          </div>
        )}
        <div className="row-start-2 row-end-3">{children}</div>
      </div>
    </>
  );
};

export default NavBar;
