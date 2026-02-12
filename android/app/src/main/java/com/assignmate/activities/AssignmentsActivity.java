package com.assignmate.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import com.assignmate.R;
import com.assignmate.adapters.AssignmentsAdapter;
import com.assignmate.models.Assignment;
import com.assignmate.utils.AssignmateApplication;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.ListenerRegistration;
import com.google.firebase.firestore.Query;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class AssignmentsActivity extends AppCompatActivity implements AssignmentsAdapter.OnAssignmentClickListener {
    private FirebaseAuth mAuth;
    private FirebaseFirestore mFirestore;
    private FirebaseUser currentUser;
    private ListenerRegistration assignmentsListener;
    
    private RecyclerView recyclerView;
    private AssignmentsAdapter adapter;
    private SwipeRefreshLayout swipeRefreshLayout;
    private FloatingActionButton fabAdd;
    private ProgressBar progressBar;
    private TextView tvEmpty;
    
    private List<Assignment> assignments = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_assignments);
        
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setTitle("Assignments");
        
        mAuth = AssignmateApplication.getAuth();
        mFirestore = AssignmateApplication.getFirestore();
        currentUser = mAuth.getCurrentUser();
        
        if (currentUser == null) {
            navigateToLogin();
            return;
        }
        
        initializeViews();
        setupRecyclerView();
        setupListeners();
        loadAssignments();
    }
    
    private void initializeViews() {
        recyclerView = findViewById(R.id.recyclerView);
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);
        fabAdd = findViewById(R.id.fabAdd);
        progressBar = findViewById(R.id.progressBar);
        tvEmpty = findViewById(R.id.tvEmpty);
    }
    
    private void setupRecyclerView() {
        adapter = new AssignmentsAdapter(assignments, this);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(adapter);
    }
    
    private void setupListeners() {
        fabAdd.setOnClickListener(v -> {
            // Open add assignment dialog/activity
            showAddAssignmentDialog();
        });
        
        swipeRefreshLayout.setOnRefreshListener(this::loadAssignments);
    }
    
    private void loadAssignments() {
        progressBar.setVisibility(View.VISIBLE);
        
        // Real-time updates with Firestore
        assignmentsListener = mFirestore.collection("assignments")
                .whereEqualTo("userId", currentUser.getUid())
                .orderBy("dueDate", Query.Direction.ASCENDING)
                .addSnapshotListener((snapshots, error) -> {
                    swipeRefreshLayout.setRefreshing(false);
                    progressBar.setVisibility(View.GONE);
                    
                    if (error != null) {
                        Toast.makeText(this, "Error loading assignments", Toast.LENGTH_SHORT).show();
                        return;
                    }
                    
                    if (snapshots != null) {
                        assignments.clear();
                        for (DocumentSnapshot doc : snapshots.getDocuments()) {
                            Assignment assignment = doc.toObject(Assignment.class);
                            if (assignment != null) {
                                assignment.setId(doc.getId());
                                assignments.add(assignment);
                            }
                        }
                        
                        adapter.updateAssignments(assignments);
                        
                        if (assignments.isEmpty()) {
                            tvEmpty.setVisibility(View.VISIBLE);
                            recyclerView.setVisibility(View.GONE);
                        } else {
                            tvEmpty.setVisibility(View.GONE);
                            recyclerView.setVisibility(View.VISIBLE);
                        }
                    }
                });
    }
    
    private void showAddAssignmentDialog() {
        // For now, show a toast. In a real app, open a dialog or activity
        Toast.makeText(this, "Add Assignment - Feature coming soon", Toast.LENGTH_SHORT).show();
    }
    
    @Override
    public void onAssignmentClick(Assignment assignment) {
        // Show assignment details
        showAssignmentDetails(assignment);
    }
    
    @Override
    public void onAssignmentComplete(Assignment assignment) {
        // Mark as complete
        mFirestore.collection("assignments").document(assignment.getId())
                .update("status", "completed")
                .addOnSuccessListener(aVoid -> {
                    Toast.makeText(this, "Marked as completed", Toast.LENGTH_SHORT).show();
                })
                .addOnFailureListener(e -> {
                    Toast.makeText(this, "Failed to update", Toast.LENGTH_SHORT).show();
                });
    }
    
    @Override
    public void onAssignmentDelete(Assignment assignment) {
        new AlertDialog.Builder(this)
                .setTitle("Delete Assignment")
                .setMessage("Are you sure you want to delete \"" + assignment.getTitle() + "\"?")
                .setPositiveButton("Delete", (dialog, which) -> {
                    deleteAssignment(assignment);
                })
                .setNegativeButton("Cancel", null)
                .show();
    }
    
    private void deleteAssignment(Assignment assignment) {
        mFirestore.collection("assignments").document(assignment.getId())
                .delete()
                .addOnSuccessListener(aVoid -> {
                    Toast.makeText(this, "Assignment deleted", Toast.LENGTH_SHORT).show();
                })
                .addOnFailureListener(e -> {
                    Toast.makeText(this, "Failed to delete", Toast.LENGTH_SHORT).show();
                });
    }
    
    private void showAssignmentDetails(Assignment assignment) {
        new AlertDialog.Builder(this)
                .setTitle(assignment.getTitle())
                .setMessage("Subject: " + assignment.getSubject() + "\n" +
                           "Due: " + assignment.getDueDate() + "\n" +
                           "Priority: " + assignment.getPriority() + "\n" +
                           "Status: " + assignment.getStatus())
                .setPositiveButton("Close", null)
                .show();
    }
    
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            onBackPressed();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
    
    private void navigateToLogin() {
        Intent intent = new Intent(this, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (assignmentsListener != null) {
            assignmentsListener.remove();
        }
    }
}