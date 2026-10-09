"use client";
import { useEffect } from "react";
export default function ConnectionGate(){
 useEffect(()=>{const script=document.createElement("script");script.type="module";script.src="/preview-gate.mjs";document.body.appendChild(script);return()=>{script.remove();document.getElementById("prospeva-preview-banner")?.remove();};},[]);
 return null;
}
