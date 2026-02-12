package com.assignmate.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.assignmate.R;
import com.assignmate.models.User;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;

public class UsersAdapter extends RecyclerView.Adapter<UsersAdapter.ViewHolder> {
    private List<User> users;
    private OnUserClickListener listener;
    private SimpleDateFormat dateFormat = new SimpleDateFormat("MMM d, yyyy", Locale.getDefault());

    public interface OnUserClickListener {
        void onUserClick(User user);
        void onToggleAdmin(User user);
    }

    public UsersAdapter(List<User> users, OnUserClickListener listener) {
        this.users = users;
        this.listener = listener;
    }

    public void updateUsers(List<User> newUsers) {
        this.users = newUsers;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_user, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        User user = users.get(position);
        
        holder.tvName.setText(user.getName());
        holder.tvEmail.setText(user.getEmail());
        holder.tvCreated.setText("Joined: " + dateFormat.format(user.getCreatedAt()));
        holder.tvAssignments.setText(user.getAssignmentCount() + " assignments");
        
        if (user.isAdmin()) {
            holder.btnToggleAdmin.setText("Remove Admin");
            holder.btnToggleAdmin.setBackgroundColor(holder.itemView.getContext().getResources()
                    .getColor(android.R.color.holo_red_light));
        } else {
            holder.btnToggleAdmin.setText("Make Admin");
            holder.btnToggleAdmin.setBackgroundColor(holder.itemView.getContext().getResources()
                    .getColor(android.R.color.holo_green_light));
        }
        
        holder.itemView.setOnClickListener(v -> listener.onUserClick(user));
        holder.btnToggleAdmin.setOnClickListener(v -> listener.onToggleAdmin(user));
    }

    @Override
    public int getItemCount() {
        return users.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvName, tvEmail, tvCreated, tvAssignments;
        Button btnToggleAdmin;

        ViewHolder(View itemView) {
            super(itemView);
            tvName = itemView.findViewById(R.id.tvName);
            tvEmail = itemView.findViewById(R.id.tvEmail);
            tvCreated = itemView.findViewById(R.id.tvCreated);
            tvAssignments = itemView.findViewById(R.id.tvAssignments);
            btnToggleAdmin = itemView.findViewById(R.id.btnToggleAdmin);
        }
    }
}