import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    title: '10 Social Media Posts',
    description: 'Get 3 Twitter, 3 LinkedIn, 2 Facebook, and 2 Instagram posts ready to publish.',
  },
  {
    title: 'Newsletter Summary',
    description: 'Professional newsletter format with hooks, key points, and CTAs.',
  },
  {
    title: 'Video Script',
    description: '60-90 second video script with timing notes and visual cues.',
  },
  {
    title: 'YouTube Integration',
    description: 'Paste a YouTube URL and let AI extract the transcript automatically.',
  },
];

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    credits: '3',
    features: ['3 credits per month', 'Basic content types', 'Community support'],
  },
  {
    name: 'Starter',
    price: '$29',
    credits: '30',
    features: ['30 credits per month', 'Priority processing', 'Email support'],
    popular: true,
  },
  {
    name: 'Pro',
    price: '$79',
    credits: '100',
    features: ['100 credits per month', 'Custom tones', 'Export options', 'Priority support'],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-24 px-6 text-center">
          <div className="container max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Turn One Content Piece Into{' '}
              <span className="text-primary-600">12+ Assets</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Upload your blog post, article, or paste a YouTube URL. 
              Get 10 social posts, a newsletter, and a video script in minutes.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg">Start Free</Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 px-6 bg-slate-50">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What You Get</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="container max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {pricingTiers.map((tier, i) => (
                <Card key={i} className={tier.popular ? 'border-primary-500 ring-2 ring-primary-500' : ''}>
                  <CardContent className="p-6">
                    {tier.popular && (
                      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full mb-4">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-xl font-semibold">{tier.name}</h3>
                    <div className="my-4">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-slate-500">/month</span>
                    </div>
                    <p className="text-2xl font-semibold text-primary-600 mb-4">
                      {tier.credits} credits
                    </p>
                    <ul className="space-y-2 mb-6">
                      {tier.features.map((feature, j) => (
                        <li key={j} className="flex items-center text-sm text-slate-600">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/auth/register" className="block">
                      <Button className="w-full" variant={tier.popular ? 'primary' : 'outline'}>
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}