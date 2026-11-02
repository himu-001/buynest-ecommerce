import React, { use, useContext } from 'react'
import { AppContext } from '../Context/AppContext';

const Hotels = () => {

  const { hotelData } = useContext(AppContext);

  return (
    <div
      className='py-24 max-w-7xl mx-auto'
    >
      <h1 className='text-3xl font-semibold text-heading my-8 px-2 text-center'>All Hotels</h1>
      <div className='flex flex-wrap items-center justify-center mt-12 gap-4 max-w-5xl mx-auto'>
                {(hotelData || []).map((item, index) =>
                (
                    <div
                        key={index}
                        animate={{ y: [0, -30, 0] }}
                        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }} className='relative group rounded-lg overflow-hidden cursor-pointer'
                    > 
                        <img src={`http://localhost:3000/images/${item.image}`}
                            alt=""
                            className='size-56 object-cover object-top'
                        />
                        <div
                            className='absolute inset-0 flex flex-col justify-end p-4 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300'
                        >
                            <h1 className='text-lg font-medium'>{item.hotelName}</h1>
                            <p className='text-sm'>{item.hotelAddress}</p>
                            <h1 className='text-lg font-medium'>${item.price}</h1>
                        </div>
                    </div>
                ))}
            </div>
    </div>
  )
}

export default Hotels