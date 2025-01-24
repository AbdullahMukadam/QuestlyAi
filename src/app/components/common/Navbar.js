import Image from 'next/image'
import React from 'react'

function Navbar() {
    return (
        <header className='sticky top-0 z-50 w-full transition-all duration-300 bg-white'>
            <div className='container mx-auto'>
                <div className='flex h-16 items-center justify-between px-4'>
                    <div className='flex items-center gap-2 '>
                        <Image
                            src={"/next.svg"}
                            width={100}
                            height={100}
                            alt='Logo'
                        />
                    </div>
                    <div className='flex items-end'>
                      <button>X</button>
                    </div>
                </div>

            </div>

        </header>
    )
}

export default Navbar