'use client';
import {mediaSections,type MediaSection} from '@/lib/media-sections';
export function MediaSectionPicker({initial=[]}:{initial?:MediaSection[]}){return <fieldset className="media-section-picker"><legend>Show this content in</legend><p>Select one or more sections. The same media and reviewed transcript are reused.</p><div className="media-placement-grid">{Object.entries(mediaSections).map(([id,label])=><label key={id}><input type="checkbox" name="sections" value={id} defaultChecked={initial.includes(id as MediaSection)}/>{label}</label>)}</div></fieldset>}
