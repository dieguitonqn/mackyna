'use client'
import { useEffect } from 'react';
import React from 'react';
import Image from 'next/image';

export const Wap = () => {

    useEffect(() => {
        const hanleScroll = () => {
            const wapLinkElement = document.querySelector('.wap_link');
            if (window.scrollY > 50) {
                wapLinkElement?.classList.add('visible');
            } else {
                wapLinkElement?.classList.remove('visible');
            }
        }
        window.addEventListener('scroll', hanleScroll);
        return () => {
            window.removeEventListener('scroll', hanleScroll);
        }
    }, []);

            return (
                <div>
                    <a href="https://api.whatsapp.com/send?phone=2994 63-0512&text=¡Hola! ¡Quiero empezar con ustedes! :D &type=phone_number&app_absent=0" target="_blank" rel="norefereer noopener" className='wap_link relative'>
                        <span className='absolute left-[7px] top-[7px] -z50 size-10'>
                            <span className='flex size-full items-center justify-center animate-ping rounded-md bg-green-500 opacity-75'> </span>

                        </span>
                        <Image
                            src="/wap.png"
                            alt='logo wap'
                            width={40}
                            height={40}
                            className='z-50 wap_icon'
                        />


                    </a>

                </div>
            )
        }