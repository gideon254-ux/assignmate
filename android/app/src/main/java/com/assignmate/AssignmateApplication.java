package com.assignmate.utils;

import android.app.Application;
import android.util.Log;
import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreSettings;

public class AssignmateApplication extends Application {
    private static final String TAG = "AssignmateApp";
    private static FirebaseAuth mAuth;
    private static FirebaseFirestore mFirestore;

    @Override
    public void onCreate() {
        super.onCreate();
        
        // Initialize Firebase
        FirebaseApp.initializeApp(this);
        
        mAuth = FirebaseAuth.getInstance();
        mFirestore = FirebaseFirestore.getInstance();
        
        // Enable offline persistence
        FirebaseFirestoreSettings settings = new FirebaseFirestoreSettings.Builder()
                .setPersistenceEnabled(true)
                .setCacheSizeBytes(FirebaseFirestoreSettings.CACHE_SIZE_UNLIMITED)
                .build();
        mFirestore.setFirestoreSettings(settings);
        
        Log.d(TAG, "Firebase initialized with offline persistence");
    }

    public static FirebaseAuth getAuth() {
        return mAuth;
    }

    public static FirebaseFirestore getFirestore() {
        return mFirestore;
    }
}