import styles from '../styles/Home.module.css';
import useSwr from 'swr';
import fetcher from '../lib/fetcher';
import type { GetServerSideProps, NextPage } from 'next';
import { findSessions } from '../services/session';
import jose from 'jose';
import { IJWTPayload } from '../lib/jwt.utils';
import { Session } from '@prisma/client';

const Home: NextPage<{ fallbackData: Session[] }> = ({ fallbackData }) => {
  const { data: sessions } = useSwr<Session[] | null>(
    '/api/session/sessions',
    fetcher,
    { fallbackData }
  );

  if (sessions) {
    return (
      <div>
        {sessions.map((session) => (
          <div key={session.id}>{session.id}</div>
        ))}
        );
      </div>
    );
  }

  return <div className={styles.container}>Please login</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token =
    context.req.headers.authorization ||
    (context.req.cookies.accessToken as string);
  console.log('testing token', token);
  const { user } = jose.decodeJwt(token) as IJWTPayload;

  const sessions = await findSessions({ userId: user.id, valid: true });

  return { props: { fallbackData: sessions } };
};

export default Home;
