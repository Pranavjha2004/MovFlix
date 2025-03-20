import React from 'react'
import { useDebounce } from 'use-debounce';

const Search = ({searchTerm, setSearchTerm}) => {
    const [searchText] = useDebounce(searchTerm,3000)
  return (
    <div name="search">
        <span className='flex gap-6 border-2 w-[600px] h-12 justify-start items-center rounded-md g1Eff responsive relative group responsive-jio'>
        <svg className='ml-6' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
        </svg>
        
        <input 
            className='text-white w-[600px] outline-none responsive bg-transparent placeholder-gray-400 responsive-jio'
            type="text" 
            placeholder='Search through 100M+ movies online' 
            value={searchTerm} 
            onChange={(e)=>setSearchTerm(e.target.value)}
        />
        </span>
    </div>
  )
}

export default Search