import React, {useMemo} from 'react';
import styles from './styles.module.scss';
import classnames from 'classnames';
import {DefaultButton, PrimaryButton} from '@fluentui/react';

export interface IKeyboardProps
{

}

export function Keyboard(props: IKeyboardProps)
{
    const array = useMemo(() => new Array(10).fill(0), []);

    return (
        <div className={styles.Keyboard}>
            {
                array.map(
                    (_, i) =>
                        <div key={i} className={classnames(styles[`key-${i}`], styles.key)}>
                            <DefaultButton className={styles.button}>
                                <div className={styles.keyText}>{i}</div>
                            </DefaultButton>
                        </div>)
            }
            <div className={classnames(styles[`key-.`], styles.key)}>
                <DefaultButton className={styles.button}>
                    <div className={styles.keyText}>.</div>
                </DefaultButton>
            </div>
            <div className={classnames(styles[`key-+`], styles.key, styles.operatorKey)}>
                <DefaultButton className={styles.button}>
                    <div className={styles.keyText}>+</div>
                </DefaultButton>
            </div>
            <div className={classnames(styles[`key--`], styles.key, styles.operatorKey)}>
                <DefaultButton className={styles.button}>
                    <div className={styles.keyText}>-</div>
                </DefaultButton>
            </div>
            <div className={classnames(styles[`key-x`], styles.key, styles.operatorKey)}>
                <DefaultButton className={styles.button}>
                    <div className={styles.keyText}>×</div>
                </DefaultButton>
            </div>
            <div className={classnames(styles[`key-/`], styles.key, styles.operatorKey)}>
                <DefaultButton className={styles.button}>
                    <div className={styles.keyText}>÷</div>
                </DefaultButton>
            </div>
            <div className={classnames(styles[`key-=`], styles.key, styles.operatorKey)}>
                <PrimaryButton className={styles.button}>
                    <div className={styles.keyText}>=</div>
                </PrimaryButton>
            </div>
        </div >
    );
}