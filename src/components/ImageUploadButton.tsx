'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { processImages } from '../services/imageProcessing';
import { useUserStore } from '../store/userStore';

export const ImageUploadButton = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { setUser, user } = useUserStore();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !files.length || !user) {
      console.log('Upload cancelled or no files selected');
      return;
    }

    console.log(`Starting to process ${files.length} image(s)`);
    setIsProcessing(true);

    try {
      // Process all files in a single batch
      console.log('Processing files:', Array.from(files).map(f => f.name));
      const result = await processImages(Array.from(files));
      
      console.log('Total transactions found:', result.transactions.length);
      console.log('Transaction summary:', result.transactions.map(t => ({
        date: t.timestamp,
        amount: t.amount,
        type: t.type,
        category: t.category,
        description: t.description
      })));
      
      // Calculate new balance
      const newBalance = result.balance || user.balance;
      console.log('Balance update:', {
        oldBalance: user.balance,
        newBalance: newBalance,
        difference: newBalance - user.balance
      });

      // Update user state
      console.log('Updating user state with new data...');
      setUser({
        ...user,
        balance: newBalance,
        transactions: [...result.transactions, ...user.transactions]
      });
      console.log('User state updated successfully');

    } catch (error) {
      console.error('Failed to process images:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      // You might want to show an error toast/notification here
    } finally {
      console.log('Processing complete, resetting state');
      setIsProcessing(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
        id="image-upload"
        disabled={isProcessing}
      />
      <label
        htmlFor="image-upload"
        className={`
          p-2 rounded-full
          hover:bg-gray-100 dark:hover:bg-gray-800
          cursor-pointer transition-colors
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        title="Upload bank statements"
      >
        <Sparkles className={`w-6 h-6 text-primary ${isProcessing ? 'animate-spin' : 'animate-pulse'}`} />
      </label>
    </div>
  );
}; 