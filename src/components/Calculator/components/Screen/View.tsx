import React from 'react';
import styles from './styles.module.scss';

export interface IScreenViewProps
{
    value: string;
}

export function ScreenView(props: IScreenViewProps)
{
    const {value} = props;
    return (
        <div className={styles.Screen}>
            <div className={styles.screenContent}>
                <div className={styles.formulaWrapper}>
                    <div className={styles.formula}>
                        {value}
                    </div>
                </div>
           </div>
        </div >
    );
}