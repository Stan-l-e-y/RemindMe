import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '@/pages/login';
import mockRouter from 'next-router-mock';
//NOTE: i can mock an event with ``fireEvent``
//TODO: document the readme to include info on env.test.local

jest.mock('next/router', () => require('next-router-mock'));

describe('Login Page', () => {
  it('should have a div with an id OAuthLogin and two buttons for facebook and google', async () => {
    //
    const result = render(<Login code_challenge={''} />);

    const oauthDiv = result.container.querySelector('#OAuthLogin');

    const buttons = screen.getAllByRole<HTMLButtonElement>('button', {
      name: /google|facebook/i,
    });

    expect(oauthDiv).toBeTruthy();
    expect(buttons).toHaveLength(2);
  });
});
