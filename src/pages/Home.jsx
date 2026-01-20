import React from 'react'
import PostImage from '../components/PostImage';
import LuxuryExperience from '../components/LuxuryExperience'
import OffersCarousel from '../components/OffersCarousel'
import CategoryIcons from '../components/CategoryIcons'
import ActionBanners from '../components/ActionBanners'
import TrustRow from '../components/TrustRow'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <OffersCarousel />
        <PostImage />
        <CategoryIcons />
        <ActionBanners />
        <TrustRow />
        <LuxuryExperience />
      </main>
      <Footer />
    </div>
  )
}
