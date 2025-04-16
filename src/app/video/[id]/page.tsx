'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useVideoFilters } from '../../store/videoFilters';

interface VideoData {
    id: number;
    width: number;
    height: number;
    duration: number;
    user_name: string;
    video_files: {
        id: number;
        quality: string;
        file_type: string;
        width: number;
        height: number;
        link: string;
    }[];
}

export default function VideoPage() {
    const params = useParams()
    const id = params?.id as string
    const { size } = useVideoFilters();
    const [loading, setLoading] = useState(true)
    const [videoData, setVideoData] = useState<VideoData | null>(null)

    useEffect(() => {
        if (!id) return

        const fetchVideo = async () => {
            try {
                // Substitui esta URL pela tua API real
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/${id}`, {
                    headers: {
                        'X-API-TOKEN': process.env.NEXT_PUBLIC_API_TOKEN as string,
                    },
                });
                const data = await res.json()
                setVideoData(data)
            } catch (err) {
                console.error('Erro ao buscar vídeo:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchVideo()
    }, [id])

    if (loading) return <p className="text-white text-center mt-10">A carregar vídeo...</p>

    if (!videoData) return <p className="text-white text-center mt-10">Vídeo não encontrado.</p>
    const bestFile =
        size === ''
            ? videoData.data.video_files?.[0]
            : videoData.data.video_files?.find((file) => {
                if (size === 'small') return file.quality === 'uhd';
                if (size === 'medium') return file.quality === 'hd';
                if (size === 'large') return file.quality === 'fullhd' || file.quality === 'hd';
                return false;
            }) || videoData.data.video_files?.[0];

    console.log(bestFile);
    return (
        <div className="bg-[#222] min-h-screen flex flex-col items-center justify-center p-6">
            <video
                controls
                className="w-full max-w-6xl h-[500px] bg-black"
                src={bestFile?.link}
            />
            <div className="text-white w-full max-w-6xl p-4">
                <p className="text-sky-500 font-semibold">{videoData.data.user_name}</p>
                <p>ID: {videoData.data.id}</p>
                <p>Resolução: {bestFile.quality}</p>
                <p>Duração: {videoData.data.duration}s</p>
            </div>
        </div>
    )
}
