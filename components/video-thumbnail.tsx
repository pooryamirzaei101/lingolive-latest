import {parseThumbnailSettings,thumbnailRatio} from '@/lib/thumbnails';
export function VideoThumbnail({id,format,thumbnailKey,settings,title}:{id:string;format:string;thumbnailKey:string|null;settings:string;title:string}){
 const position=parseThumbnailSettings(settings);
 return <div className="video-thumbnail" style={{aspectRatio:thumbnailRatio(format)}}>{thumbnailKey?<img src={`/api/video-lessons/${id}/thumbnail?k=${encodeURIComponent(thumbnailKey)}`} alt={`${title} thumbnail`} loading="lazy" style={{objectFit:position.fit,objectPosition:`${position.x}% ${position.y}%`,transform:`scale(${position.zoom})`}}/>:<div className="thumbnail-placeholder"><span>LingoLive</span><strong>{title}</strong></div>}</div>
}
