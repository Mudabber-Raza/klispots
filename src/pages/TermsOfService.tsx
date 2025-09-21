import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Scale, AlertTriangle, Users, Globe } from 'lucide-react';
import Footer from '@/components/layout/Footer';

const TermsOfService = () => {
  return (
    <>
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-gray-600 mt-2">Last updated: January 20, 2025</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            
            {/* Introduction */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FileText className="w-6 h-6 text-emerald-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Agreement to Terms</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Welcome to KLIspots! These Terms of Service ("Terms") govern your use of our website 
                klispots.com and our services for discovering restaurants, cafes, shopping venues, 
                and entertainment options across Pakistan. By accessing or using our services, you agree 
                to be bound by these Terms.
              </p>
            </div>

            {/* Acceptance of Terms */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By using KLIspots, you acknowledge that you have read, understood, and agree to be bound 
                by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not 
                use our services.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-1">Important Notice</h3>
                    <p className="text-yellow-700 text-sm">
                      These Terms constitute a legally binding agreement between you and KLIspots. 
                      Please read them carefully.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description of Service */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Globe className="w-6 h-6 text-emerald-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Description of Service</h2>
              </div>
              <p className="text-gray-700 mb-4">
                KLIspots is a lifestyle discovery platform that helps users find and explore:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Restaurants and dining establishments</li>
                <li>Cafes and coffee shops</li>
                <li>Shopping malls and retail venues</li>
                <li>Entertainment and recreational facilities</li>
                <li>Arts and cultural venues</li>
                <li>Sports and fitness centers</li>
                <li>Health and wellness services</li>
              </ul>
              
              <p className="text-gray-700 mt-4">
                We provide information, reviews, ratings, contact details, and other relevant data 
                to help you make informed decisions about venues across Pakistan.
              </p>
            </div>

            {/* User Responsibilities */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-emerald-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">User Responsibilities</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Permitted Use</h3>
                  <p className="text-gray-700 mb-2">You may use our services for:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Personal, non-commercial purposes</li>
                    <li>Researching venues and making informed decisions</li>
                    <li>Accessing contact information and venue details</li>
                    <li>Reading reviews and ratings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Prohibited Activities</h3>
                  <p className="text-gray-700 mb-2">You may not:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Use our services for any illegal or unauthorized purpose</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with or disrupt our services</li>
                    <li>Use automated systems to access our website</li>
                    <li>Copy, modify, or distribute our content without permission</li>
                    <li>Submit false, misleading, or fraudulent information</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Content and Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Content and Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Accuracy of Information</h3>
                  <p className="text-gray-700">
                    While we strive to provide accurate and up-to-date information about venues, 
                    we cannot guarantee the accuracy, completeness, or timeliness of all information. 
                    Venue details, hours, prices, and other information may change without notice.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Third-Party Content</h3>
                  <p className="text-gray-700">
                    Our website may contain content from third parties, including venue owners, 
                    users, and other sources. We do not endorse or guarantee the accuracy of 
                    third-party content.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">User-Generated Content</h3>
                  <p className="text-gray-700">
                    If you submit reviews, ratings, photos, or other content to our platform, 
                    you grant us a non-exclusive, royalty-free license to use, display, and 
                    distribute such content in connection with our services.
                  </p>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The KLIspots website, including its design, content, logos, and functionality, 
                is protected by copyright, trademark, and other intellectual property laws. 
                You may not use our intellectual property without our written permission.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Respect for Venue Owners</h3>
                <p className="text-gray-700 text-sm">
                  We respect the intellectual property rights of venue owners. If you believe 
                  your content has been used inappropriately, please contact us.
                </p>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Scale className="w-6 h-6 text-emerald-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Service Availability</h3>
                  <p className="text-gray-700">
                    We strive to maintain continuous service availability, but we cannot guarantee 
                    uninterrupted access. Our services may be temporarily unavailable due to 
                    maintenance, technical issues, or other factors beyond our control.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Venue Experiences</h3>
                  <p className="text-gray-700">
                    We are not responsible for your experiences at venues listed on our platform. 
                    Venue quality, service, pricing, and availability are beyond our control. 
                    Please verify information directly with venues before visiting.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Damages</h3>
                  <p className="text-gray-700">
                    To the maximum extent permitted by law, KLIspots shall not be liable for any 
                    indirect, incidental, special, or consequential damages arising from your use 
                    of our services.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy</h2>
              <p className="text-gray-700">
                Your privacy is important to us. Please review our Privacy Policy to understand 
                how we collect, use, and protect your information. By using our services, you 
                consent to the collection and use of information as described in our Privacy Policy.
              </p>
            </div>

            {/* Termination */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-700">
                We may terminate or suspend your access to our services at any time, with or without 
                notice, for any reason, including violation of these Terms. You may also stop using 
                our services at any time.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. We will notify users of 
                significant changes by posting the updated Terms on our website. Your continued 
                use of our services after changes constitutes acceptance of the new Terms.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-700">
                These Terms shall be governed by and construed in accordance with the laws of 
                Pakistan. Any disputes arising from these Terms or your use of our services shall 
                be subject to the exclusive jurisdiction of the courts of Pakistan.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-emerald-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> hello@klispots.com</p>
                <p><strong>Phone:</strong> +92 300 123 4567</p>
                <p><strong>Website:</strong> www.klispots.com</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default TermsOfService;
