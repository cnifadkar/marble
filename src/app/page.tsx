'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Zap, 
  Users, 
  Lock,
  StickyNote,
  Code2,
  Link2,
  ListTodo,
  Image,
  MousePointer2,
  Star,
  Github,
  Twitter,
  X
} from 'lucide-react'

const features = [
  {
    icon: StickyNote,
    title: 'Beautiful Notes',
    description: 'Capture thoughts in elegant cards that you can arrange freely on your canvas.',
    color: 'lavender',
  },
  {
    icon: Code2,
    title: 'Code Snippets',
    description: 'Store and organize code with syntax highlighting. Perfect for developers.',
    color: 'mint',
  },
  {
    icon: Link2,
    title: 'Rich Links',
    description: 'Save bookmarks with beautiful previews. Build your digital library.',
    color: 'sky',
  },
  {
    icon: ListTodo,
    title: 'Visual Tasks',
    description: 'Cluster related tasks together. See your progress at a glance.',
    color: 'amber',
  },
  {
    icon: Image,
    title: 'Images & Media',
    description: 'Add inspiration, references, and visual context to your thinking.',
    color: 'rose',
  },
  {
    icon: Sparkles,
    title: 'AI Assistant',
    description: 'Coming soon: Let AI help you organize, summarize, and connect ideas.',
    color: 'lavender',
  },
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '1 canvas',
      '50 nodes per canvas',
      'All node types',
      'Basic export',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'For power users and creators',
    features: [
      'Unlimited canvases',
      'Unlimited nodes',
      'AI Assistant',
      'Real-time collaboration',
      'Priority support',
      'Custom themes',
    ],
    cta: 'Join Waitlist',
    popular: true,
  },
  {
    name: 'Team',
    price: '$29',
    period: '/user/month',
    description: 'For teams building together',
    features: [
      'Everything in Pro',
      'Team workspaces',
      'Admin controls',
      'SSO & SAML',
      'API access',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

const testimonials = [
  {
    quote: "Finally, a tool that thinks the way I do. Marble changed how I organize my ideas.",
    author: "Alex Chen",
    role: "Product Designer",
    avatar: "A",
  },
  {
    quote: "I moved my entire second brain to Marble. The spatial layout is a game-changer.",
    author: "Sarah Kim",
    role: "Software Engineer",
    avatar: "S",
  },
  {
    quote: "Our team's brainstorming sessions became 10x more productive with Marble.",
    author: "Marcus Johnson",
    role: "Startup Founder",
    avatar: "M",
  },
]

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null)

  // Fetch real waitlist count
  useEffect(() => {
    fetch('/api/waitlist')
      .then(res => res.json())
      .then(data => {
        if (data.count !== undefined) {
          setWaitlistCount(data.count)
        }
      })
      .catch(() => {})
  }, [isSubmitted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsLoading(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      
      if (res.ok) {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error('Failed to join waitlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-marble-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-lavender to-accent-mint flex items-center justify-center">
              <span className="font-display font-bold text-white text-sm">M</span>
            </div>
            <span className="font-display font-bold text-lg">Marble</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm text-white/60 hover:text-white transition-colors">Testimonials</a>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/canvas"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Try Demo
            </Link>
            <button 
              onClick={() => setShowEmailModal(true)}
              className="px-4 py-2 rounded-lg bg-white text-marble-950 text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Get Early Access
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl bg-gradient-radial from-accent-lavender/40 to-transparent" />
          <div className="absolute top-40 right-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl bg-gradient-radial from-accent-mint/40 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-10 blur-3xl bg-gradient-radial from-accent-coral/30 to-transparent" />
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-lavender/10 border border-accent-lavender/20 mb-8">
              <Sparkles className="w-4 h-4 text-accent-lavender" />
              <span className="text-sm text-accent-lavender font-medium">Now in Early Access</span>
            </div>
            
            {/* Headline */}
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Your ideas deserve
              <br />
              <span className="gradient-text">infinite space</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              Marble is a beautiful spatial canvas for your second brain. 
              Capture thoughts, connect concepts, and organize your thinking visually.
            </p>
            
            {/* CTA Form */}
            <div className="max-w-md mx-auto">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 
                      text-white placeholder:text-white/30 focus:outline-none focus:border-accent-lavender/50
                      transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-lavender to-accent-mint
                      text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Join Waitlist
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-accent-mint/10 border border-accent-mint/20"
                >
                  <Check className="w-5 h-5 text-accent-mint" />
                  <span className="text-accent-mint font-medium">You&apos;re on the list! We&apos;ll be in touch soon.</span>
                </motion.div>
              )}
              
              <p className="text-sm text-white/40 mt-4">
                {waitlistCount !== null && waitlistCount > 0 
                  ? `Join ${waitlistCount.toLocaleString()} others on the waitlist.`
                  : 'Be the first to join the waitlist.'
                } No spam, ever.
              </p>
            </div>
          </motion.div>
          
          {/* Hero Image/Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-accent-lavender/10">
              {/* Browser chrome */}
              <div className="bg-marble-900 px-4 py-3 flex items-center gap-2 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-accent-coral/60" />
                  <div className="w-3 h-3 rounded-full bg-accent-amber/60" />
                  <div className="w-3 h-3 rounded-full bg-accent-mint/60" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="max-w-sm mx-auto px-4 py-1.5 rounded-lg bg-white/5 text-xs text-white/40 text-center">
                    marble.app/canvas
                  </div>
                </div>
              </div>
              
              {/* Canvas preview */}
              <div className="aspect-video bg-marble-950 relative canvas-grid">
                {/* Ambient orbs */}
                <div className="absolute top-10 right-20 w-40 h-40 rounded-full opacity-30 blur-2xl bg-accent-lavender/50" />
                <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full opacity-20 blur-2xl bg-accent-mint/50" />
                
                {/* Sample nodes */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="absolute top-12 left-16 w-64 p-4 rounded-xl bg-accent-lavender/10 border border-accent-lavender/30 backdrop-blur-xl"
                >
                  <div className="text-sm text-white/80">
                    💡 The best ideas come when you give them space to breathe...
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="absolute top-32 right-24 w-72 p-4 rounded-xl bg-accent-mint/10 border border-accent-mint/30 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-2 text-white/40 text-xs mb-2">
                    <Code2 className="w-3 h-3" />
                    <span>CODE</span>
                  </div>
                  <pre className="text-xs text-accent-mint/80 font-mono">
{`const marble = {
  ideas: infinite,
  possibilities: endless
}`}
                  </pre>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  className="absolute bottom-16 left-1/3 w-56 p-4 rounded-xl bg-accent-amber/10 border border-accent-amber/30 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-2 text-white/40 text-xs mb-2">
                    <ListTodo className="w-3 h-3" />
                    <span>TASKS</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent-mint" />
                      <span className="text-sm text-white/50 line-through">Build something cool</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-white/30" />
                      <span className="text-sm text-white/80">Take over the world</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 px-4 py-2 rounded-xl bg-marble-800 border border-white/10 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <MousePointer2 className="w-4 h-4 text-accent-lavender" />
                <span className="text-sm text-white/80">Drag anywhere</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-white/30">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">
                {waitlistCount !== null ? `${waitlistCount.toLocaleString()} on waitlist` : '... on waitlist'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-accent-amber" />
              <span className="text-sm font-medium">4.9/5 from beta users</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent-mint" />
              <span className="text-sm font-medium">50k+ nodes created</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <span className="text-sm font-medium">SOC 2 compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              Everything you need to think better
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Marble gives you the tools to capture, organize, and connect your ideas in a beautiful spatial environment.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              const colorClasses: Record<string, string> = {
                lavender: 'bg-accent-lavender/10 text-accent-lavender border-accent-lavender/20',
                mint: 'bg-accent-mint/10 text-accent-mint border-accent-mint/20',
                sky: 'bg-accent-sky/10 text-accent-sky border-accent-sky/20',
                amber: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
                rose: 'bg-accent-rose/10 text-accent-rose border-accent-rose/20',
              }
              
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className={`inline-flex p-3 rounded-xl border ${colorClasses[feature.color]} mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/50 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-10 blur-3xl bg-gradient-radial from-accent-lavender/40 to-transparent" />
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Start for free, upgrade when you need more power.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`relative p-8 rounded-2xl border transition-all ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-accent-lavender/10 to-transparent border-accent-lavender/30' 
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent-lavender text-white text-xs font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="font-display text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-white/50 text-sm">{plan.description}</p>
                </div>
                
                <div className="mb-6">
                  <span className="font-display text-4xl font-bold">{plan.price}</span>
                  <span className="text-white/50">{plan.period}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-accent-mint flex-shrink-0" />
                      <span className="text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-accent-lavender to-accent-mint text-white hover:opacity-90'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              Loved by thinkers everywhere
            </h2>
            <p className="text-xl text-white/50">
              Join thousands who have transformed how they organize ideas.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent-amber fill-accent-amber" />
                  ))}
                </div>
                <p className="text-white/70 leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-lavender to-accent-mint flex items-center justify-center font-medium">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-white/50">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Ready to think <span className="gradient-text">differently</span>?
            </h2>
            <p className="text-xl text-white/50 mb-10">
              Join the waitlist and be first to experience Marble when we launch.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/canvas"
                className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium
                  hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Try the Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
<button
                  onClick={() => setShowEmailModal(true)}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-accent-lavender to-accent-mint
                    text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Get Early Access
                  <Sparkles className="w-4 h-4" />
                </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEmailModal(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md p-8 rounded-2xl glass border border-white/10 shadow-2xl"
            >
              <button
                onClick={() => setShowEmailModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-accent-lavender/20 to-accent-mint/20 mb-4">
                  <Sparkles className="w-7 h-7 text-accent-lavender" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">Get Early Access</h3>
                <p className="text-white/50">Join the waitlist and be first to try Marble.</p>
              </div>
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
                      text-white placeholder:text-white/30 focus:outline-none focus:border-accent-lavender/50
                      transition-colors"
                    required
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-lavender to-accent-mint
                      text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Join Waitlist
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-accent-mint/10 border border-accent-mint/20">
                  <Check className="w-5 h-5 text-accent-mint" />
                  <span className="text-accent-mint font-medium">You&apos;re on the list!</span>
                </div>
              )}
              
              <p className="text-xs text-white/30 text-center mt-4">
                No spam, ever. Unsubscribe anytime.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-lavender to-accent-mint flex items-center justify-center">
                <span className="font-display font-bold text-white text-sm">M</span>
              </div>
              <span className="font-display font-bold text-lg">Marble</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-white/50">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Blog</a>
              <a href="#" className="hover:text-white transition-colors">Changelog</a>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Twitter className="w-5 h-5 text-white/50 hover:text-white" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Github className="w-5 h-5 text-white/50 hover:text-white" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-white/30">
            © 2025 Marble. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
