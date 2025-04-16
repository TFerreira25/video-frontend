'use client'
import Image from "next/image";
import {MagnifyingGlassIcon, FunnelIcon} from "@heroicons/react/24/solid";
import { useState } from 'react';
import { useVideoFilters } from '../store/videoFilters';

export default function Header() {
    const [showFilters, setShowFilters] = useState(false);
    const { locale, setLocale, size, setSize } = useVideoFilters();

    return (
        <div className='relative mt-0 h-20 flex items-center bg-black bg-opacity-50 text-white px-4'>
            <div className="flex items-center">
                <Image src='/pexels.png' alt='pexels' width={50} height={50} className='mr-2' />
                <p className='text-2xl'>Pexels</p>
            </div>

            {/* CENTRADO EM ECRÃS GRANDES */}
            <div className="w-full sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:w-auto flex justify-end">
                <div className="flex items-center gap-1">
                    <input type='text' placeholder='Pexels' className="text-black bg-white px-6 py-2 rounded lg:w-[40rem] md:w-[20rem]" />
                    <button className='bg-[#10B981] p-2 rounded-lg'><MagnifyingGlassIcon className="size-6 text-white"/></button>
                    <button
                      className='bg-[#10B981] p-2 rounded-lg'
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <FunnelIcon className="size-6 text-white"/>
                    </button>
                    {showFilters && (
                      <div className="absolute top-14 lg:left-[20rem] left-1/2 transform -translate-x-1/2 bg-gray-200 rounded shadow-md p-4 md:w-[640px] sm:w-[500px]  z-50">
                        <div className="border-b pb-2 mb-2">
                          <h3 className="font-semibold text-black">Localidades</h3>
                          <div className="flex gap-4 mt-2">
                          <button
                              onClick={() => setLocale('es-ES')}
                              className={`${locale === 'es-ES' ? 'bg-teal-500 text-white' : 'bg-gray-400 text-black'} px-3 py-1 rounded`}
                          >
                              Espanha
                          </button>
                          <button
                              onClick={() => setLocale('it-IT')}
                              className={`${locale === 'it-IT' ? 'bg-teal-500 text-white' : 'bg-gray-400 text-black'} px-3 py-1 rounded`}
                          >
                              Itália
                          </button>
                          <button
                              onClick={() => setLocale('ja-JP')}
                              className={`${locale === 'ja-JP' ? 'bg-teal-500 text-white' : 'bg-gray-400 text-black'} px-3 py-1 rounded`}
                          >
                              Japão
                          </button>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-black">Resoluções</h3>
                          <div className="flex gap-4 mt-2">
                            <button
                              onClick={() => setSize('medium')}
                              className={`${size === 'medium' ? 'bg-teal-500 text-white' : 'bg-gray-400 text-black'} px-3 py-1 rounded`}
                            >
                              HD
                            </button>
                            <button
                              onClick={() => setSize('large')}
                              className={`${size === 'large' ? 'bg-teal-500 text-white' : 'bg-gray-400 text-black'} px-3 py-1 rounded`}
                            >
                              Full HD
                            </button>
                            <button
                              onClick={() => setSize('small')}
                              className={`${size === 'small' ? 'bg-teal-500 text-white' : 'bg-gray-400 text-black'} px-3 py-1 rounded`}
                            >
                              4K
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                </div>

            </div>
        </div>
    );
}
