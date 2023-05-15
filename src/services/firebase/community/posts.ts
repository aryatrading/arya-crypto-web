import { getApp } from "@firebase/app";
import {
  collection,
  orderBy,
  query,
  onSnapshot,
  QuerySnapshot,
  FirestoreError,
  getFirestore,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { setPosts } from "../../redux/postsSlice";
import { store } from "../../redux/store";
import { PostTypes } from "../../../types/asset";

const db = getFirestore(getApp());
const functions = getFunctions(getApp(), "europe-west3");

const searchHttpsCallable = httpsCallable(functions, "search", {});
const analyticsLogosHttpsCallable = httpsCallable(
  functions,
  "analyticsLogos",
  {}
);

export const getPosts = async ({
  searchTerm,
  modules = ["posts"],
}: {
  searchTerm: string;
  modules?: "posts"[];
}) => {
  store.dispatch(setPosts([]));
  const options = {
    search: searchTerm,
    modules: modules,
    offset: 0,
  };

  return searchHttpsCallable(options).then((response: any) => {
    store.dispatch(
      setPosts(
        response?.data?.posts?.filter(
          (post: PostTypes) => post?.RestrictedTo == null
        ) || []
      )
    );
  });
};

export const userPic = (user: any) => {
  if (!user?.PictureDate || !user?.Id)
    return "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg";
  return `https://firebasestorage.googleapis.com/v0/b/arya-9f90f.appspot.com/o/profile-images%2F${user.Id}?alt=media`;
};

export const streamPostUpdates = (
  fullPostId: string,
  snapshot: (snapshot: QuerySnapshot) => void,
  error: (error: FirestoreError) => void
) => {
  const [authorId, postId] = fullPostId.split("/");
  const collectionRef = collection(
    db,
    "users",
    authorId,
    "posts",
    postId,
    "updates"
  );
  const q = query(collectionRef, orderBy("Date", "desc"));
  return onSnapshot(q, snapshot, error);
};

export const getMarketKey = (
  symbol?: string | null,
  market?: string | null,
  to?: string | null
) => {
  return `${symbol}_${market}_${to}`;
};

export async function fetchPendingMarketItemLogos(
  marketItems: any,
  setLogo: any
) {
  await analyticsLogosHttpsCallable({
    marketItems,
  })
    .then(({ data }: { data: any }) => {
      setLogo(data);
    })
    .catch((e: any) => {
      console.warn("Could not fetch asset icons", e);
    });
}
