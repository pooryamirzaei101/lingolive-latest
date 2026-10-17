"use client";
import {createBrowserClient} from "@supabase/ssr";
export type SupabasePublicConfig={url:string;publishableKey:string};
export function createSupabaseBrowserClient(config:SupabasePublicConfig){if(!config.url||!config.publishableKey)throw Error("Account services are not configured yet.");return createBrowserClient(config.url,config.publishableKey)}
