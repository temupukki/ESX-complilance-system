// app/dashboard/profile/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  image?: string; // This contains "headquartersAddress - licenseNumber" based on your registration
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    bankName: '',
    adminName: '',
    email: '',
    headquartersAddress: '',
    licenseNumber: '',
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          
          // Parse the name field to extract bank name and admin name
          const nameParts = userData.name?.split(' - ') || ['', ''];
          const bankName = nameParts[0] || '';
          const adminName = nameParts[1] || '';
          
          // Parse the image field to extract address and license
          const imageParts = userData.image?.split(' - ') || ['', ''];
          const headquartersAddress = imageParts[0] || '';
          const licenseNumber = imageParts[1] || '';
          
          setFormData({
            bankName,
            adminName,
            email: userData.email || '',
            headquartersAddress,
            licenseNumber,
          });
        } else {
          setError('Failed to fetch user data');
        }
      } catch (err) {
        setError('Error fetching user data');
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare the data in the format your API expects
      const updateData = {
        name: `${formData.bankName} - ${formData.adminName}`,
        email: formData.email,
        image: `${formData.headquartersAddress} - ${formData.licenseNumber}`,
      };

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        // Redirect back to profile page after a short delay
        setTimeout(() => {
          router.push('/dashboard/profile');
        }, 1500);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Edit Issuer Profile
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">Issuer Information</h2>
          
          <div className="mb-3">
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
              Issuer Name
            </label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter bank name"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="headquartersAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Headquarters Address
            </label>
            <input
              type="text"
              id="headquartersAddress"
              name="headquartersAddress"
              value={formData.headquartersAddress}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter headquarters address"
            />
          </div>

          <div>
            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
              License Number
            </label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter license number"
            />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-green-800 mb-3">Admin Information</h2>
          
          <div className="mb-3">
            <label htmlFor="adminName" className="block text-sm font-medium text-gray-700 mb-1">
              Admin Name
            </label>
            <input
              type="text"
              id="adminName"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter admin name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
          
          <Link
            href="/dashboard/profile"
            className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}