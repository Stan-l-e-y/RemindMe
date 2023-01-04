import styles from '../styles/Home.module.css';
import useSwr from 'swr';
import fetcher from '../lib/fetcher';
import type { GetServerSideProps, NextPage } from 'next';
import { findSessions, exclude } from '../services/session';
import { verifyJwt } from '../lib/jwt.utils';
import { Session } from '@prisma/client';
import { useRouter } from 'next/router';

const Home: NextPage<{ fallbackData: Session[] }> = ({ fallbackData }) => {
  const router = useRouter();
  const { data: sessions } = useSwr<Session[] | null>(
    '/api/session/sessions',
    fetcher,
    { fallbackData }
  );

  async function logout() {
    try {
      await fetch('/api/session/delete', {
        method: 'DELETE',
      });
      router.push('/login');
    } catch (error) {
      console.log(error);
    }
  }

  if (sessions) {
    return (
      <div>
        <button onClick={logout}>Log Out</button>
        {sessions.map((session) => (
          <div key={session.id}>{session.id}</div>
        ))}
      </div>
    );
  }

  return <div className={styles.container}>Please login</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token =
    (context.res.getHeader('x-access-token') as string) ||
    (context.req.cookies.accessToken as string);

  try {
    const { decoded } = await verifyJwt(token, 'ACCESS_TOKEN_PUBLIC_KEY');

    if (decoded) {
      const sessions = await findSessions({
        userId: decoded.id,
        valid: true,
      });

      const newSessions = sessions.map((session) =>
        exclude(session, ['createdAt', 'updatedAt'])
      ) as Session[];

      return { props: { fallbackData: newSessions } };
    }
    return { props: { fallbackData: [] } };
  } catch (error) {
    return { props: { fallbackData: [] } };
  }
};

export default Home;
