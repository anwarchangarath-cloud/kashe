import Hero from '../components/home/Hero.jsx'
import TrustBar from '../components/home/TrustBar.jsx'
import CategoryCircles from '../components/home/CategoryCircles.jsx'
import DealsOfTheDay from '../components/home/DealsOfTheDay.jsx'
import EditBanner from '../components/home/EditBanner.jsx'
import PromoTiles from '../components/home/PromoTiles.jsx'
import ServiceFeatures from '../components/home/ServiceFeatures.jsx'

// Homepage — composes the sections top→bottom exactly as 01_homepage_premium.jpg.
export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16">
      <div className="pt-6">
        <Hero />
      </div>
      <TrustBar />
      <CategoryCircles />
      <DealsOfTheDay />
      <div className="mt-6 space-y-6">
        <EditBanner />
        <PromoTiles />
        <ServiceFeatures />
      </div>
    </div>
  )
}
