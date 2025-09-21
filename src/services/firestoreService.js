import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  setDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Products collection
export const productsCollection = collection(db, 'products');

export async function getProducts() {
  try {
    const querySnapshot = await getDocs(productsCollection);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
}

export async function getProduct(productId) {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
}

// Orders collection
export const ordersCollection = collection(db, 'orders');

export async function createOrder(orderData) {
  try {
    const docRef = await addDoc(ordersCollection, {
      ...orderData,
      createdAt: new Date(),
      status: 'pending'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getOrder(orderId) {
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status: status,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function getUserOrders(userId) {
  try {
    const q = query(
      ordersCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
}

// Cart collection and functions
export const cartsCollection = collection(db, 'carts');

export async function saveUserCart(userId, cartItems) {
  try {
    const cartDocRef = doc(db, 'carts', userId);
    await setDoc(cartDocRef, {
      userId: userId,
      items: cartItems,
      updatedAt: new Date()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving user cart:', error);
    throw error;
  }
}

export async function getUserCart(userId) {
  try {
    const cartDocRef = doc(db, 'carts', userId);
    const docSnap = await getDoc(cartDocRef);

    if (docSnap.exists()) {
      return docSnap.data().items || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error getting user cart:', error);
    return [];
  }
}

export async function clearUserCart(userId) {
  try {
    const cartDocRef = doc(db, 'carts', userId);
    await updateDoc(cartDocRef, {
      items: [],
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error clearing user cart:', error);
    throw error;
  }
}
