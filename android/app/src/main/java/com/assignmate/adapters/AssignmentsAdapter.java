package com.assignmate.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.assignmate.R;
import com.assignmate.models.Assignment;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;

public class AssignmentsAdapter extends RecyclerView.Adapter<AssignmentsAdapter.ViewHolder> {
    private List<Assignment> assignments;
    private OnAssignmentClickListener listener;
    private SimpleDateFormat dateFormat = new SimpleDateFormat("MMM d, yyyy", Locale.getDefault());

    public interface OnAssignmentClickListener {
        void onAssignmentClick(Assignment assignment);
        void onAssignmentComplete(Assignment assignment);
        void onAssignmentDelete(Assignment assignment);
    }

    public AssignmentsAdapter(List<Assignment> assignments, OnAssignmentClickListener listener) {
        this.assignments = assignments;
        this.listener = listener;
    }

    public void updateAssignments(List<Assignment> newAssignments) {
        this.assignments = newAssignments;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_assignment, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Assignment assignment = assignments.get(position);
        
        holder.tvTitle.setText(assignment.getTitle());
        holder.tvSubject.setText(assignment.getSubject());
        holder.tvDueDate.setText("Due: " + dateFormat.format(assignment.getDueDate()));
        holder.tvPriority.setText(assignment.getPriority().substring(0, 1).toUpperCase() + 
                                   assignment.getPriority().substring(1));
        holder.tvStatus.setText(assignment.getStatus().replace("_", " "));
        
        // Status color
        int statusColor;
        switch (assignment.getStatus()) {
            case "completed":
                statusColor = holder.itemView.getContext().getResources().getColor(R.color.status_completed);
                break;
            case "overdue":
                statusColor = holder.itemView.getContext().getResources().getColor(R.color.status_overdue);
                break;
            case "in_progress":
                statusColor = holder.itemView.getContext().getResources().getColor(R.color.status_in_progress);
                break;
            default:
                statusColor = holder.itemView.getContext().getResources().getColor(R.color.status_pending);
        }
        holder.tvStatus.setTextColor(statusColor);
        
        // Priority color
        int priorityColor;
        switch (assignment.getPriority()) {
            case "high":
                priorityColor = holder.itemView.getContext().getResources().getColor(R.color.priority_high);
                break;
            case "medium":
                priorityColor = holder.itemView.getContext().getResources().getColor(R.color.priority_medium);
                break;
            default:
                priorityColor = holder.itemView.getContext().getResources().getColor(R.color.priority_low);
        }
        holder.tvPriority.setTextColor(priorityColor);
        
        // Show/hide complete button
        if ("completed".equals(assignment.getStatus())) {
            holder.btnComplete.setVisibility(View.GONE);
        } else {
            holder.btnComplete.setVisibility(View.VISIBLE);
        }
        
        holder.itemView.setOnClickListener(v -> listener.onAssignmentClick(assignment));
        holder.btnComplete.setOnClickListener(v -> listener.onAssignmentComplete(assignment));
        holder.btnDelete.setOnClickListener(v -> listener.onAssignmentDelete(assignment));
    }

    @Override
    public int getItemCount() {
        return assignments.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvTitle, tvSubject, tvDueDate, tvPriority, tvStatus;
        Button btnComplete, btnDelete;

        ViewHolder(View itemView) {
            super(itemView);
            tvTitle = itemView.findViewById(R.id.tvTitle);
            tvSubject = itemView.findViewById(R.id.tvSubject);
            tvDueDate = itemView.findViewById(R.id.tvDueDate);
            tvPriority = itemView.findViewById(R.id.tvPriority);
            tvStatus = itemView.findViewById(R.id.tvStatus);
            btnComplete = itemView.findViewById(R.id.btnComplete);
            btnDelete = itemView.findViewById(R.id.btnDelete);
        }
    }
}