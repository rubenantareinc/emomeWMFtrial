"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { EmomeLogo } from "@/components/emome-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  ["How it works", "#how-it-works"], ["Challenges", "#challenges"], ["Archetypes", "#archetypes"], ["Privacy", "#privacy"],
];
export function MarketingHeader(){
 const [open,setOpen]=useState(false); const [compact,setCompact]=useState(false);
 useEffect(()=>{const on=()=>setCompact(scrollY>24); on(); addEventListener('scroll',on,{passive:true}); return()=>removeEventListener('scroll',on)},[]);
 return <header className={cn("fixed inset-x-0 top-0 z-50 transition-all", compact?"py-2":"py-4")}><div className="mx-auto max-w-7xl px-4 md:px-6"><nav className="rounded-[26px] border border-white/75 bg-white/88 px-4 shadow-[0_18px_60px_rgba(80,34,20,.10)] backdrop-blur-xl md:px-5" aria-label="Main navigation"><div className={cn("flex items-center justify-between transition-all",compact?"h-14":"h-16")}><Link href="/" className="rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-500"><EmomeLogo className="h-11 w-36 md:w-40" /></Link><div className="hidden items-center gap-7 lg:flex">{nav.map(([l,h])=><a key={h} href={h} className="text-sm font-bold text-zinc-700 transition hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-500">{l}</a>)}<Link href="/sign-in" className="text-sm font-bold text-zinc-700 hover:text-rose-600">Sign in</Link><Button asChild className="rounded-full"><Link href="/sign-up">Start free</Link></Button></div><button className="grid size-11 place-items-center rounded-full border bg-white text-zinc-800 lg:hidden" aria-label="Open menu" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>{open&&<div className="grid gap-2 border-t py-4 lg:hidden">{nav.map(([l,h])=><a onClick={()=>setOpen(false)} key={h} href={h} className="rounded-2xl px-3 py-3 font-bold text-zinc-700 hover:bg-rose-50">{l}</a>)}<Link onClick={()=>setOpen(false)} href="/sign-in" className="rounded-2xl px-3 py-3 font-bold text-zinc-700 hover:bg-rose-50">Sign in</Link><Button asChild className="mt-2 rounded-full"><Link onClick={()=>setOpen(false)} href="/sign-up">Start free</Link></Button></div>}</nav></div></header>
}
