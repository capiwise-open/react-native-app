import { firestore } from '../../App';
import { getDocs, collection, updateDoc, getDoc, doc, addDoc, setDoc } from 'firebase/firestore';

export const log2fs = (log: any) => {
    (async () => {
        const _id = new Date().getTime().toString();
        const docRef = doc(firestore, 'logs', _id);
        setDoc(docRef, {
            log: JSON.stringify(log)
        });

        // const _doc = doc(firestore, "logs", email);
        // const docSnapshot = await getDoc(_doc);
        // if (docSnapshot.exists()) {
        //     await updateDoc(_doc, { log: docSnapshot.data() + JSON.stringify(log) });
        // }
    })();
}
