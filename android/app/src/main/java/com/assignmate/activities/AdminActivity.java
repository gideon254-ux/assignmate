package com.assignmate.activities;

import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import com.assignmate.R;
import com.assignmate.adapters.UsersAdapter;
import com.assignmate.models.User;
import com.assignmate.utils.AssignmateApplication;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.ListenerRegistration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AdminActivity extends AppCompatActivity implements UsersAdapter.OnUserClickListener {
    private FirebaseAuth mAuth;
    private FirebaseFirestore mFirestore;
    private FirebaseUser currentUser;
    private ListenerRegistration usersListener;
    
    private RecyclerView recyclerView;
    private UsersAdapter adapter;
    private SwipeRefreshLayout swipeRefreshLayout;
    private ProgressBar progressBar;
    private TextView tvTotalUsers, tvTotalAssignments, tvActiveToday;
    
    private List<User> users = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin);
        
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setTitle("Admin Dashboard");
        
        mAuth = AssignmateApplication.getAuth();
        mFirestore = AssignmateApplication.getFirestore();
        currentUser = mAuth.getCurrentUser();
        
        if (currentUser == null) {
            finish();
            return;
        }
        
        initializeViews();
        setupRecyclerView();
        setupListeners();
        loadData();
    }
    
    private void initializeViews() {
        recyclerView = findViewById(R.id.recyclerView);
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);
        progressBar = findViewById(R.id.progressBar);
        tvTotalUsers = findViewById(R.id.tvTotalUsers);
        tvTotalAssignments = findViewById(R.id.tvTotalAssignments);
        tvActiveToday = findViewById(R.id.tvActiveToday);
    }
    
    private void setupRecyclerView() {
        adapter = new UsersAdapter(users, this);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(adapter);
    }
    
    private void setupListeners() {
        swipeRefreshLayout.setOnRefreshListener(this::loadData);
    }
    
    private void loadData() {
        progressBar.setVisibility(View.VISIBLE);
        
        // Load users with real-time updates
        usersListener = mFirestore.collection("users")
                .addSnapshotListener((snapshots, error) -> {
                    swipeRefreshLayout.setRefreshing(false);
                    progressBar.setVisibility(View.GONE);
                    
                    if (error != null) {
                        Toast.makeText(this, "Error loading data", Toast.LENGTH_SHORT).show();
                        return;
                    }
                    
                    if (snapshots != null) {
                        users.clear();
                        int activeToday = 0;
                        java.util.Date today = new java.util.Date();
                        today.setHours(0);
                        today.setMinutes(0);
                        
                        for (DocumentSnapshot doc : snapshots.getDocuments()) {
                            User user = doc.toObject(User.class);
                            if (user != null) {
                                user.setId(doc.getId());
                                
                                // Get assignment count for this user
                                final User finalUser = user;
                                mFirestore.collection("assignments")
                                        .whereEqualTo("userId", user.getId())
                                        .get()
                                        .addOnSuccessListener(assignmentsSnapshot -> {
                                            finalUser.setAssignmentCount(assignmentsSnapshot.size());
                                            adapter.notifyDataSetChanged();
                                        });
                                
                                if (user.getLastLoginAt() != null && 
                                    user.getLastLoginAt().after(today)) {
                                    activeToday++;
                                }
                                
                                users.add(user);
                            }
                        }
                        
                        adapter.updateUsers(users);
                        tvTotalUsers.setText(String.valueOf(users.size()));
                        tvActiveToday.setText(String.valueOf(activeToday));
                        
                        // Get total assignments
                        mFirestore.collection("assignments")
                                .get()
                                .addOnSuccessListener(assignmentsSnapshot -> {
                                    tvTotalAssignments.setText(String.valueOf(assignmentsSnapshot.size()));
                                });
                    }
                });
    }
    
    @Override
    public void onUserClick(User user) {
        // Show user details
        Toast.makeText(this, "User: " + user.getName(), Toast.LENGTH_SHORT).show();
    }
    
    @Override
    public void onToggleAdmin(User user) {
        if (user.getId().equals(currentUser.getUid())) {
            Toast.makeText(this, "Cannot modify your own admin status", Toast.LENGTH_SHORT).show();
            return;
        }
        
        boolean newAdminStatus = !user.isAdmin();
        mFirestore.collection("users").document(user.getId())
                .update("isAdmin", newAdminStatus)
                .addOnSuccessListener(aVoid -> {
                    Toast.makeText(this, "Admin status updated", Toast.LENGTH_SHORT).show();
                })
                .addOnFailureListener(e -> {
                    Toast.makeText(this, "Failed to update", Toast.LENGTH_SHORT).show();
                });
    }
    
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            onBackPressed();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (usersListener != null) {
            usersListener.remove();
        }
    }
}