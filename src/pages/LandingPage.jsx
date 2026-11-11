import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Hero from '../components/landing/Hero'
import StatsBar from '../components/landing/StatsBar'
import HowItWorks from '../components/landing/HowItWorks'
import FeaturesGrid from '../components/landing/FeaturesGrid'
import DashboardPreview from '../components/landing/DashboardPreview'
import AISpotlight from '../components/landing/AISpotlight'
import Testimonials from '../components/landing/Testimonials'
import FAQ from '../components/landing/FAQ'
import CTABanner from '../components/landing/CTABanner'

export default function LandingPage() {
  return (
    <div className="bg-light-bg dark:bg-dark-bg min-h-screen">
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <FeaturesGrid />
      <DashboardPreview />
      <AISpotlight />
      <Testimonials />
      <FAQ />
      <CTABanner />
      <Footer />
    </div>
  )
}