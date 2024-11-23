import { Firestore } from '@google-cloud/firestore';
import firebase from "../firebase.json" with { type: "json" };
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export default class Database {
    constructor() {
        this.db = new Firestore({
            projectId: firebase.project_id,
            keyFilename: path.join(__dirname, '../firebase.json'),
        });
    }

    async saveReward(id, user_id, name, type, purchase_date, redeem_date, is_redeemed) {
        var ref = this.db.collection("rewards").doc(id.toString());
        await ref.set({
            id, 
            user_id, 
            name, 
            type, 
            purchase_date, 
            redeem_date: redeem_date ?? null,
            is_redeemed
        });
    }


    configureObserver(type, callbackGroup) {
        return this.db.collection(type).onSnapshot(async querySnapshot => {
            let changes = {
                added: [],
                modified: [],
                removed: []
            };
        
            querySnapshot.docChanges().forEach(change => {
                changes[change.type].push({...change.doc.data(), _id:change.doc.id});
            });
        
            for (let i = 0; i < callbackGroup.length; i++) {
                try {
                    await callbackGroup[i].call(null, changes);
                } catch (err) {
                    console.log(`Error in callback ${i} of ${type}: ${err.toString()}`);
                }
            }
        });
    }
}