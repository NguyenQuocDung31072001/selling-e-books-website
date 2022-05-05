import React from 'react';
import { useSpring, animated } from '@react-spring/web'
const DashboardAdmin = () => {
    const user=useSpring({users:200,from:{users:0}})
    return (
        <div>
            <div className='flex justify-around'>
                <div className='bg-white w-[270px] h-[113px]'>
                    <animated.div>
                        {user.users.to((val)=>Math.floor(val))}
                    </animated.div>
                </div>
                <div className='bg-white w-[270px] h-[113px]'>

                </div>
                <div className='bg-white w-[270px] h-[113px]'>

                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;