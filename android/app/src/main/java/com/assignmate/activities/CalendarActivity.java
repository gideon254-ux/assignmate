package com.assignmate.activities;

import android.os.Bundle;
import android.widget.CalendarView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.assignmate.R;
import com.assignmate.utils.AssignmateApplication;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import java.util.Calendar;
import java.util.Date;

public class CalendarActivity extends AppCompatActivity {
    private FirebaseAuth mAuth;
    private FirebaseFirestore mFirestore;
    private FirebaseUser currentUser;
    private CalendarView calendarView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calendar);
        
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setTitle("Calendar");
        
        mAuth = AssignmateApplication.getAuth();
        mFirestore = AssignmateApplication.getFirestore();
        currentUser = mAuth.getCurrentUser();
        
        if (currentUser == null) {
            finish();
            return;
        }
        
        calendarView = findViewById(R.id.calendarView);
        
        calendarView.setOnDateChangeListener((view, year, month, dayOfMonth) -> {
            Calendar calendar = Calendar.getInstance();
            calendar.set(year, month, dayOfMonth);
            Date selectedDate = calendar.getTime();
            loadAssignmentsForDate(selectedDate);
        });
    }
    
    private void loadAssignmentsForDate(Date date) {
        // Load assignments for selected date
        Calendar startOfDay = Calendar.getInstance();
        startOfDay.setTime(date);
        startOfDay.set(Calendar.HOUR_OF_DAY, 0);
        startOfDay.set(Calendar.MINUTE, 0);
        startOfDay.set(Calendar.SECOND, 0);
        
        Calendar endOfDay = Calendar.getInstance();
        endOfDay.setTime(date);
        endOfDay.set(Calendar.HOUR_OF_DAY, 23);
        endOfDay.set(Calendar.MINUTE, 59);
        endOfDay.set(Calendar.SECOND, 59);
        
        mFirestore.collection("assignments")
                .whereEqualTo("userId", currentUser.getUid())
                .whereGreaterThanOrEqualTo("dueDate", startOfDay.getTime())
                .whereLessThanOrEqualTo("dueDate", endOfDay.getTime())
                .get()
                .addOnSuccessListener(querySnapshot -> {
                    int count = querySnapshot.size();
                    if (count > 0) {
                        Toast.makeText(this, count + " assignment(s) due on this date", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(this, "No assignments due on this date", Toast.LENGTH_SHORT).show();
                    }
                });
    }
    
    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }
}