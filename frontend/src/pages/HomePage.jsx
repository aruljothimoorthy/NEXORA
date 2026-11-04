import HeroSection from '../components/landing/HeroSection'
import DashboardPreview from '../components/landing/DashboardPreview'
import FeaturesSection from '../components/landing/FeaturesSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import PricingSection from '../components/landing/PricingSection'
import TestimonialsSection from '../components/landing/TestimonialsSection'
import FAQSection from '../components/landing/FAQSection'
import CTASection from '../components/landing/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DashboardPreview />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
