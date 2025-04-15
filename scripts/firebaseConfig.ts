import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

const PROD_FIRE_BASE_CONFIG = {    
    apiKey: "AIzaSyCpE_MAo1NotLF5WAEhBq6wDP5R4F8UZpY",
    authDomain: "white-sandbox-446105-b0.firebaseapp.com",
    projectId: "white-sandbox-446105-b0",
    storageBucket: "fc-one-misc-v2",
    messagingSenderId: "956557654606",
    appId: "1:956557654606:web:014942b294244ecffe211f",
    measurementId: "G-LNMZKKVSLX"
};

let firebaseApp = getApps()[0];
firebaseApp = initializeApp(PROD_FIRE_BASE_CONFIG);

const storage = getStorage(firebaseApp);
 
export {storage};

