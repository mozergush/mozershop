'use client'
/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react'
import FOG from 'vanta/dist/vanta.fog.min'

export default function VantaBackground() {
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const myRef = useRef(null)
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(FOG({
        el: myRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        highlightColor: 0xd7ffdc,
        midtoneColor: 0xededed,
        lowlightColor: 0xff50c2,
        baseColor: 0xf5f5ff,
        blurFactor: 0.54,
        speed: 1.70,
        zoom: 0.80
      }))
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <div ref={myRef} className={'vanta-container'} />
  )
}
