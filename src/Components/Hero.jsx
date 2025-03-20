import React from 'react'
import heroImg from '/Users/jhapr/Desktop/MovFlix/MovFlix/src/assets/hero.png'

const Hero = () => {
  return (
    <>
    <div className='text-white flex flex-col justfy-center items-center'>
    <img className='w-82' src={heroImg} alt="hero-img" />
    <h1 className='text-5xl text-center my-8'>Find <span className='hero-text'>Movies</span> You'll Love <br />Without the Hassle</h1>
    </div>
    </>
  )
}

export default Hero