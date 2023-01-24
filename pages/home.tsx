import type { GetServerSideProps, NextPage } from 'next';

import styles from '@/styles/Home.module.css';
import { useAddEventValue } from '@/context/NavBarContext';
import AddEvent from '@/components/forms/AddEvent';

const Home: NextPage = () => {
  const addEvent = useAddEventValue();

  //TODO: create layout of home page (main content)

  return (
    <div className={` ${styles.grid} h-screen w-full`}>
      home
      <div>test</div>
      {addEvent ? <AddEvent /> : ''}
      <div className="col-start-4 col-end-10 row-start-2 row-end-3 ">
        main content
      </div>
    </div>
  );
};

export default Home;
