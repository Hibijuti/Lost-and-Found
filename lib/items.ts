import { db } from '@/firebaseConfig';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

export type ItemStatus = 'lost' | 'found';

export type LostFoundItem = {
  id: string;
  itemName: string;
  category: string;
  description: string;
  location: string;
  date: string;
  imageUrl: string;
  status: ItemStatus;
  postedBy: string;
  posterName: string;
  /** Denormalized for easy contact in details */
  posterEmail?: string;
  posterPhone?: string;
  claimed: boolean;
  approved: boolean;
  createdAt?: unknown;
};

const itemsCol = () => collection(db, 'items');

/** Recent items for home feed (approved only). Single-field query avoids extra composite indexes. */
export async function fetchRecentItems(limitCount = 20): Promise<LostFoundItem[]> {
  const q = query(itemsCol(), orderBy('createdAt', 'desc'), limit(80));
  const snap = await getDocs(q);
  const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) } as LostFoundItem));
  return list.filter((i) => i.approved !== false).slice(0, limitCount);
}

/** Browse with optional filters (approved listings only; loaded in batch). */
export async function fetchItemsFiltered(params: {
  status?: ItemStatus | 'all';
  search?: string;
  category?: string;
}): Promise<LostFoundItem[]> {
  const qApproved = query(itemsCol(), orderBy('createdAt', 'desc'), limit(200));
  const snap = await getDocs(qApproved);
  let list = snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as object) } as LostFoundItem))
    .filter((i) => i.approved !== false);

  if (params.status && params.status !== 'all') {
    list = list.filter((i) => i.status === params.status);
  }
  if (params.category?.trim()) {
    const c = params.category.trim().toLowerCase();
    list = list.filter((i) => i.category.toLowerCase().includes(c));
  }
  if (params.search?.trim()) {
    const s = params.search.trim().toLowerCase();
    list = list.filter(
      (i) =>
        i.itemName.toLowerCase().includes(s) ||
        i.description.toLowerCase().includes(s) ||
        i.location.toLowerCase().includes(s)
    );
  }
  return list;
}

export async function getItemById(id: string): Promise<LostFoundItem | null> {
  const snap = await getDoc(doc(db, 'items', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as object) } as LostFoundItem;
}

/** Admin: all items including pending. */
export async function fetchAllItemsAdmin(): Promise<LostFoundItem[]> {
  const q = query(itemsCol(), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) } as LostFoundItem));
}

export type CreateItemInput = {
  itemName: string;
  category: string;
  description: string;
  location: string;
  date: string;
  imageUrl: string;
  status: ItemStatus;
  postedBy: string;
  posterName: string;
  posterEmail: string;
  posterPhone: string;
};

export async function createItem(input: CreateItemInput) {
  await addDoc(itemsCol(), {
    ...input,
    claimed: false,
    // New posts start unapproved until an admin approves.
    approved: false,
    createdAt: serverTimestamp(),
  });
}

export async function updateItem(
  id: string,
  patch: Partial<
    Pick<
      LostFoundItem,
      | 'itemName'
      | 'category'
      | 'description'
      | 'location'
      | 'date'
      | 'imageUrl'
      | 'status'
      | 'claimed'
      | 'approved'
    >
  >
) {
  await updateDoc(doc(db, 'items', id), patch);
}

export async function deleteItem(id: string) {
  await deleteDoc(doc(db, 'items', id));
}
