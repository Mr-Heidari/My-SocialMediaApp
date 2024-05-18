import Buttombar from '@/components/ui/shared/Buttombar'
import LeftSidebar from '@/components/ui/shared/LeftSidebar'
import RightSideBar from '@/components/ui/shared/RightSideBar'
import Topbar from '@/components/ui/shared/Topbar'


import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className='w-full md:flex   ' >
      <Topbar/>
      <LeftSidebar/>
      
      <section className='flex flex-1 '>
        <Outlet/>
      </section>
      <RightSideBar/>
      <Buttombar/>
    </div>
  )
}
export default RootLayout