import Head from 'next/head';
import React from 'react';
import {IndexView} from './View';

export function Index()
{
    const items = [
        {title: 'Admin', url: '/admin'},
        {title: 'Calculator', url: '/calculator'}
    ];

    return (
        <>
            <Head>
                <title>SDK Demo App</title>
            </Head>
            <IndexView items={items} />
        </>
    );
}