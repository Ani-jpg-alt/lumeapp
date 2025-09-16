// This script helps you seed your Firestore database with sample products
// Run this in your browser console after setting up Firebase

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const sampleProducts = [
  {
    name: 'Jean Dress',
    description: 'A beautiful denim dress perfect for any occasion. Made with high-quality denim fabric.',
    price: 300,
    imageUrl: '/jean-dress.JPG',
    images: ['/jean-dress.JPG', '/jean-dress-2.JPG', '/jean-dress-3.JPG'],
    category: 'dresses',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true
  },
  {
    name: 'Polka Dot Dress',
    description: 'Elegant polka dot dress with a classic silhouette. Perfect for both casual and formal events.',
    price: 250,
    imageUrl: '/polka-dot-dress.JPG',
    images: ['/polka-dot-dress.JPG', '/polka-dot-dress-2.JPG', '/polka-dot-dress-3.JPG'],
    category: 'dresses',
    sizes: ['M', 'L', 'XL', 'XXL'],
    inStock: true
  },
  {
    name: 'Two Piece',
    description: 'Stylish two-piece set that can be worn together or separately. Versatile and trendy.',
    price: 350,
    imageUrl: '/two-piece.JPG',
    images: ['/two-piece.JPG', '/two-piece-2.JPG', '/two-piece-3.JPG'],
    category: 'dresses',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true
  }
];

export async function seedProducts() {
  try {
    console.log('Starting to seed products...');
    
    for (const product of sampleProducts) {
      const docRef = await addDoc(collection(db, 'products'), product);
      console.log('Product added with ID: ', docRef.id);
    }
    
    console.log('All products seeded successfully!');
  } catch (error) {
    console.error('Error seeding products: ', error);
  }
}

// Uncomment the line below to run the seeding function
// seedProducts();
