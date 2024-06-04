import { app } from "./appFB";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firestore = getFirestore(app)
export default async function getDocument(collection, id) {
    let docRef = doc(firestore, collection, id);

    let result = null;
    let error = null;


    try {
        result = ((await getDoc(docRef)));
        return result;
        
    } catch (e) {
        error = e;
        console.log(e)
    }

    return result ;
}