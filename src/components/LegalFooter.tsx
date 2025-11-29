export function LegalFooter() {
  return (
    <footer className="mt-auto" style={{ backgroundColor: '#1f2937', paddingTop: '48px', paddingBottom: '48px' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: For Homeowners */}
          <div>
            <h4 className="font-semibold mb-4 text-white">
              For Homeowners
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: '#9ca3af' }}
                >
                  Post a Job
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: '#9ca3af' }}
                >
                  How It Works
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: '#9ca3af' }}
                >
                  Find Contractors
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: For Pros */}
          <div>
            <h4 className="font-semibold mb-4 text-white">
              For Pros
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: '#9ca3af' }}
                >
                  Join as Contractor
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: '#9ca3af' }}
                >
                  Territories
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: '#9ca3af' }}
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Developers */}
          <div>
            <h4 className="font-semibold mb-4 text-white">
              Developers
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: '#9ca3af' }}
                >
                  API Documentation
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: '#9ca3af' }}
                >
                  Developer Portal
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: '#9ca3af' }}
                >
                  Enterprise Solutions
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="font-semibold mb-4 text-white">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: '#9ca3af' }}
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: '#9ca3af' }}
                >
                  Partners
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: '#9ca3af' }}
                >
                  Contact
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: '#9ca3af' }}
                >
                  Terms
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: '#9ca3af' }}
                >
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6" style={{ borderColor: '#374151' }}>
          <p className="text-sm text-center" style={{ color: '#9ca3af' }}>
            © 2024 FairTradeWorker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
