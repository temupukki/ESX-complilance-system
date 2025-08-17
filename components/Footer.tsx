import {
  FiTwitter,
  FiGithub,
  FiLinkedin,
} from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="py-8 mt-12 bg-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">ESX Platform</h3>
            <p className="text-sm text-white">
              Empowering document workflows and company insights with precision and speed.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white">
              <li><a href="/" className="hover:text-blue-500 transition-colors">Home</a></li>
              <li><a href="/document" className="hover:text-blue-500 transition-colors">View Document</a></li>
              <li><a href="/upload" className="hover:text-blue-500 transition-colors">Upload Document</a></li>
              <li><a href="/companies" className="hover:text-blue-500 transition-colors">Registered Companies</a></li>
            </ul>
          </div>

          {/* Social Icons */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Connect</h3>
            <div className="flex space-x-4 mt-2">
              <a href="#" aria-label="Twitter" className="text-white hover:text-blue-500 transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" aria-label="GitHub" className="text-white hover:text-blue-500 transition-colors">
                <FiGithub size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-white hover:text-blue-500 transition-colors">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t pt-4 text-sm text-center text-white">
          &copy; {new Date().getFullYear()} ESX Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
