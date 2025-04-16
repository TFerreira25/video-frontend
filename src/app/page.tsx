'use client'
import Link from 'next/link';

interface Video {
  id: number;
  width: number;
  height: number;
  duration: number;
  user_name: string;
  video_files: any[]; // podes tipar melhor se souberes a estrutura
  video_pictures: { id: number; nr: number; picture: string }[];
}
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image'
import { useVideoFilters } from './store/videoFilters';

export default function Home() {
  const { size, locale } = useVideoFilters();
  const perPage = 16;
  const [videos, setVideos] = useState<Video[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isGrid, setIsGrid] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
        const params = new URLSearchParams({
          page: String(currentPage),
          per_page: String(isGrid ? perPage : 10),
        });

        if (size) params.append('size', size);
        if (locale) params.append('locale', locale);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos?${params.toString()}`, {
          headers: {
            'X-API-TOKEN': process.env.NEXT_PUBLIC_API_TOKEN as string,
          },
        });
      const data = await response.json();
      setVideos(Array.isArray(data.data.items) ? data.data.items : []);
      setTotal(data.data.total_pages);
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, size, locale, isGrid]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const totalPages = total;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
      <div className="mx-10 my-8">
        <div className="flex justify-end items-end gap-6">
            <button
                className={`p-2 rounded ${isGrid ? 'bg-[#10B981]' : 'bg-white'} hover:opacity-80`}
                onClick={() => setIsGrid(true)}
            >
                <Image src="/grid.svg" className="w-8 h-8" alt="teste2" width={100} height={100} />
            </button>

            <button
                className={`p-2 rounded ${!isGrid ? 'bg-[#10B981]' : 'bg-white'} hover:opacity-80`}
                onClick={() => setIsGrid(false)}
            >
                <Image src="/list.svg" className="w-8 h-8" alt="teste" width={50} height={50} />
            </button>
        </div>
        {loading && (
          <div className="text-center py-8 text-lg text-gray-600 animate-pulse">
            A carregar vídeos...
          </div>
        )}
        {!loading && (
          <>
            <div className={isGrid ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 items-center justify-center gap-4 mt-2' : 'grid grid-cols-1'}>
              {videos.map((video: Video, index) => (
                <Link href={`video/${video.id}`} key={index}>
                  <div className="flex cursor-pointer hover:opacity-90">
                    <div>
                      <img src={video.video_pictures?.[0]?.picture || '/fallback.png'} alt={`video-${index}`} className='md:w-[320px] lg:w-[500px] h-75 object-cover object-center' />
                    </div>
                    <div className={`${isGrid ? 'block md:hidden' : 'block'} ml-4`}>
                      <p className="text-xl text-[#10B981] font-bold">{video.user_name}</p>
                      <p>ID: {video.id}</p>
                      <p>Duração: {video.duration}s</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div id={'pagination'} className="justify-end items-end flex">
              <div className="flex justify-center mt-4 gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-black"
                >
                  Anterior
                </button>

                {currentPage > 2 && (
                  <>
                    <button
                      onClick={() => goToPage(1)}
                      className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-[#10B981] text-white' : 'bg-white text-black'}`}
                    >
                      1
                    </button>
                    {currentPage > 3 && <span className="px-2">...</span>}
                  </>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => Math.abs(currentPage - page) <= 1)
                  .map(page => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1 rounded ${currentPage === page ? 'bg-[#10B981] text-white' : 'bg-white text-black'}`}
                    >
                      {page}
                    </button>
                  ))}

                {currentPage < totalPages - 1 && (
                  <>
                    {currentPage < totalPages - 2 && <span className="px-2">...</span>}
                    <button
                      onClick={() => goToPage(totalPages)}
                      className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-[#10B981] text-white' : 'bg-white text-black'}`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-black"
                >
                  Seguinte
                </button>
              </div>
            </div>
          </>
        )}
      </div>
  );
}
