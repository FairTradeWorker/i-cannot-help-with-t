export const responsiveClasses = {
  container: 'mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl',
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
  heading: 'text-3xl sm:text-4xl lg:text-5xl font-black',
  button: 'w-full sm:w-auto px-6 py-4 text-base sm:text-lg min-h-12',
}

export const buttonStyles = {
  primary: 'bg-white dark:bg-zinc-900 text-black dark:text-white border-2 border-black dark:border-zinc-700 font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 active:scale-95 transition-all duration-200',
  secondary: 'bg-tool-blue text-white border-2 border-tool-blue font-bold hover:bg-sky-600 active:scale-95 transition-all duration-200',
}

export const pricing = [
  { tier: 'Tier 1', price: '$19.99/mo', features: ['Basic features', 'Up to 10 jobs/month', 'Email support'] },
  { tier: 'Tier 2', price: '$44.99/mo', features: ['Advanced features', 'Up to 50 jobs/month', 'Priority support', 'Analytics'] },
  { tier: 'Tier 3', price: '$79.99/mo', features: ['Premium features', 'Unlimited jobs', '24/7 support', 'Advanced analytics', 'API access'] },
  { tier: 'Enterprise', price: 'Call Us', features: ['Custom solutions', 'Dedicated account manager', 'SLA guarantee', 'White-label options'] },
]

export const cacheHeaders = {
  'Cache-Control': 's-maxage=60, stale-while-revalidate=30',
}
