package com.assignmate.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import com.assignmate.R;
import com.assignmate.utils.AssignmateApplication;
import com.google.android.material.button.MaterialButton;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QuerySnapshot;

public class DashboardActivity extends AppCompatActivity {
    private FirebaseAuth mAuth;
    private FirebaseFirestore mFirestore;
    private FirebaseUser currentUser;
    
    private TextView tvUserName;
    private CardView cardTotal, cardCompleted, cardPending, cardOverdue;
    private TextView tvTotal, tvCompleted, tvPending, tvOverdue;
    private MaterialButton btnAssignments, btnCalendar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);
        
        mAuth = AssignmateApplication.getAuth();
        mFirestore = AssignmateApplication.getFirestore();
        currentUser = mAuth.getCurrentUser();
        
        if (currentUser == null) {
            navigateToLogin();
            return;
        }
        
        initializeViews();
        loadUserData();
        loadStats();
        setupListeners();
    }
    
    private void initializeViews() {
        tvUserName = findViewById(R.id.tvUserName);
        cardTotal = findViewById(R.id.cardTotal);
        cardCompleted = findViewById(R.id.cardCompleted);
        cardPending = findViewById(R.id.cardPending);
        cardOverdue = findViewById(R.id.cardOverdue);
        tvTotal = findViewById(R.id.tvTotal);
        tvCompleted = findViewById(R.id.tvCompleted);
        tvPending = findViewById(R.id.tvPending);
        tvOverdue = findViewById(R.id.tvOverdue);
        btnAssignments = findViewById(R.id.btnAssignments);
        btnCalendar = findViewById(R.id.btnCalendar);
    }
    
    private void loadUserData() {
        String displayName = currentUser.getDisplayName();
        if (displayName == null || displayName.isEmpty()) {
            displayName = currentUser.getEmail();
        }
        tvUserName.setText("Welcome, " + displayName + "!");
        
        // Update last login
        mFirestore.collection("users").document(currentUser.getUid())
                .update("lastLoginAt", new java.util.Date());
    }
    
    private void loadStats() {
        String userId = currentUser.getUid();
        
        // Total assignments
        mFirestore.collection("assignments")
                .whereEqualTo("userId", userId)
                .addSnapshotListener((snapshots, error) -> {
                    if (error != null) return;
                    if (snapshots != null) {
                        tvTotal.setText(String.valueOf(snapshots.size()));
                        updateStats(snapshots);
                    }
                });
    }
    
    private void updateStats(QuerySnapshot snapshots) {
        int completed = 0;
        int pending = 0;
        int overdue = 0;
        java.util.Date now = new java.util.Date();
        
        for (com.google.firebase.firestore.DocumentSnapshot doc : snapshots.getDocuments()) {
            String status = doc.getString("status");
            java.util.Date dueDate = doc.getDate("dueDate");
            
            if ("completed".equals(status)) {
                completed++;
            } else if (dueDate != null && dueDate.before(now)) {
                overdue++;
            } else {
                pending++;
            }
        }
        
        tvCompleted.setText(String.valueOf(completed));
        tvPending.setText(String.valueOf(pending));
        tvOverdue.setText(String.valueOf(overdue));
    }
    
    private void setupListeners() {
        btnAssignments.setOnClickListener(v -> {
            startActivity(new Intent(this, AssignmentsActivity.class));
        });
        
        btnCalendar.setOnClickListener(v -> {
            startActivity(new Intent(this, CalendarActivity.class));
        });
        
        cardTotal.setOnClickListener(v -> openAssignments());
        cardCompleted.setOnClickListener(v -> openAssignments());
        cardPending.setOnClickListener(v -> openAssignments());
        cardOverdue.setOnClickListener(v -> openAssignments());
    }
    
    private void openAssignments() {
        startActivity(new Intent(this, AssignmentsActivity.class));
    }
    
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_dashboard, menu);
        return true;
    }
    
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.action_logout) {
            logout();
            return true;
        } else if (id == R.id.action_admin) {
            checkAdminAndOpen();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
    
    private void checkAdminAndOpen() {
        mFirestore.collection("users").document(currentUser.getUid())
                .get()
                .addOnSuccessListener(documentSnapshot -> {
                    if (documentSnapshot.exists()) {
                        Boolean isAdmin = documentSnapshot.getBoolean("isAdmin");
                        if (isAdmin != null && isAdmin) {
                            startActivity(new Intent(this, AdminActivity.class));
                        } else {
                            Toast.makeText(this, "Admin access required", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
    }
    
    private void logout() {
        mAuth.signOut();
        navigateToLogin();
    }
    
    private void navigateToLogin() {
        Intent intent = new Intent(this, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
}