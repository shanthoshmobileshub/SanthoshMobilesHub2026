import React from 'react'
import Hero from '../components/Hero'
import CategoryIcons from '../components/CategoryIcons'
import DeviceCategoryGrid from '../components/DeviceCategoryGrid'
import SellFlow from '../components/SellFlow'
import ActionBanners from '../components/ActionBanners'
import TrustRow from '../components/TrustRow'
import BrandSlider from '../components/BrandSlider'
import Footer from '../components/Footer'

export default function Home(){
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Hero />
        <CategoryIcons />
        <DeviceCategoryGrid />
        <SellFlow />
        <ActionBanners />
        <TrustRow />
        <BrandSlider />
      </main>
      <Footer />
    </div>
  )
}
