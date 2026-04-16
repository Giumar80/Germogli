import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  increment 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export const startCropBatch = async (userId: string, seed: any) => {
  try {
    const harvestDays = parseInt(seed.time.split('-')[1]) || 7;
    const cropData = {
      seedId: seed.id,
      name: seed.name,
      phase: 'Attivazione',
      harvestTime: harvestDays,
      day: 1,
      progress: 0,
      image: seed.image,
      lastWatered: new Date().toISOString(),
      stats: {
        temp: '22°C',
        watering: '2x/dì'
      },
      ownerId: userId,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'crops'), cropData);
    
    // Update user stats
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      totalBatches: increment(1)
    });

    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'crops');
  }
};

export const waterCrop = async (cropId: string) => {
  try {
    const cropRef = doc(db, 'crops', cropId);
    await updateDoc(cropRef, {
      lastWatered: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `crops/${cropId}`);
  }
};

export const deleteCrop = async (userId: string, cropId: string) => {
  try {
    await deleteDoc(doc(db, 'crops', cropId));
    
    // Update user stats
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      totalBatches: increment(-1)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `crops/${cropId}`);
  }
};

export const updateCrop = async (cropId: string, data: any) => {
  try {
    const cropRef = doc(db, 'crops', cropId);
    await updateDoc(cropRef, data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `crops/${cropId}`);
  }
};

export const advanceCropDay = async (cropId: string, currentCreatedAt: any) => {
  try {
    const createdDate = currentCreatedAt.toDate ? currentCreatedAt.toDate() : new Date(currentCreatedAt);
    // Subtract one day from createdAt to "advance" the progress by one day
    const newDate = new Date(createdDate.getTime() - (24 * 60 * 60 * 1000));
    
    const cropRef = doc(db, 'crops', cropId);
    await updateDoc(cropRef, {
      createdAt: newDate
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `crops/${cropId}`);
  }
};

export const calculateProgress = (createdAt: any, harvestTime: number) => {
  if (!createdAt) return { day: 1, progress: 0 };
  
  const createdDate = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const progress = Math.min(Math.round((diffDays / harvestTime) * 100), 100);
  return {
    day: diffDays,
    progress
  };
};
